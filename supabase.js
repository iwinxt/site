/* ================================================================
   GranjaOS — Supabase Client
   Arquivo: supabase.js
================================================================ */

const SUPABASE_URL  = 'https://cjvdhnclmbjhcurerfge.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqdmRobmNsbWJqaGN1cmVyZmdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNjAxMjMsImV4cCI6MjA4OTkzNjEyM30.ehpf_kpdM3k9HVzhip8KXKCOeKNwykE_-5r1vbfRZgQ';
// ---------------------------------------------------------------

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON);

// ================================================================
//  UTILITÁRIOS INTERNOS
// ================================================================
function sbErr(label, error) {
  console.error(`[Supabase] ${label}:`, error?.message || error);
  showToast(`Erro: ${label}`, 'error');
}

// ================================================================
//  GALINHEIROS
// ================================================================
async function sbGalinheiros() {
  const { data, error } = await db.from('galinheiros').select('*').eq('ativo', true).order('codigo');
  if (error) { sbErr('carregar galinheiros', error); return []; }
  return data;
}

// ================================================================
//  LOTES
// ================================================================
async function sbLotes(filtro = {}) {
  let q = db.from('vw_lotes').select('*');
  if (filtro.status)  q = q.eq('status', filtro.status);
  if (filtro.search)  q = q.or(`codigo.ilike.%${filtro.search}%,raca.ilike.%${filtro.search}%`);
  const { data, error } = await q.order('codigo');
  if (error) { sbErr('carregar lotes', error); return []; }
  return data;
}

async function sbInserirLote(lote) {
  // Busca id do galinheiro pelo código
  const { data: g } = await db.from('galinheiros').select('id').eq('codigo', lote.galinheiro).single();
  const { data, error } = await db.from('lotes').insert({
    codigo:        lote.codigo,
    raca:          lote.raca,
    galinheiro_id: g?.id ?? null,
    qtd_atual:     lote.qtd,
    idade_semanas: lote.idade || 0,
    status:        lote.status || 'Ativo',
    data_entrada:  lote.data,
    observacoes:   lote.obs || null,
  }).select().single();
  if (error) { sbErr('inserir lote', error); return null; }
  return data;
}

async function sbRemoverLote(id) {
  const { error } = await db.from('lotes').delete().eq('id', id);
  if (error) { sbErr('remover lote', error); return false; }
  return true;
}

// ================================================================
//  PRODUÇÃO
// ================================================================
async function sbProducao(dias = 14) {
  const desde = new Date();
  desde.setDate(desde.getDate() - dias);
  const { data, error } = await db
    .from('vw_producao')
    .select('*')
    .gte('data_coleta', desde.toISOString().split('T')[0])
    .order('data_coleta', { ascending: false });
  if (error) { sbErr('carregar produção', error); return []; }
  return data;
}

async function sbInserirProducao(p) {
  const { data: lote } = await db.from('lotes').select('id').eq('codigo', p.lote).single();
  const { data, error } = await db.from('producao').insert({
    data_coleta:    p.data,
    lote_id:        lote?.id,
    ovos_primeira:  p.primeira  || 0,
    ovos_segunda:   p.segunda   || 0,
    ovos_quebrados: p.quebrados || 0,
  }).select().single();
  if (error) { sbErr('inserir produção', error); return null; }
  return data;
}

// ================================================================
//  ESTOQUE
// ================================================================
async function sbEstoque() {
  const { data, error } = await db.from('vw_estoque_alerta').select('*');
  if (error) { sbErr('carregar estoque', error); return []; }
  return data;
}

async function sbEntradaEstoque(payload) {
  // Soma na quantidade atual
  const { data: atual } = await db.from('estoque').select('quantidade_kg').eq('id', payload.id).single();
  const nova = (atual?.quantidade_kg || 0) + payload.quantidade;
  const { error } = await db.from('estoque').update({ quantidade_kg: nova }).eq('id', payload.id);
  if (error) { sbErr('entrada de estoque', error); return false; }

  // Registra transação financeira se houve valor pago
  if (payload.valor > 0) {
    await db.from('transacoes').insert({
      data_transac: payload.data,
      descricao:    `Compra ${payload.nome} — ${payload.quantidade} kg`,
      categoria:    'Ração',
      tipo:         'Despesa',
      valor:        payload.valor,
    });
  }
  return true;
}

// ================================================================
//  ALIMENTAÇÃO / CONSUMO
// ================================================================
async function sbAlimentacao(limit = 30) {
  const { data, error } = await db
    .from('alimentacao')
    .select(`*, lotes(codigo), estoque(nome)`)
    .order('data_consumo', { ascending: false })
    .limit(limit);
  if (error) { sbErr('carregar alimentação', error); return []; }
  // Normaliza para o formato esperado pelo frontend
  return data.map(a => ({
    id:          a.id,
    data:        a.data_consumo,
    racao:       a.tipo_racao,
    lote:        a.lotes?.codigo || '—',
    qtd:         a.quantidade_kg,
    responsavel: a.responsavel || '—',
  }));
}

