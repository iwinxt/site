/* ================================================================
   GranjaOS — app.js  (versão Supabase)
================================================================ */
'use strict';

// ================================================================
//  ESTADO — cache local dos dados vindos do Supabase
// ================================================================
const state = {
  animais:     [],
  producao:    [],
  alimentacao: [],
  estoque:     [],
  saude:       [],
  vacinas:     [],
  financeiro:  [],
  charts:      {},
};

// ================================================================
//  UTILITÁRIOS
// ================================================================
const fmt    = n => new Intl.NumberFormat('pt-BR').format(n);
const fmtBRL = n => new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(n);
const today  = () => new Date().toISOString().split('T')[0];

function fmtDate(d) {
  if (!d) return '—';
  const [y, m, day] = String(d).split('T')[0].split('-');
  return `${day}/${m}/${y}`;
}

function statusBadge(s) {
  const m = { Ativo:'green', Quarentena:'amber', Descarte:'red',
    'Em Tratamento':'amber', Resolvido:'green', Monitorando:'blue', Encerrado:'blue' };
  return `<span class="badge badge-${m[s]||'blue'}">${s}</span>`;
}

function tipoBadge(t) {
  return t === 'Receita'
    ? `<span class="badge badge-green">${t}</span>`
    : `<span class="badge badge-red">${t}</span>`;
}

// ================================================================
//  LOADING OVERLAY
// ================================================================
function setLoading(on) {
  let el = document.getElementById('loadingOverlay');
  if (!el) {
    el = document.createElement('div');
    el.id = 'loadingOverlay';
    el.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;display:flex;align-items:center;justify-content:center';
    el.innerHTML = `<div style="width:36px;height:36px;border:3px solid #2e3020;border-top-color:#c8b84a;border-radius:50%;animation:spin .7s linear infinite"></div>
      <style>@keyframes spin{to{transform:rotate(360deg)}}</style>`;
    document.body.appendChild(el);
  }
  el.style.display = on ? 'flex' : 'none';
}

// ================================================================
//  BOOT
// ================================================================
document.addEventListener('DOMContentLoaded', async () => {
  initDates();
  initNav();
  initToggle();
  initNotif();

  setLoading(true);
  await loadAll();
  setLoading(false);

  initModalEvents();
  initCharts();

  // Realtime — atualiza a seção afetada ao detectar mudanças no banco
  sbSubscribeAll(async (tabela) => {
    const mapa = {
      lotes:             loadAnimais,
      producao:          loadProducao,
      estoque:           loadEstoque,
      alimentacao:       loadAlimentacao,
      vacinacoes:        loadVacinas,
      ocorrencias_saude: loadSaude,
      transacoes:        loadFinanceiro,
    };
    if (mapa[tabela]) await mapa[tabela]();
    updateDashboardKPIs();
    updateChart();
  });
});

// ================================================================
//  CARREGAMENTO DE DADOS
// ================================================================
async function loadAll() {
  await Promise.all([
    loadAnimais(), loadProducao(), loadEstoque(),
    loadAlimentacao(), loadVacinas(), loadSaude(), loadFinanceiro(),
  ]);
  updateDashboardKPIs();
}

async function loadAnimais() {
  const data = await sbLotes();
  state.animais = data.map(l => ({
    id:         l.id,
    lote:       l.codigo,
    raca:       l.raca,
    galinheiro: l.galinheiro_codigo || '—',
    qtd:        l.qtd_atual,
    idade:      l.idade_semanas,
    status:     l.status,
    data:       l.data_entrada,
  }));
  renderAnimais();
  renderLotesList();
  populateLoteSelects();
}

async function loadProducao() {
  const data = await sbProducao(14);
  state.producao = data.map(p => ({
    id:          p.id,
    data:        p.data_coleta,
    lote:        p.lote_codigo,
    galinheiro:  p.galinheiro_codigo || '—',
    primeira:    p.ovos_primeira,
    segunda:     p.ovos_segunda,
    quebrados:   p.ovos_quebrados,
    total:       p.ovos_total,
    taxa_postura: p.taxa_postura,
  }));
  renderProducao();
  updateProducaoKPIs();
}

async function loadEstoque() {
  const data = await sbEstoque();
  state.estoque = data.map(e => ({
    id:       e.id,
    nome:     e.nome,
    qtd:      Number(e.quantidade_kg),
    max:      Number(e.capacidade_max),
    alerta:   Number(e.nivel_alerta),
    unidade:  e.unidade,
    pct:      Number(e.percentual),
    emAlerta: e.em_alerta,
  }));
  renderEstoque();
  populateLoteSelects();
}

async function loadAlimentacao() {
  state.alimentacao = await sbAlimentacao(30);
  renderHistoricoAlimentacao();
}

async function loadVacinas() {
  state.vacinas = await sbVacinacoes();
  renderVacinas();
}

async function loadSaude() {
  state.saude = await sbOcorrencias();
  renderOcorrencias();
}

async function loadFinanceiro() {
  state.financeiro = await sbTransacoes();
  renderFinanceiro();
  updateFinanceiroKPIs();
}

// ================================================================
//  INIT UI
// ================================================================
function initDates() {
  const now  = new Date();
  document.getElementById('todayDate').textContent   = now.toLocaleDateString('pt-BR',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  document.getElementById('sidebarDate').textContent = now.toLocaleDateString('pt-BR',{day:'2-digit',month:'short',year:'numeric'});
  ['dataProd','finData','saudeData','prodData','loteData','vacinaData','estoqueDataEnt','alimentacaoData'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = today();
  });
}

function initNav() {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      document.getElementById(`page-${btn.dataset.page}`).classList.add('active');
      document.getElementById('pageTitle').textContent = btn.textContent.trim().replace(/^[^\w]+/,'').trim();
      document.getElementById('sidebar').classList.remove('open');
    });
  });
}

function initToggle() {
  document.getElementById('menuToggle').addEventListener('click', () =>
    document.getElementById('sidebar').classList.toggle('open'));
}

function initNotif() {
  document.getElementById('notifBtn').addEventListener('click', e => {
    e.stopPropagation();
    document.getElementById('notifPanel').classList.toggle('open');
  });
  document.addEventListener('click', () => document.getElementById('notifPanel').classList.remove('open'));
}

function initModalEvents() {
  document.getElementById('searchAnimal')?.addEventListener('input',  e => renderAnimais(e.target.value.toLowerCase()));
  document.getElementById('filterStatus')?.addEventListener('change', () => renderAnimais(document.getElementById('searchAnimal')?.value||''));
  document.getElementById('filterFinanceiro')?.addEventListener('change', () => renderFinanceiro());

  const estoqueInsumo = document.getElementById('estoqueInsumo');
  const estoqueQtdEnt = document.getElementById('estoqueQtdEnt');
  if (estoqueInsumo) { estoqueInsumo.addEventListener('change', preencherEstoqueAtual); preencherEstoqueAtual(); }
  if (estoqueQtdEnt) estoqueQtdEnt.addEventListener('input', calcPreviewEstoque);

  document.querySelectorAll('.modal-overlay').forEach(overlay =>
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); })
  );
}

// ================================================================
//  ANIMAIS
// ================================================================
function renderAnimais(search = '') {
  const statusFil = document.getElementById('filterStatus')?.value || '';
  let data = state.animais;
  if (search)    data = data.filter(a => a.lote.toLowerCase().includes(search) || a.raca.toLowerCase().includes(search));
  if (statusFil) data = data.filter(a => a.status === statusFil);

  document.getElementById('animaisBody').innerHTML = data.map(a => `
    <tr>
      <td><strong style="color:var(--accent)">${a.lote}</strong></td>
      <td>${a.raca}</td><td>${a.galinheiro}</td><td>${fmt(a.qtd)}</td>
      <td>${a.idade}</td><td>${statusBadge(a.status)}</td><td>${fmtDate(a.data)}</td>
      <td><button class="btn btn-danger" onclick="removerAnimal('${a.id}')">Remover</button></td>
    </tr>`).join('');
}

async function salvarAnimal() {
  const codigo = document.getElementById('loteCodigo').value.trim();
  const raca   = document.getElementById('loteRaca').value;
  const gal    = document.getElementById('loteGalinheiro').value;
  const qtd    = parseInt(document.getElementById('loteQtd').value);
  const idade  = parseInt(document.getElementById('loteIdade').value) || 0;
  const data   = document.getElementById('loteData').value;
  const obs    = document.getElementById('loteObs').value.trim();

  if (!codigo || !qtd || !data) return showToast('Preencha código, quantidade e data', 'error');

  setLoading(true);
  const res = await sbInserirLote({ codigo, raca, galinheiro: gal, qtd, idade, data, obs });
  setLoading(false);
  if (!res) return;

  closeModal('modalAnimal');
  await loadAnimais();
  updateDashboardKPIs();
  showToast(`✓ Lote ${codigo} adicionado`, 'success');
  ['loteCodigo','loteQtd','loteIdade','loteObs'].forEach(id => document.getElementById(id).value = '');
}

async function removerAnimal(id) {
  if (!confirm('Remover este lote? Esta ação não pode ser desfeita.')) return;
  setLoading(true);
  const ok = await sbRemoverLote(id);
  setLoading(false);
  if (!ok) return;
  await loadAnimais();
  updateDashboardKPIs();
  showToast('Lote removido', 'success');
}

// ================================================================
//  PRODUÇÃO
// ================================================================
function renderProducao() {
  document.getElementById('producaoBody').innerHTML = state.producao.map(p => `
    <tr>
      <td>${fmtDate(p.data)}</td>
      <td><strong style="color:var(--accent)">${p.lote||'—'}</strong></td>
      <td>${p.galinheiro||'—'}</td><td>${fmt(p.total||0)}</td>
      <td>${fmt(p.primeira)}</td><td>${fmt(p.segunda)}</td>
      <td style="color:var(--red)">${fmt(p.quebrados)}</td>
      <td>${p.taxa_postura != null ? p.taxa_postura+'%' : '—'}</td>
    </tr>`).join('');
}

function updateProducaoKPIs() {
  const hoje  = state.producao.filter(p => p.data === today());
  const totOvos = hoje.reduce((s,p)=>s+(p.total||0),0);
  const totPrim = hoje.reduce((s,p)=>s+(p.primeira||0),0);
  const totSeg  = hoje.reduce((s,p)=>s+(p.segunda||0),0);
  const totQue  = hoje.reduce((s,p)=>s+(p.quebrados||0),0);
  const totalAves = state.animais.filter(a=>a.status==='Ativo').reduce((s,a)=>s+a.qtd,0);
  const taxa = totalAves > 0 ? ((totOvos/totalAves)*100).toFixed(1)+'%' : '—';

  const set = (id,v) => { const el=document.getElementById(id); if(el) el.textContent=v; };
  set('taxa-postura',fmt(taxa)); set('ovos-primeira',fmt(totPrim));
  set('ovos-segunda',fmt(totSeg)); set('ovos-quebrados',fmt(totQue));
  set('kpi-ovos',fmt(totOvos));
}