async function sbInserirConsumo(c) {
  // Busca ids de lote e estoque
  const { data: lote }    = await db.from('lotes').select('id').eq('codigo', c.lote).single();
  const { data: estoqueR } = await db.from('estoque').select('id').eq('nome', c.tipo).single();

  const { data, error } = await db.from('alimentacao').insert({
    data_consumo:  c.data,
    lote_id:       lote?.id    ?? null,
    estoque_id:    estoqueR?.id ?? null,   // trigger SQL desconta automaticamente
    tipo_racao:    c.tipo,
    quantidade_kg: c.qtd,
    responsavel:   c.responsavel || null,
    observacoes:   c.obs || null,
  }).select().single();
  if (error) { sbErr('registrar consumo', error); return null; }
  return data;
}

// ================================================================
//  VACINAÇÕES
// ================================================================
async function sbVacinacoes() {
  const { data, error } = await db
    .from('vacinacoes')
    .select(`*, lotes(codigo)`)
    .eq('status', 'Pendente')
    .order('data_prevista');
  if (error) { sbErr('carregar vacinações', error); return []; }
  return data.map(v => {
    const dt  = new Date(v.data_prevista + 'T12:00:00');
    const mes = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'][dt.getMonth()];
    return {
      id:      v.id,
      dia:     String(dt.getDate()).padStart(2,'0'),
      mes,
      nome:    v.nome_vacina,
      lote:    v.lotes?.codigo || '—',
      urgente: v.urgente,
      status:  v.status,
    };
  });
}

async function sbAgendarVacina(v) {
  const { data: lote } = await db.from('lotes').select('id').eq('codigo', v.lote).single();
  const { data, error } = await db.from('vacinacoes').insert({
    lote_id:       lote?.id,
    nome_vacina:   v.nome,
    data_prevista: v.data,
    urgente:       v.urgente,
    via_aplicacao: v.via || null,
    responsavel:   v.responsavel || null,
    observacoes:   v.obs || null,
  }).select().single();
  if (error) { sbErr('agendar vacinação', error); return null; }
  return data;
}

// ================================================================
//  SAÚDE — OCORRÊNCIAS
// ================================================================
async function sbOcorrencias() {
  const { data, error } = await db
    .from('ocorrencias_saude')
    .select(`*, lotes(codigo)`)
    .order('data_ocorr', { ascending: false });
  if (error) { sbErr('carregar ocorrências', error); return []; }
  return data.map(o => ({
    id:     o.id,
    data:   o.data_ocorr,
    lote:   o.lotes?.codigo || '—',
    tipo:   o.tipo,
    desc:   o.descricao,
    status: o.status,
  }));
}

async function sbInserirOcorrencia(o) {
  const { data: lote } = await db.from('lotes').select('id').eq('codigo', o.lote).single();
  const { data, error } = await db.from('ocorrencias_saude').insert({
    lote_id:   lote?.id,
    data_ocorr: o.data,
    tipo:       o.tipo,
    descricao:  o.desc,
    status:     o.status,
  }).select().single();
  if (error) { sbErr('inserir ocorrência', error); return null; }
  return data;
}

// ================================================================
//  FINANCEIRO
// ================================================================
async function sbTransacoes(filtroTipo = '') {
  let q = db.from('transacoes').select('*').order('data_transac', { ascending: false });
  if (filtroTipo) q = q.eq('tipo', filtroTipo);
  const { data, error } = await q;
  if (error) { sbErr('carregar transações', error); return []; }
  return data.map(t => ({
    id:        t.id,
    data:      t.data_transac,
    desc:      t.descricao,
    categoria: t.categoria,
    tipo:      t.tipo,
    valor:     Number(t.valor),
  }));
}

async function sbInserirTransacao(t) {
  const { data, error } = await db.from('transacoes').insert({
    data_transac: t.data,
    descricao:    t.desc,
    categoria:    t.categoria,
    tipo:         t.tipo,
    valor:        t.valor,
  }).select().single();
  if (error) { sbErr('inserir transação', error); return null; }
  return data;
}

// ================================================================
//  REALTIME — escuta mudanças em tempo real
//  Chame sbSubscribeAll() uma vez após conectar.
//  Ao receber evento, chama o callback com o nome da tabela.
// ================================================================
function sbSubscribeAll(onChangeCallback) {
  const tabelas = ['lotes','producao','estoque','alimentacao','vacinacoes','ocorrencias_saude','transacoes'];
  tabelas.forEach(t => {
    db.channel(`granja:${t}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: t }, () => {
        onChangeCallback(t);
      })
      .subscribe();
  });
}