async function salvarProducao() {
  const data      = document.getElementById('prodData').value;
  const lote      = document.getElementById('prodLote').value;
  const primeira  = parseInt(document.getElementById('prodPrimeira').value)||0;
  const segunda   = parseInt(document.getElementById('prodSegunda').value)||0;
  const quebrados = parseInt(document.getElementById('prodQuebrados').value)||0;

  if (!data || !lote) return showToast('Preencha data e lote', 'error');

  setLoading(true);
  const res = await sbInserirProducao({ data, lote, primeira, segunda, quebrados });
  setLoading(false);
  if (!res) return;

  closeModal('modalProducao');
  await loadProducao();
  updateChart();
  showToast('✓ Produção registrada', 'success');
  ['prodPrimeira','prodSegunda','prodQuebrados'].forEach(id => document.getElementById(id).value='');
}

function exportarProducao() {
  const header = 'Data,Lote,Galinheiro,1ª Classe,2ª Classe,Quebrados,Total\n';
  const rows   = state.producao.map(p =>
    `${p.data},${p.lote||''},${p.galinheiro||''},${p.primeira},${p.segunda},${p.quebrados},${p.total}`
  ).join('\n');
  const blob = new Blob([header+rows],{type:'text/csv;charset=utf-8;'});
  const a    = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='producao.csv'; a.click();
  showToast('✓ CSV exportado','success');
}

// ================================================================
//  ESTOQUE
// ================================================================
function renderEstoque() {
  document.getElementById('estoqueList').innerHTML = state.estoque.map(e => {
    const pct = Math.round(e.pct || (e.qtd/e.max)*100);
    const cor = pct<30?'var(--red)':pct<60?'var(--amber)':'var(--green)';
    return `<div class="estoque-item">
      <div>
        <div class="estoque-nome">${e.nome}${e.emAlerta?' <span style="color:var(--red);font-size:10px">⚠ BAIXO</span>':''}</div>
        <div class="estoque-info">${fmt(e.qtd)} / ${fmt(e.max)} ${e.unidade}</div>
      </div>
      <div class="estoque-bar-wrap"><div class="estoque-bar-bg">
        <div class="estoque-bar-fill" style="width:${pct}%;background:${cor}"></div>
      </div></div>
      <div class="estoque-qty" style="color:${cor}">${pct}%</div>
    </div>`;
  }).join('');
}

async function salvarEntradaEstoque() {
  const idx   = parseInt(document.getElementById('estoqueInsumo').value);
  const data  = document.getElementById('estoqueDataEnt').value;
  const qtd   = parseFloat(document.getElementById('estoqueQtdEnt').value);
  const forn  = document.getElementById('estoqueFornecedor').value.trim();
  const valor = parseFloat(document.getElementById('estoqueValorPago').value)||0;

  if (isNaN(idx)||!data||!qtd||qtd<=0) return showToast('Preencha insumo, data e quantidade','error');

  const item = state.estoque[idx];
  setLoading(true);
  const ok = await sbEntradaEstoque({ id:item.id, nome:item.nome, quantidade:qtd, data, valor });
  setLoading(false);
  if (!ok) return;

  closeModal('modalEstoque');
  await loadEstoque();
  if (valor>0) await loadFinanceiro();
  showToast(`✓ ${qtd} kg de ${item.nome} adicionados`,'success');
  ['estoqueQtdEnt','estoqueFornecedor','estoqueValorPago','estoqueObsEnt'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.value='';
  });
}

function preencherEstoqueAtual() {
  const idx  = parseInt(document.getElementById('estoqueInsumo').value);
  const item = state.estoque[idx];
  if (!item) return;
  document.getElementById('estoqueAtualInfo').value = `${item.qtd} ${item.unidade}`;
  calcPreviewEstoque();
}

function calcPreviewEstoque() {
  const idx  = parseInt(document.getElementById('estoqueInsumo').value);
  const item = state.estoque[idx];
  if (!item) return;
  const qtdEnt = parseFloat(document.getElementById('estoqueQtdEnt').value)||0;
  document.getElementById('estoqueAposInfo').value = `${(item.qtd+qtdEnt).toFixed(0)} ${item.unidade}`;
}

// ================================================================
//  ALIMENTAÇÃO
// ================================================================
function renderHistoricoAlimentacao() {
  document.getElementById('alimentacaoBody').innerHTML = state.alimentacao.map(a => `
    <tr>
      <td>${fmtDate(a.data)}</td><td>${a.racao}</td>
      <td><strong style="color:var(--accent)">${a.lote}</strong></td>
      <td>${fmt(a.qtd)} kg</td><td>${a.responsavel}</td>
    </tr>`).join('');
}

async function salvarConsumoRacao() {
  const data = document.getElementById('alimentacaoData').value;
  const lote = document.getElementById('alimentacaoLote').value;
  const tipo = document.getElementById('alimentacaoTipo').value;
  const qtd  = parseFloat(document.getElementById('alimentacaoQtd').value);
  const resp = document.getElementById('alimentacaoResp').value.trim();

  if (!data||!lote||!qtd||qtd<=0) return showToast('Preencha data, lote e quantidade','error');

  setLoading(true);
  const res = await sbInserirConsumo({ data, lote, tipo, qtd, responsavel:resp });
  setLoading(false);
  if (!res) return;

  closeModal('modalAlimentacao');
  await Promise.all([loadAlimentacao(), loadEstoque()]);
  showToast(`✓ ${qtd} kg de ${tipo} registrado para ${lote}`,'success');
  ['alimentacaoQtd','alimentacaoResp','alimentacaoObs'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.value='';
  });
}

// ================================================================
//  SAÚDE
// ================================================================
function renderVacinas() {
  document.getElementById('vacinasList').innerHTML = state.vacinas.map(v => `
    <div class="vacina-item">
      <div class="vacina-date"><span class="day">${v.dia}</span><span class="month">${v.mes}</span></div>
      <div><div class="vacina-nome">${v.nome}</div><div class="vacina-lote">Lote: ${v.lote}</div></div>
      <div class="vacina-urgency ${v.urgente?'urgent':'normal'}">${v.urgente?'⚠ URGENTE':'✓ Planejado'}</div>
    </div>`).join('') || '<div style="padding:14px 18px;color:var(--text3);font-size:12px">Nenhuma vacinação pendente</div>';
}

function renderOcorrencias() {
  document.getElementById('saudeBody').innerHTML = state.saude.map(s => `
    <tr>
      <td>${fmtDate(s.data)}</td>
      <td><strong style="color:var(--accent)">${s.lote}</strong></td>
      <td>${s.tipo}</td><td>${s.desc}</td><td>${statusBadge(s.status)}</td>
    </tr>`).join('');
}

async function salvarVacina() {
  const lote        = document.getElementById('vacinaLote').value;
  const data        = document.getElementById('vacinaData').value;
  const nome        = document.getElementById('vacinaNome').value;
  const urgente     = document.getElementById('vacinaUrgencia').value === 'true';
  const responsavel = document.getElementById('vacinaResponsavel').value.trim();
  const via         = document.getElementById('vacinaVia').value;
  const obs         = document.getElementById('vacinaObs').value.trim();

  if (!lote||!data||!nome) return showToast('Preencha lote, data e vacina','error');

  setLoading(true);
  const res = await sbAgendarVacina({ lote, data, nome, urgente, responsavel, via, obs });
  setLoading(false);
  if (!res) return;

  closeModal('modalVacina');
  await loadVacinas();
  showToast(`✓ Vacinação "${nome}" agendada`,'success');
  ['vacinaResponsavel','vacinaObs'].forEach(id => document.getElementById(id).value='');
  document.getElementById('vacinaUrgencia').value='false';
}

async function salvarOcorrencia() {
  const data   = document.getElementById('saudeData').value;
  const lote   = document.getElementById('saudeLote').value;
  const tipo   = document.getElementById('saudeTipo').value;
  const status = document.getElementById('saudeStatus').value;
  const desc   = document.getElementById('saudeDesc').value.trim();

  if (!data||!lote||!desc) return showToast('Preencha todos os campos','error');

  setLoading(true);
  const res = await sbInserirOcorrencia({ data, lote, tipo, status, desc });
  setLoading(false);
  if (!res) return;

  closeModal('modalSaude');
  await loadSaude();
  showToast('✓ Ocorrência registrada','success');
  document.getElementById('saudeDesc').value='';
}

// ================================================================
//  FINANCEIRO
// ================================================================
function renderFinanceiro() {
  const fil  = document.getElementById('filterFinanceiro')?.value||'';
  let data   = state.financeiro;
  if (fil) data = data.filter(f=>f.tipo===fil);

  document.getElementById('financeiroBody').innerHTML = data.map(f=>`
    <tr>
      <td>${fmtDate(f.data)}</td><td>${f.desc}</td><td>${f.categoria}</td>
      <td>${tipoBadge(f.tipo)}</td>
      <td style="color:${f.tipo==='Receita'?'var(--green)':'var(--red)'};font-weight:600">${fmtBRL(f.valor)}</td>
    </tr>`).join('');

  updateFinanceiroKPIs();
}

function updateFinanceiroKPIs() {
  const receita = state.financeiro.filter(f=>f.tipo==='Receita').reduce((s,f)=>s+f.valor,0);
  const despesa = state.financeiro.filter(f=>f.tipo==='Despesa').reduce((s,f)=>s+f.valor,0);
  const lucro   = receita - despesa;
  const margem  = receita>0?((lucro/receita)*100).toFixed(1)+'%':'—';

  const set = (id,v) => { const el=document.getElementById(id); if(el) el.textContent=v; };
  set('fin-receita',fmtBRL(receita)); set('fin-despesa',fmtBRL(despesa));
  set('fin-lucro',fmtBRL(lucro));     set('fin-margem',margem);
  set('kpi-rec',fmtBRL(receita));
}

async function salvarTransacao() {
  const data  = document.getElementById('finData').value;
  const tipo  = document.getElementById('finTipo').value;
  const cat   = document.getElementById('finCategoria').value;
  const valor = parseFloat(document.getElementById('finValor').value);
  const desc  = document.getElementById('finDesc').value.trim();

  if (!data||!valor||!desc) return showToast('Preencha todos os campos','error');

  setLoading(true);
  const res = await sbInserirTransacao({ data, desc, categoria:cat, tipo, valor });
  setLoading(false);
  if (!res) return;

  closeModal('modalFinanceiro');
  await loadFinanceiro();
  showToast('✓ Transação salva','success');
  ['finValor','finDesc'].forEach(id => document.getElementById(id).value='');
}

// ================================================================
//  DASHBOARD
// ================================================================
function updateDashboardKPIs() {
  const totalAves   = state.animais.filter(a=>a.status==='Ativo').reduce((s,a)=>s+a.qtd,0);
  const totOvosHoje = state.producao.filter(p=>p.data===today()).reduce((s,p)=>s+(p.total||0),0);
  const receita     = state.financeiro.filter(f=>f.tipo==='Receita').reduce((s,f)=>s+f.valor,0);

  const set = (id,v) => { const el=document.getElementById(id); if(el) el.textContent=v; };
  set('kpi-aves',fmt(totalAves));
  set('kpi-ovos',fmt(totOvosHoje));
  set('kpi-rec',fmtBRL(receita));

  renderLotesList();
  renderAtividades();
  updateProducaoKPIs();
}

function renderLotesList() {
  const ativos = state.animais.filter(a=>a.status==='Ativo');
  document.getElementById('lotesList').innerHTML = ativos.map(a=>`
    <div class="lote-item">
      <div>
        <div class="lote-nome">${a.lote} — ${a.raca}</div>
        <div class="lote-info">${a.galinheiro} · ${a.idade} semanas</div>
      </div>
      <div class="lote-qtd">${fmt(a.qtd)}</div>
    </div>`).join('') || '<div style="padding:14px 18px;color:var(--text3);font-size:12px">Nenhum lote ativo</div>';
}

function renderAtividades() {
  const ativs = [];
  state.producao.slice(0,2).forEach(p =>
    ativs.push({cor:'green', texto:`Produção — Lote ${p.lote||'?'} (${fmt(p.total||0)} ovos)`, hora:fmtDate(p.data)}));
  state.saude.filter(s=>s.status==='Em Tratamento').slice(0,2).forEach(s =>
    ativs.push({cor:'red', texto:`Ocorrência: ${s.tipo} — Lote ${s.lote}`, hora:fmtDate(s.data)}));
  state.vacinas.filter(v=>v.urgente).slice(0,1).forEach(v =>
    ativs.push({cor:'amber', texto:`Vacinação urgente: ${v.nome} — Lote ${v.lote}`, hora:`${v.dia}/${v.mes}`}));
  state.financeiro.slice(0,2).forEach(f =>
    ativs.push({cor:f.tipo==='Receita'?'green':'blue', texto:`${f.tipo}: ${f.desc}`, hora:fmtDate(f.data)}));

  document.getElementById('atividadesList').innerHTML = ativs.slice(0,6).map(a=>`
    <div class="ativ-item">
      <div class="ativ-dot ${a.cor}"></div>
      <div><div class="ativ-texto">${a.texto}</div><div class="ativ-hora">${a.hora}</div></div>
    </div>`).join('') || '<div style="padding:14px 18px;color:var(--text3);font-size:12px">Nenhuma atividade recente</div>';
}

// ================================================================
//  SELECTS
// ================================================================
function populateLoteSelects() {
  const lotes = state.animais.filter(a=>a.status==='Ativo').map(a=>a.lote);
  ['prodLote','saudeLote','vacinaLote','alimentacaoLote'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.innerHTML=lotes.map(l=>`<option>${l}</option>`).join('');
  });

  const elEst = document.getElementById('estoqueInsumo');
  if (elEst) {
    elEst.innerHTML = state.estoque.map((e,i)=>`<option value="${i}">${e.nome}</option>`).join('');
    preencherEstoqueAtual();
  }
}

// ================================================================
//  MODAIS
// ================================================================
function openModal(id) {
  const el = document.getElementById(id);
  if (!el) { console.warn('Modal não encontrado:',id); return; }
  el.classList.add('open');
  if (['modalEstoque','modalVacina','modalAlimentacao','modalProducao','modalSaude'].includes(id)) populateLoteSelects();
  if (id==='modalEstoque') setTimeout(preencherEstoqueAtual,50);
  el.querySelectorAll('input[type="date"]').forEach(inp=>{ if(!inp.value) inp.value=today(); });
}

function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
}

// ================================================================
//  GRÁFICOS
// ================================================================
function initCharts() {
  initChartProducao();
  initChartGalinheiro();
  initChartConsumo();
}

const chartDefaults = {
  responsive:true, maintainAspectRatio:false,
  plugins:{legend:{display:false}}, animation:{duration:600},
};

function chartColors() {
  return {gridColor:'#2e3020',tickColor:'#5e5c4a',accent:'#c8b84a',green:'#5da84e',amber:'#d4943a',blue:'#4a88c4'};
}

function initChartProducao() {
  const c=chartColors(), labels=[], data=[];
  for (let i=13;i>=0;i--) {
    const d=new Date(); d.setDate(d.getDate()-i);
    labels.push(d.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'}));
    const ds=d.toISOString().split('T')[0];
    data.push(state.producao.filter(p=>p.data===ds).reduce((s,p)=>s+(p.total||0),0)||null);
  }
  state.charts.producao = new Chart(document.getElementById('chartProducao').getContext('2d'),{
    type:'line',
    data:{labels,datasets:[{data,borderColor:c.accent,backgroundColor:'rgba(200,184,74,.08)',
      borderWidth:2,pointRadius:3,pointBackgroundColor:c.accent,fill:true,tension:.4,spanGaps:true}]},
    options:{...chartDefaults,scales:{
      x:{ticks:{color:c.tickColor,font:{family:'JetBrains Mono',size:10}},grid:{color:c.gridColor}},
      y:{ticks:{color:c.tickColor,font:{family:'JetBrains Mono',size:10}},grid:{color:c.gridColor}},
    }},
  });
}

function initChartGalinheiro() {
  const c=chartColors();
  const ativos=state.animais.filter(a=>a.status==='Ativo');
  state.charts.galinheiro = new Chart(document.getElementById('chartGalinheiro').getContext('2d'),{
    type:'doughnut',
    data:{labels:ativos.map(a=>a.lote),datasets:[{
      data:ativos.map(a=>a.qtd),
      backgroundColor:[c.accent,c.green,c.amber,c.blue,'#7a6ab0'],
      borderColor:'#161710',borderWidth:3,hoverOffset:6,
    }]},
    options:{...chartDefaults,plugins:{legend:{display:true,position:'bottom',
      labels:{color:c.tickColor,font:{family:'JetBrains Mono',size:10},boxWidth:10,padding:12}}}},
  });
}

function initChartConsumo() {
  const c=chartColors(), labels=['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];
  state.charts.consumo = new Chart(document.getElementById('chartConsumo').getContext('2d'),{
    type:'bar',
    data:{labels,datasets:[{label:'Consumo (kg)',
      data:labels.map(()=>580+Math.round(Math.random()*120)),
      backgroundColor:'rgba(200,184,74,.25)',borderColor:c.accent,borderWidth:1,borderRadius:3}]},
    options:{...chartDefaults,scales:{
      x:{ticks:{color:c.tickColor,font:{family:'JetBrains Mono',size:10}},grid:{color:c.gridColor}},
      y:{ticks:{color:c.tickColor,font:{family:'JetBrains Mono',size:10}},grid:{color:c.gridColor}},
    }},
  });
}

function updateChart() {
  if (!state.charts.producao) return;
  const ds  = state.charts.producao.data.datasets[0].data;
  const tot = state.producao.filter(p=>p.data===today()).reduce((s,p)=>s+(p.total||0),0);
  if (tot>0) { ds[ds.length-1]=tot; state.charts.producao.update(); }
}

// ================================================================
//  RELATÓRIOS
// ================================================================

function relCSS(){return`<style>
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=JetBrains+Mono:wght@400;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}body{font-family:'JetBrains Mono',monospace;font-size:12px;color:#1a1a1a;padding:40px}
  h1{font-family:'Libre Baskerville',serif;font-size:22px;font-weight:700;margin-bottom:4px}
  h2{font-family:'Libre Baskerville',serif;font-size:15px;margin:28px 0 10px;border-bottom:1px solid #ddd;padding-bottom:6px}
  .header{display:flex;justify-content:space-between;margin-bottom:28px;padding-bottom:16px;border-bottom:2px solid #1a1a1a}
  .header-right{text-align:right;font-size:11px;color:#666;line-height:1.8}.brand{font-family:'Libre Baskerville',serif;font-size:13px;font-weight:700;color:#8a7820}
  .subtitle{font-size:11px;color:#666;margin-top:2px}table{width:100%;border-collapse:collapse;margin-bottom:16px;font-size:11px}
  thead th{background:#f4f2e8;padding:8px 10px;text-align:left;font-size:10px;font-weight:600;color:#444;text-transform:uppercase;border-bottom:1px solid #ccc}
  tbody td{padding:7px 10px;border-bottom:1px solid #eee;color:#333}tbody tr:nth-child(even) td{background:#fafaf6}
  .total-row td{font-weight:700;background:#f4f2e8!important;border-top:2px solid #ccc}
  .kpi-row{display:flex;gap:14px;margin:16px 0 24px;flex-wrap:wrap}.kpi-box{flex:1;min-width:130px;border:1px solid #ddd;border-radius:6px;padding:14px 16px;background:#fafaf6}
  .kpi-label{font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px}.kpi-val{font-size:19px;font-weight:700;color:#1a1a1a}
  .kpi-box.green{border-color:#4a9e3f}.kpi-val.green{color:#3a7e2f}.kpi-box.red{border-color:#c44a4a}.kpi-val.red{color:#c44a4a}
  .kpi-box.amber{border-color:#c4843a}.kpi-val.amber{color:#a06420}.kpi-box.blue{border-color:#3a78c4}.kpi-val.blue{color:#2a68b4}
  .badge{display:inline-block;padding:2px 7px;border-radius:3px;font-size:9px;font-weight:700;text-transform:uppercase}
  .badge-green{background:#e6f4e3;color:#2d7a24}.badge-amber{background:#fef3e2;color:#a06420}.badge-red{background:#fce8e8;color:#c44a4a}
  .receita{color:#2d7a24;font-weight:600}.despesa{color:#c44a4a;font-weight:600}
  .footer{margin-top:40px;padding-top:12px;border-top:1px solid #ddd;font-size:10px;color:#aaa;display:flex;justify-content:space-between}
  @media print{body{padding:20px}@page{margin:15mm;size:A4}}
</style>`;}

function relHeader(titulo, subtitulo) {
  const agora = new Date().toLocaleString('pt-BR');
  return `<div class="header"><div><div class="brand">🐔 GranjaOS</div><h1>${titulo}</h1><p class="subtitle">${subtitulo}</p></div><div class="header-right"><div>Emitido em: <strong>${agora}</strong></div><div>GranjaOS v1.0</div></div></div>`;
}

function relFooter() {
  return `<div class="footer"><span>GranjaOS — Sistema de Gerenciamento</span><span>Gerado automaticamente</span></div>`;
}

// kpis = [{ label, valor, cor }]
function kpiRow(kpis) {
  return `<div class="kpi-row">${kpis.map(k =>
    `<div class="kpi-box ${k.cor||''}"><div class="kpi-label">${k.label}</div><div class="kpi-val ${k.cor||''}">${k.valor}</div></div>`
  ).join('')}</div>`;
}

// colunas = ['Data', ...], linhas = array de arrays, totalLinha (opcional)
function tabela(colunas, linhas, totalLinha = null) {
  const ths = colunas.map(c => `<th>${c}</th>`).join('');
  const trs = linhas.map(cells => `<tr>${cells.map(c => `<td>${c}</td>`).join('')}</tr>`).join('');
  const tot = totalLinha ? `<tr class="total-row">${totalLinha.map(c => `<td>${c}</td>`).join('')}</tr>` : '';
  return `<table><thead><tr>${ths}</tr></thead><tbody>${trs}${tot}</tbody></table>`;
}

// secoes = [{ titulo, html }]
function montarRelatorio(titulo, subtitulo, secoes) {
  const corpo = secoes.map(s => `<h2>${s.titulo}</h2>${s.html}`).join('');
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>GranjaOS</title>${relCSS()}</head><body>${relHeader(titulo, subtitulo)}${corpo}${relFooter()}</body></html>`;
}

// ── Relatórios individuais ───────────────────────────────────────

function buildRelProducao() {
  const tv = state.producao.reduce((s,p)=>s+(p.total    ||0),0);
  const tp = state.producao.reduce((s,p)=>s+(p.primeira ||0),0);
  const ts = state.producao.reduce((s,p)=>s+(p.segunda  ||0),0);
  const tq = state.producao.reduce((s,p)=>s+(p.quebrados||0),0);
  return montarRelatorio('Relatório de Produção','Coleta e classificação de ovos',[
    { titulo:'Resumo', html: kpiRow([
      {label:'Total Ovos',valor:fmt(tv),cor:'amber'},{label:'1ª Classe',valor:fmt(tp),cor:'green'},
      {label:'2ª Classe', valor:fmt(ts),cor:'blue'}, {label:'Quebrados',valor:fmt(tq),cor:'red'},
    ])},
    { titulo:'Registros', html: tabela(
      ['Data','Lote','Galinheiro','Total','1ª','2ª','Quebrados','Taxa'],
      state.producao.map(p=>[fmtDate(p.data),p.lote||'—',p.galinheiro||'—',fmt(p.total||0),fmt(p.primeira),fmt(p.segunda),fmt(p.quebrados),p.taxa_postura!=null?p.taxa_postura+'%':'—']),
      ['TOTAL','','',fmt(tv),fmt(tp),fmt(ts),fmt(tq),'—'],
    )},
  ]);
}

function buildRelFinanceiro() {
  const rec = state.financeiro.filter(f=>f.tipo==='Receita');
  const dep = state.financeiro.filter(f=>f.tipo==='Despesa');
  const tr  = rec.reduce((s,f)=>s+f.valor,0);
  const td  = dep.reduce((s,f)=>s+f.valor,0);
  const lu  = tr - td;
  const cat = {};
  dep.forEach(f=>{ cat[f.categoria]=(cat[f.categoria]||0)+f.valor; });
  return montarRelatorio('DRE — Demonstrativo','Receitas, despesas e resultado',[
    { titulo:'Resumo', html: kpiRow([
      {label:'Receita',valor:fmtBRL(tr),cor:'green'},{label:'Despesa',valor:fmtBRL(td),cor:'red'},
      {label:'Lucro',valor:fmtBRL(lu),cor:lu>=0?'green':'red'},{label:'Margem',valor:tr>0?((lu/tr)*100).toFixed(1)+'%':'—',cor:'amber'},
    ])},
    { titulo:'Receitas', html: tabela(
      ['Data','Descrição','Categoria','Valor'],
      rec.map(f=>[fmtDate(f.data),f.desc,f.categoria,`<span class="receita">${fmtBRL(f.valor)}</span>`]),
      ['TOTAL RECEITAS','','',`<span class="receita">${fmtBRL(tr)}</span>`],
    )},
    { titulo:'Despesas por categoria', html: tabela(
      ['Categoria','Total','%'],
      Object.entries(cat).map(([c,v])=>[c,`<span class="despesa">${fmtBRL(v)}</span>`,((v/td)*100).toFixed(1)+'%']),
      ['TOTAL',`<span class="despesa">${fmtBRL(td)}</span>`,'100%'],
    )},
  ]);
}

function buildRelSaude() {
  return montarRelatorio('Relatório Sanitário','Ocorrências e vacinações',[
    { titulo:'Resumo', html: kpiRow([
      {label:'Ocorrências',        valor:state.saude.length,                                        cor:'blue'},
      {label:'Em Tratamento',      valor:state.saude.filter(s=>s.status==='Em Tratamento').length,  cor:'amber'},
      {label:'Resolvidos',         valor:state.saude.filter(s=>s.status==='Resolvido').length,      cor:'green'},
      {label:'Vacinações Urgentes',valor:state.vacinas.filter(v=>v.urgente).length,                 cor:'red'},
    ])},
    { titulo:'Ocorrências', html: tabela(
      ['Data','Lote','Tipo','Descrição','Status'],
      state.saude.map(s=>[fmtDate(s.data),s.lote,s.tipo,s.desc,s.status]),
    )},
    { titulo:'Vacinações pendentes', html: tabela(
      ['Data','Lote','Vacina','Urgência'],
      state.vacinas.map(v=>[`${v.dia}/${v.mes}`,v.lote,v.nome,v.urgente?'URGENTE':'Planejado']),
    )},
  ]);
}

function buildRelEstoque() {
  return montarRelatorio('Relatório de Estoque','Nível de insumos e consumo',[
    { titulo:'Estoque atual', html: tabela(
      ['Insumo','Qtd.','Capacidade','Nível','Status'],
      state.estoque.map(e=>{
        const p=Math.round((e.qtd/e.max)*100), cor=e.emAlerta?'red':p<60?'amber':'green';
        return [e.nome,`${fmt(e.qtd)} ${e.unidade}`,`${fmt(e.max)} ${e.unidade}`,p+'%',`<span class="badge badge-${cor}">${e.emAlerta?'ALERTA':p<60?'MÉDIO':'OK'}</span>`];
      }),
    )},
    { titulo:'Histórico de consumo', html: tabela(
      ['Data','Ração','Lote','Qtd.','Responsável'],
      state.alimentacao.map(a=>[fmtDate(a.data),a.racao,a.lote,`${fmt(a.qtd)} kg`,a.responsavel]),
    )},
  ]);
}

function buildRelAnimais() {
  const total  = state.animais.reduce((s,a)=>s+a.qtd,0);
  const ativos = state.animais.filter(a=>a.status==='Ativo').reduce((s,a)=>s+a.qtd,0);
  return montarRelatorio('Inventário de Aves','Relação de lotes e plantel',[
    { titulo:'Resumo', html: kpiRow([
      {label:'Total Lotes',valor:state.animais.length,cor:'blue'},
      {label:'Total Aves', valor:fmt(total),          cor:'green'},
      {label:'Aves Ativas',valor:fmt(ativos),         cor:'green'},
    ])},
    { titulo:'Lotes', html: tabela(
      ['Lote','Raça','Galinheiro','Qtd.','Idade (sem.)','Status','Entrada'],
      state.animais.map(a=>[`<strong>${a.lote}</strong>`,a.raca,a.galinheiro,fmt(a.qtd),a.idade,a.status,fmtDate(a.data)]),
      ['TOTAL','','',fmt(total),'','',''],
    )},
  ]);
}

function buildRelCompleto() {
  const tr = state.financeiro.filter(f=>f.tipo==='Receita').reduce((s,f)=>s+f.valor,0);
  const td = state.financeiro.filter(f=>f.tipo==='Despesa').reduce((s,f)=>s+f.valor,0);
  const lu = tr - td;
  return montarRelatorio('Relatório Gerencial Completo','Consolidado operacional e financeiro',[
    { titulo:'Resumo executivo', html: kpiRow([
      {label:'Aves Ativas',    valor:fmt(state.animais.filter(a=>a.status==='Ativo').reduce((s,a)=>s+a.qtd,0)), cor:'green'},
      {label:'Ovos Produzidos',valor:fmt(state.producao.reduce((s,p)=>s+(p.total||0),0)),                       cor:'amber'},
      {label:'Receita',        valor:fmtBRL(tr),                                                                cor:'green'},
      {label:'Despesas',       valor:fmtBRL(td),                                                                cor:'red'},
      {label:'Lucro',          valor:fmtBRL(lu),                                                                cor:lu>=0?'green':'red'},
    ])},
    // Reutiliza seções das funções individuais para não duplicar lógica
    ...['animais','producao','financeiro'].map(tipo => {
      const fn = {animais:buildRelAnimais, producao:buildRelProducao, financeiro:buildRelFinanceiro}[tipo];
      const secoes = [];
      // Extrai as seções do HTML gerado (após o header, antes do footer)
      const html = fn();
      const matches = [...html.matchAll(/<h2>(.*?)<\/h2>([\s\S]*?)(?=<h2>|<div class="footer">)/g)];
      matches.forEach(m => secoes.push({ titulo: m[1], html: m[2] }));
      return secoes;
    }).flat(),
  ]);
}

// ── Entrada pública ──────────────────────────────────────────────

function gerarRelatorio(tipo) {
  const builders = {
    producao: buildRelProducao, financeiro: buildRelFinanceiro,
    saude: buildRelSaude, estoque: buildRelEstoque,
    animais: buildRelAnimais, completo: buildRelCompleto,
  };
  showToast('⏳ Gerando relatório...','success');
  setTimeout(()=>{ abrirJanelaImpressao((builders[tipo]||buildRelCompleto)()); },200);
}

function abrirJanelaImpressao(html) {
  const win = window.open('','_blank','width=900,height=700');
  if (!win) { showToast('⚠ Permita popups para gerar PDF','error'); return; }
  win.document.write(html); win.document.close(); win.focus();
  setTimeout(()=>win.print(),600);
  showToast('✓ Use Ctrl+P → Salvar como PDF','success');
}

// ================================================================
//  TOAST
// ================================================================
function showToast(msg, type='success') {
  const el=document.getElementById('toast');
  el.textContent=msg; el.className=`toast ${type} show`;
  clearTimeout(el._t);
  el._t=setTimeout(()=>el.classList.remove('show'),3200);
}