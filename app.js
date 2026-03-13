/* ===================================================
   GranjaOS — Sistema de Gerenciamento de Granja
   app.js — Lógica da aplicação
   =================================================== */

'use strict';

// ============================================================
//  ESTADO GLOBAL
// ============================================================
const state = {
  animais: [
    { id: 1, lote: 'A-01', raca: 'Isa Brown',      galinheiro: 'G-01', qtd: 2500, idade: 28, status: 'Ativo',      data: '2024-09-15' },
    { id: 2, lote: 'A-02', raca: 'Lohmann Brown',  galinheiro: 'G-02', qtd: 2800, idade: 24, status: 'Ativo',      data: '2024-10-10' },
    { id: 3, lote: 'A-03', raca: 'Hisex Brown',    galinheiro: 'G-03', qtd: 2200, idade: 32, status: 'Quarentena', data: '2024-08-20' },
    { id: 4, lote: 'A-04', raca: 'Nick Chick',     galinheiro: 'G-04', qtd: 3100, idade: 18, status: 'Ativo',      data: '2025-01-05' },
    { id: 5, lote: 'A-05', raca: 'Dekalb White',   galinheiro: 'G-05', qtd: 1880, idade: 40, status: 'Descarte',   data: '2024-05-12' },
  ],

  producao: [
    { id: 1, data: '2025-03-10', lote: 'A-01', galinheiro: 'G-01', primeira: 1850, segunda: 620, quebrados: 80 },
    { id: 2, data: '2025-03-10', lote: 'A-02', galinheiro: 'G-02', primeira: 2100, segunda: 580, quebrados: 90 },
    { id: 3, data: '2025-03-10', lote: 'A-04', galinheiro: 'G-04', primeira: 2450, segunda: 710, quebrados: 100 },
    { id: 4, data: '2025-03-09', lote: 'A-01', galinheiro: 'G-01', primeira: 1800, segunda: 600, quebrados: 75 },
    { id: 5, data: '2025-03-09', lote: 'A-02', galinheiro: 'G-02', primeira: 2050, segunda: 550, quebrados: 85 },
  ],

  alimentacao: [
    { id: 1, data: '2025-03-10', racao: 'Postura Fase 1', lote: 'A-01', qtd: 180, responsavel: 'Carlos' },
    { id: 2, data: '2025-03-10', racao: 'Postura Fase 2', lote: 'A-02', qtd: 200, responsavel: 'Maria' },
    { id: 3, data: '2025-03-10', racao: 'Pré-postura',    lote: 'A-04', qtd: 220, responsavel: 'Carlos' },
    { id: 4, data: '2025-03-09', racao: 'Postura Fase 1', lote: 'A-01', qtd: 180, responsavel: 'João' },
  ],

  estoque: [
    { nome: 'Ração Postura Fase 1', qtd: 1200, max: 2000, unidade: 'kg', alerta: 500 },
    { nome: 'Ração Postura Fase 2', qtd: 850,  max: 1500, unidade: 'kg', alerta: 400 },
    { nome: 'Ração Pré-postura',    qtd: 620,  max: 1000, unidade: 'kg', alerta: 300 },
    { nome: 'Milho Grão',           qtd: 3400, max: 5000, unidade: 'kg', alerta: 1000 },
    { nome: 'Farelo de Soja',       qtd: 980,  max: 2000, unidade: 'kg', alerta: 500 },
    { nome: 'Calcário',             qtd: 420,  max: 800,  unidade: 'kg', alerta: 200 },
  ],

  saude: [
    { id: 1, data: '2025-03-08', lote: 'A-03', tipo: 'Doença',     desc: 'Suspeita de Newcastle — isolado', status: 'Em Tratamento' },
    { id: 2, data: '2025-03-05', lote: 'A-01', tipo: 'Parasitas',  desc: 'Ácaro vermelho identificado',     status: 'Resolvido' },
    { id: 3, data: '2025-02-28', lote: 'A-02', tipo: 'Mortalidade',desc: '12 aves — causa investigada',     status: 'Monitorando' },
  ],

  vacinas: [
    { dia: '13', mes: 'MAR', nome: 'Newcastle + Bronquite', lote: 'A-03', urgente: true },
    { dia: '18', mes: 'MAR', nome: 'Marek Reforço',         lote: 'A-04', urgente: false },
    { dia: '22', mes: 'MAR', nome: 'Gumboro',               lote: 'A-01', urgente: false },
    { dia: '01', mes: 'ABR', nome: 'Salmonela',             lote: 'A-02', urgente: false },
  ],

  financeiro: [
    { id: 1, data: '2025-03-10', desc: 'Venda ovos — caixa 3000 dz', categoria: 'Venda de Ovos', tipo: 'Receita',  valor: 14400 },
    { id: 2, data: '2025-03-09', desc: 'Compra ração Postura F1',     categoria: 'Ração',          tipo: 'Despesa', valor: 3200  },
    { id: 3, data: '2025-03-08', desc: 'Venda ovos — caixa 2800 dz',  categoria: 'Venda de Ovos', tipo: 'Receita',  valor: 13440 },
    { id: 4, data: '2025-03-07', desc: 'Medicamentos Lote A-03',      categoria: 'Medicamentos',   tipo: 'Despesa', valor: 1850  },
    { id: 5, data: '2025-03-06', desc: 'Energia elétrica março',      categoria: 'Energia',        tipo: 'Despesa', valor: 2800  },
    { id: 6, data: '2025-03-05', desc: 'Mão de obra semanal',         categoria: 'Mão de Obra',    tipo: 'Despesa', valor: 4200  },
    { id: 7, data: '2025-03-04', desc: 'Venda aves descarte L-A05',   categoria: 'Venda de Aves',  tipo: 'Receita',  valor: 6200  },
    { id: 8, data: '2025-03-03', desc: 'Milho grão — 2t',             categoria: 'Ração',          tipo: 'Despesa', valor: 2800  },
    { id: 9, data: '2025-03-02', desc: 'Farelo de soja — 500kg',      categoria: 'Ração',          tipo: 'Despesa', valor: 1950  },
  ],

  charts: {},
  nextId: 100,
};

// ============================================================
//  UTILIDADES
// ============================================================
function fmt(n) {
  return new Intl.NumberFormat('pt-BR').format(n);
}

function fmtBRL(n) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
}

function fmtDate(d) {
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

function today() {
  return new Date().toISOString().split('T')[0];
}

function statusBadge(status) {
  const map = { 'Ativo': 'green', 'Quarentena': 'amber', 'Descarte': 'red', 'Em Tratamento': 'amber', 'Resolvido': 'green', 'Monitorando': 'blue' };
  return `<span class="badge badge-${map[status] || 'blue'}">${status}</span>`;
}

function tipoBadge(tipo) {
  return tipo === 'Receita'
    ? `<span class="badge badge-green">${tipo}</span>`
    : `<span class="badge badge-red">${tipo}</span>`;
}

// ============================================================
//  INICIALIZAÇÃO
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initDates();
  initNav();
  initToggle();
  initNotif();
  renderAll();      // popula selects ANTES de vincular eventos
  initModalEvents();
  initCharts();
});

function initDates() {
  const now = new Date();
  const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('todayDate').textContent = now.toLocaleDateString('pt-BR', opts);
  document.getElementById('sidebarDate').textContent = now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  ['dataProd','finData','saudeData','prodData','loteData','vacinaData','estoqueDataEnt'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = today();
  });
}

function initModalEvents() {
  // Busca e filtros
  document.getElementById('searchAnimal')?.addEventListener('input', e => renderAnimais(e.target.value.toLowerCase()));
  document.getElementById('filterStatus')?.addEventListener('change', () => renderAnimais(document.getElementById('searchAnimal')?.value || ''));
  document.getElementById('filterFinanceiro')?.addEventListener('change', renderFinanceiro);

  // Preview de estoque: atualiza ao trocar insumo ou digitar quantidade
  const estoqueInsumo = document.getElementById('estoqueInsumo');
  const estoqueQtdEnt = document.getElementById('estoqueQtdEnt');
  if (estoqueInsumo) {
    estoqueInsumo.addEventListener('change', preencherEstoqueAtual);
    preencherEstoqueAtual(); // preenche com o primeiro item
  }
  if (estoqueQtdEnt) {
    estoqueQtdEnt.addEventListener('input', calcPreviewEstoque);
  }

  // Fechar modais ao clicar fora
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });
}

function initNav() {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.dataset.page;
      // Nav active
      document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Pages
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      document.getElementById(`page-${page}`).classList.add('active');
      // Title
      document.getElementById('pageTitle').textContent = btn.textContent.trim().replace(/^[^\w]+/, '').trim();
      // Mobile: close sidebar
      document.getElementById('sidebar').classList.remove('open');
    });
  });
}

function initToggle() {
  document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });
}

function initNotif() {
  document.getElementById('notifBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('notifPanel').classList.toggle('open');
  });
  document.addEventListener('click', () => {
    document.getElementById('notifPanel').classList.remove('open');
  });
}

// ============================================================
//  RENDER ALL
// ============================================================
function renderAll() {
  renderAnimais();
  renderProducao();
  renderAlimentacao();
  renderSaude();
  renderFinanceiro();
  renderLotesList();
  renderAtividades();
  populateLoteSelects();
}

// ============================================================
//  ANIMAIS
// ============================================================
function renderAnimais(filter = '') {
  const tbody = document.getElementById('animaisBody');
  const statusFilter = document.getElementById('filterStatus')?.value || '';
  let data = state.animais;
  if (filter) data = data.filter(a =>
    a.lote.toLowerCase().includes(filter) || a.raca.toLowerCase().includes(filter)
  );
  if (statusFilter) data = data.filter(a => a.status === statusFilter);

  tbody.innerHTML = data.map(a => `
    <tr>
      <td><strong style="color:var(--accent)">${a.lote}</strong></td>
      <td>${a.raca}</td>
      <td>${a.galinheiro}</td>
      <td>${fmt(a.qtd)}</td>
      <td>${a.idade}</td>
      <td>${statusBadge(a.status)}</td>
      <td>${fmtDate(a.data)}</td>
      <td>
        <button class="btn btn-danger" onclick="removerAnimal(${a.id})">Remover</button>
      </td>
    </tr>
  `).join('');
}

function salvarAnimal() {
  const lote = document.getElementById('loteCodigo').value.trim();
  const raca = document.getElementById('loteRaca').value;
  const gal  = document.getElementById('loteGalinheiro').value;
  const qtd  = parseInt(document.getElementById('loteQtd').value);
  const idade = parseInt(document.getElementById('loteIdade').value);
  const data  = document.getElementById('loteData').value;

  if (!lote || !qtd || !data) return showToast('Preencha todos os campos obrigatórios', 'error');

  state.animais.push({ id: state.nextId++, lote, raca, galinheiro: gal, qtd, idade: idade || 0, status: 'Ativo', data });
  closeModal('modalAnimal');
  renderAnimais();
  renderLotesList();
  populateLoteSelects();
  document.getElementById('kpi-aves').textContent = fmt(state.animais.reduce((s, a) => s + a.qtd, 0));
  showToast(`✓ Lote ${lote} adicionado com sucesso`, 'success');

  // Clear
  ['loteCodigo','loteQtd','loteIdade','loteObs'].forEach(id => document.getElementById(id).value = '');
}

function removerAnimal(id) {
  if (!confirm('Remover este lote?')) return;
  state.animais = state.animais.filter(a => a.id !== id);
  renderAnimais();
  renderLotesList();
  populateLoteSelects();
  showToast('Lote removido', 'success');
}

// listeners de busca/filtro animais — em initModalEvents()

// ============================================================
//  PRODUÇÃO
// ============================================================
function renderProducao() {
  const tbody = document.getElementById('producaoBody');
  tbody.innerHTML = state.producao.map(p => {
    const total = p.primeira + p.segunda + p.quebrados;
    const lote = state.animais.find(a => a.lote === p.lote);
    const taxa = lote ? ((total / lote.qtd) * 100).toFixed(1) + '%' : '-';
    return `
      <tr>
        <td>${fmtDate(p.data)}</td>
        <td><strong style="color:var(--accent)">${p.lote}</strong></td>
        <td>${p.galinheiro}</td>
        <td>${fmt(total)}</td>
        <td>${fmt(p.primeira)}</td>
        <td>${fmt(p.segunda)}</td>
        <td style="color:var(--red)">${fmt(p.quebrados)}</td>
        <td>${taxa}</td>
      </tr>
    `;
  }).join('');
}

function salvarProducao() {
  const data = document.getElementById('prodData').value;
  const lote = document.getElementById('prodLote').value;
  const prim = parseInt(document.getElementById('prodPrimeira').value) || 0;
  const seg  = parseInt(document.getElementById('prodSegunda').value) || 0;
  const que  = parseInt(document.getElementById('prodQuebrados').value) || 0;

  if (!data || !lote) return showToast('Preencha data e lote', 'error');

  const animal = state.animais.find(a => a.lote === lote);
  const gal = animal ? animal.galinheiro : '-';

  state.producao.unshift({ id: state.nextId++, data, lote, galinheiro: gal, primeira: prim, segunda: seg, quebrados: que });
  closeModal('modalProducao');
  renderProducao();
  updateProducaoKPIs();
  updateChart();
  showToast('✓ Produção registrada', 'success');
  ['prodPrimeira','prodSegunda','prodQuebrados'].forEach(id => document.getElementById(id).value = '');
}

function updateProducaoKPIs() {
  const hoje = state.producao.filter(p => p.data === today());
  const totOvos = hoje.reduce((s, p) => s + p.primeira + p.segunda + p.quebrados, 0);
  const totPrim = hoje.reduce((s, p) => s + p.primeira, 0);
  const totSeg  = hoje.reduce((s, p) => s + p.segunda, 0);
  const totQue  = hoje.reduce((s, p) => s + p.quebrados, 0);
  const totalAves = state.animais.filter(a => a.status === 'Ativo').reduce((s, a) => s + a.qtd, 0);
  const taxa = totalAves > 0 ? ((totOvos / totalAves) * 100).toFixed(1) + '%' : '—';

  document.getElementById('taxa-postura').textContent = taxa;
  document.getElementById('ovos-primeira').textContent = fmt(totPrim);
  document.getElementById('ovos-segunda').textContent  = fmt(totSeg);
  document.getElementById('ovos-quebrados').textContent = fmt(totQue);
  document.getElementById('kpi-ovos').textContent = fmt(totOvos);
}

function exportarProducao() {
  const header = 'Data,Lote,Galinheiro,1ª Classe,2ª Classe,Quebrados,Total\n';
  const rows = state.producao.map(p => {
    const t = p.primeira + p.segunda + p.quebrados;
    return `${p.data},${p.lote},${p.galinheiro},${p.primeira},${p.segunda},${p.quebrados},${t}`;
  }).join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'producao.csv'; a.click();
  showToast('✓ CSV exportado', 'success');
}

// ============================================================
//  ALIMENTAÇÃO
// ============================================================
function renderAlimentacao() {
  renderEstoque();
  renderHistoricoAlimentacao();
}

function renderEstoque() {
  const el = document.getElementById('estoqueList');
  el.innerHTML = state.estoque.map(e => {
    const pct = Math.round((e.qtd / e.max) * 100);
    const cor  = pct < 30 ? 'var(--red)' : pct < 60 ? 'var(--amber)' : 'var(--green)';
    const low  = e.qtd <= e.alerta;
    return `
      <div class="estoque-item">
        <div>
          <div class="estoque-nome">${e.nome} ${low ? '<span style="color:var(--red);font-size:10px">⚠ BAIXO</span>' : ''}</div>
          <div class="estoque-info">${fmt(e.qtd)} / ${fmt(e.max)} ${e.unidade}</div>
        </div>
        <div class="estoque-bar-wrap">
          <div class="estoque-bar-bg">
            <div class="estoque-bar-fill" style="width:${pct}%;background:${cor}"></div>
          </div>
        </div>
        <div class="estoque-qty" style="color:${cor}">${pct}%</div>
      </div>
    `;
  }).join('');
}

function renderHistoricoAlimentacao() {
  const tbody = document.getElementById('alimentacaoBody');
  tbody.innerHTML = state.alimentacao.map(a => `
    <tr>
      <td>${fmtDate(a.data)}</td>
      <td>${a.racao}</td>
      <td><strong style="color:var(--accent)">${a.lote}</strong></td>
      <td>${fmt(a.qtd)} kg</td>
      <td>${a.responsavel}</td>
    </tr>
  `).join('');
}

function salvarConsumo() {
  showToast('✓ Consumo registrado', 'success');
}

function salvarConsumoRacao() {
  const data  = document.getElementById('alimentacaoData').value;
  const lote  = document.getElementById('alimentacaoLote').value;
  const tipo  = document.getElementById('alimentacaoTipo').value;
  const qtd   = parseFloat(document.getElementById('alimentacaoQtd').value);
  const resp  = document.getElementById('alimentacaoResp').value.trim();

  if (!data || !lote || !qtd || qtd <= 0) return showToast('Preencha data, lote e quantidade', 'error');

  // Adiciona ao histórico
  state.alimentacao.unshift({
    id: state.nextId++,
    data,
    racao: tipo,
    lote,
    qtd,
    responsavel: resp || 'Não informado',
  });

  // Desconta do estoque se existir
  const estoqueItem = state.estoque.find(e => e.nome.toLowerCase().includes(tipo.toLowerCase().split(' ')[0]));
  if (estoqueItem) {
    estoqueItem.qtd = Math.max(0, estoqueItem.qtd - qtd);
  }

  closeModal('modalAlimentacao');
  renderHistoricoAlimentacao();
  renderEstoque();
  showToast(`✓ ${qtd} kg de ${tipo} registrado para lote ${lote}`, 'success');

  // Limpar campos
  ['alimentacaoQtd','alimentacaoResp','alimentacaoObs'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

// ============================================================
//  SAÚDE
// ============================================================
function renderSaude() {
  renderVacinas();
  renderOcorrencias();
}

function renderVacinas() {
  const el = document.getElementById('vacinasList');
  el.innerHTML = state.vacinas.map(v => `
    <div class="vacina-item">
      <div class="vacina-date">
        <span class="day">${v.dia}</span>
        <span class="month">${v.mes}</span>
      </div>
      <div>
        <div class="vacina-nome">${v.nome}</div>
        <div class="vacina-lote">Lote: ${v.lote}</div>
      </div>
      <div class="vacina-urgency ${v.urgente ? 'urgent' : 'normal'}">
        ${v.urgente ? '⚠ URGENTE' : '✓ Planejado'}
      </div>
    </div>
  `).join('');
}

function renderOcorrencias() {
  const tbody = document.getElementById('saudeBody');
  tbody.innerHTML = state.saude.map(s => `
    <tr>
      <td>${fmtDate(s.data)}</td>
      <td><strong style="color:var(--accent)">${s.lote}</strong></td>
      <td>${s.tipo}</td>
      <td>${s.desc}</td>
      <td>${statusBadge(s.status)}</td>
    </tr>
  `).join('');
}

function salvarOcorrencia() {
  const data = document.getElementById('saudeData').value;
  const lote = document.getElementById('saudeLote').value;
  const tipo = document.getElementById('saudeTipo').value;
  const status = document.getElementById('saudeStatus').value;
  const desc = document.getElementById('saudeDesc').value.trim();

  if (!data || !lote || !desc) return showToast('Preencha todos os campos', 'error');

  state.saude.unshift({ id: state.nextId++, data, lote, tipo, desc, status });
  closeModal('modalSaude');
  renderOcorrencias();
  showToast('✓ Ocorrência registrada', 'success');
  document.getElementById('saudeDesc').value = '';
}

function salvarVacina() {
  const lote       = document.getElementById('vacinaLote').value;
  const data       = document.getElementById('vacinaData').value;
  const nome       = document.getElementById('vacinaNome').value;
  const urgente    = document.getElementById('vacinaUrgencia').value === 'true';
  const responsavel = document.getElementById('vacinaResponsavel').value.trim();

  if (!lote || !data || !nome) return showToast('Preencha lote, data e vacina', 'error');

  // Formata dia e mês para exibição
  const [, mes, dia] = data.split('-');
  const meses = ['','JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];

  state.vacinas.unshift({
    dia: String(parseInt(dia)).padStart(2,'0'),
    mes: meses[parseInt(mes)],
    nome,
    lote,
    urgente,
    responsavel,
  });

  closeModal('modalVacina');
  renderVacinas();
  showToast(`✓ Vacinação de ${nome} agendada para ${dia}/${mes}`, 'success');

  // Limpar campos
  ['vacinaResponsavel','vacinaObs'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('vacinaUrgencia').value = 'false';
}

function preencherEstoqueAtual() {
  const idx = parseInt(document.getElementById('estoqueInsumo').value);
  const item = state.estoque[idx];
  if (!item) return;
  document.getElementById('estoqueAtualInfo').value = `${item.qtd} ${item.unidade}`;
  // Recalcula prévia com quantidade digitada
  calcPreviewEstoque();
}

function calcPreviewEstoque() {
  const idx = parseInt(document.getElementById('estoqueInsumo').value);
  const item = state.estoque[idx];
  if (!item) return;
  const qtdEnt = parseFloat(document.getElementById('estoqueQtdEnt').value) || 0;
  const nova = item.qtd + qtdEnt;
  document.getElementById('estoqueAposInfo').value = `${nova.toFixed(0)} ${item.unidade}`;
}

function salvarEntradaEstoque() {
  const idx        = parseInt(document.getElementById('estoqueInsumo').value);
  const data       = document.getElementById('estoqueDataEnt').value;
  const qtd        = parseFloat(document.getElementById('estoqueQtdEnt').value);
  const fornecedor = document.getElementById('estoqueFornecedor').value.trim();
  const valor      = parseFloat(document.getElementById('estoqueValorPago').value) || 0;

  if (isNaN(idx) || !data || !qtd || qtd <= 0) return showToast('Preencha insumo, data e quantidade', 'error');

  const item = state.estoque[idx];
  item.qtd += qtd;
  if (item.qtd > item.max) item.max = item.qtd; // expande capacidade se necessário

  // Registra no histórico de alimentação como entrada
  state.alimentacao.unshift({
    id: state.nextId++,
    data,
    racao: `[ENTRADA] ${item.nome}`,
    lote: '—',
    qtd,
    responsavel: fornecedor || 'Sem fornecedor',
  });

  // Se houve valor pago, lança como despesa financeira
  if (valor > 0) {
    state.financeiro.unshift({
      id: state.nextId++,
      data,
      desc: `Compra ${item.nome} — ${qtd} kg`,
      categoria: 'Ração',
      tipo: 'Despesa',
      valor,
    });
  }

  closeModal('modalEstoque');
  renderEstoque();
  renderHistoricoAlimentacao();
  if (valor > 0) renderFinanceiro();

  showToast(`✓ ${qtd} kg de ${item.nome} adicionados ao estoque`, 'success');

  // Limpar campos
  ['estoqueQtdEnt','estoqueFornecedor','estoqueValorPago','estoqueObsEnt'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('estoqueAtualInfo').value = '';
  document.getElementById('estoqueAposInfo').value  = '';
}

// ============================================================
//  FINANCEIRO
// ============================================================
function renderFinanceiro() {
  const filter = document.getElementById('filterFinanceiro')?.value || '';
  let data = state.financeiro;
  if (filter) data = data.filter(f => f.tipo === filter);

  const tbody = document.getElementById('financeiroBody');
  tbody.innerHTML = data.map(f => `
    <tr>
      <td>${fmtDate(f.data)}</td>
      <td>${f.desc}</td>
      <td>${f.categoria}</td>
      <td>${tipoBadge(f.tipo)}</td>
      <td style="color:${f.tipo === 'Receita' ? 'var(--green)' : 'var(--red)'};font-weight:600">${fmtBRL(f.valor)}</td>
    </tr>
  `).join('');

  updateFinanceiroKPIs();
}

function updateFinanceiroKPIs() {
  const receita = state.financeiro.filter(f => f.tipo === 'Receita').reduce((s, f) => s + f.valor, 0);
  const despesa = state.financeiro.filter(f => f.tipo === 'Despesa').reduce((s, f) => s + f.valor, 0);
  const lucro   = receita - despesa;
  const margem  = receita > 0 ? ((lucro / receita) * 100).toFixed(1) + '%' : '—';

  document.getElementById('fin-receita').textContent = fmtBRL(receita);
  document.getElementById('fin-despesa').textContent = fmtBRL(despesa);
  document.getElementById('fin-lucro').textContent   = fmtBRL(lucro);
  document.getElementById('fin-margem').textContent  = margem;
  document.getElementById('kpi-rec').textContent     = fmtBRL(receita);
}

function salvarTransacao() {
  const data  = document.getElementById('finData').value;
  const tipo  = document.getElementById('finTipo').value;
  const cat   = document.getElementById('finCategoria').value;
  const valor = parseFloat(document.getElementById('finValor').value);
  const desc  = document.getElementById('finDesc').value.trim();

  if (!data || !valor || !desc) return showToast('Preencha todos os campos', 'error');

  state.financeiro.unshift({ id: state.nextId++, data, desc, categoria: cat, tipo, valor });
  closeModal('modalFinanceiro');
  renderFinanceiro();
  showToast('✓ Transação salva', 'success');
  ['finValor','finDesc'].forEach(id => document.getElementById(id).value = '');
}

// listener filtro financeiro — em initModalEvents()

// ============================================================
//  DASHBOARD: Lotes & Atividades
// ============================================================
function renderLotesList() {
  const el = document.getElementById('lotesList');
  const ativos = state.animais.filter(a => a.status === 'Ativo');
  el.innerHTML = ativos.map(a => `
    <div class="lote-item">
      <div>
        <div class="lote-nome">${a.lote} — ${a.raca}</div>
        <div class="lote-info">${a.galinheiro} · ${a.idade} semanas</div>
      </div>
      <div class="lote-qtd">${fmt(a.qtd)}</div>
    </div>
  `).join('');
}

function renderAtividades() {
  const el = document.getElementById('atividadesList');
  const atividades = [
    { cor: 'green', texto: 'Produção registrada — Lote A-01 (2550 ovos)', hora: 'Hoje, 07:30' },
    { cor: 'amber', texto: 'Alerta: estoque de ração abaixo de 40%',       hora: 'Hoje, 08:12' },
    { cor: 'red',   texto: 'Ocorrência sanitária — Lote A-03 monitorado',  hora: 'Hoje, 09:00' },
    { cor: 'green', texto: 'Vacinação concluída — Lote A-02',              hora: 'Ontem, 14:45' },
    { cor: 'blue',  texto: 'Transação registrada — Venda ovos R$ 14.400',  hora: 'Ontem, 16:20' },
    { cor: 'amber', texto: 'Novo lote adicionado — A-04 (3100 aves)',      hora: '2 dias atrás'  },
  ];
  el.innerHTML = atividades.map(a => `
    <div class="ativ-item">
      <div class="ativ-dot ${a.cor}"></div>
      <div>
        <div class="ativ-texto">${a.texto}</div>
        <div class="ativ-hora">${a.hora}</div>
      </div>
    </div>
  `).join('');
}

// ============================================================
//  POPULARES SELECTS COM LOTES
// ============================================================
function populateLoteSelects() {
  const lotes = state.animais.filter(a => a.status === 'Ativo').map(a => a.lote);
  ['prodLote', 'saudeLote', 'vacinaLote', 'alimentacaoLote'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = lotes.map(l => `<option>${l}</option>`).join('');
  });

  // Popula select de insumos no modal estoque
  const elEst = document.getElementById('estoqueInsumo');
  if (elEst) {
    elEst.innerHTML = state.estoque.map((e, i) => `<option value="${i}">${e.nome}</option>`).join('');
  }
}

// ============================================================
//  CHARTS
// ============================================================
function initCharts() {
  initChartProducao();
  initChartGalinheiro();
  initChartConsumo();
}

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,   // funciona pois o canvas está dentro de .chart-wrap com altura fixa
  plugins: { legend: { display: false } },
  animation: { duration: 600 },
};

function chartColors() {
  return {
    gridColor: '#2e3020',
    tickColor: '#5e5c4a',
    accent: '#c8b84a',
    green:  '#5da84e',
    amber:  '#d4943a',
    blue:   '#4a88c4',
  };
}

function initChartProducao() {
  const labels = [];
  const data   = [];
  const base = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
    data.push(8200 + Math.round(Math.random() * 2400));
  }

  const c = chartColors();
  const ctx = document.getElementById('chartProducao').getContext('2d');
  state.charts.producao = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data,
        borderColor: c.accent,
        backgroundColor: 'rgba(200,184,74,.08)',
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: c.accent,
        fill: true,
        tension: .4,
      }],
    },
    options: {
      ...chartDefaults,
      scales: {
        x: { ticks: { color: c.tickColor, font: { family: 'JetBrains Mono', size: 10 } }, grid: { color: c.gridColor } },
        y: { ticks: { color: c.tickColor, font: { family: 'JetBrains Mono', size: 10 } }, grid: { color: c.gridColor } },
      },
    },
  });
}

function initChartGalinheiro() {
  const c = chartColors();
  const ctx = document.getElementById('chartGalinheiro').getContext('2d');
  state.charts.galinheiro = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['G-01', 'G-02', 'G-03', 'G-04', 'G-05'],
      datasets: [{
        data: [2500, 2800, 2200, 3100, 1880],
        backgroundColor: [c.accent, c.green, c.amber, c.blue, '#7a6ab0'],
        borderColor: '#161710',
        borderWidth: 3,
        hoverOffset: 6,
      }],
    },
    options: {
      ...chartDefaults,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: { color: c.tickColor, font: { family: 'JetBrains Mono', size: 10 }, boxWidth: 10, padding: 12 },
        },
      },
    },
  });
}

function initChartConsumo() {
  const c = chartColors();
  const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const ctx = document.getElementById('chartConsumo').getContext('2d');
  state.charts.consumo = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Consumo (kg)',
        data: labels.map(() => 580 + Math.round(Math.random() * 120)),
        backgroundColor: 'rgba(200,184,74,.25)',
        borderColor: c.accent,
        borderWidth: 1,
        borderRadius: 3,
      }],
    },
    options: {
      ...chartDefaults,
      scales: {
        x: { ticks: { color: c.tickColor, font: { family: 'JetBrains Mono', size: 10 } }, grid: { color: c.gridColor } },
        y: { ticks: { color: c.tickColor, font: { family: 'JetBrains Mono', size: 10 } }, grid: { color: c.gridColor } },
      },
    },
  });
}

function updateChart() {
  if (!state.charts.producao) return;
  const last = state.charts.producao.data.datasets[0].data;
  const totHoje = state.producao.filter(p => p.data === today())
    .reduce((s, p) => s + p.primeira + p.segunda + p.quebrados, 0);
  if (totHoje > 0) {
    last[last.length - 1] = totHoje;
    state.charts.producao.update();
  }
}

// ============================================================
//  RELATÓRIOS — ENGINE DE PDF
// ============================================================

function gerarRelatorio(tipo) {
  showToast('⏳ Gerando relatório...', 'success');
  setTimeout(() => {
    const html = buildRelatorioHTML(tipo);
    abrirJanelaImpressao(html, tipo);
  }, 200);
}

function abrirJanelaImpressao(html, tipo) {
  const win = window.open('', '_blank', 'width=900,height=700');
  if (!win) {
    showToast('⚠ Permita popups para gerar PDF', 'error');
    return;
  }
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => {
    win.print();
  }, 600);
  showToast('✓ Relatório aberto — use Ctrl+P para salvar como PDF', 'success');
}

// ---- CSS base de todos os relatórios ----
function relCSS() {
  return `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@300;400;600&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #1a1a1a; background: #fff; padding: 40px; }
      h1   { font-family: 'Libre Baskerville', serif; font-size: 22px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px; }
      h2   { font-family: 'Libre Baskerville', serif; font-size: 15px; font-weight: 700; color: #2a2a2a; margin: 28px 0 10px; border-bottom: 1px solid #ddd; padding-bottom: 6px; }
      h3   { font-size: 11px; font-weight: 600; color: #555; text-transform: uppercase; letter-spacing: .08em; margin: 18px 0 8px; }
      .header       { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; padding-bottom: 16px; border-bottom: 2px solid #1a1a1a; }
      .header-left  { }
      .header-right { text-align: right; font-size: 11px; color: #666; line-height: 1.8; }
      .subtitle     { font-size: 11px; color: #666; margin-top: 2px; }
      .brand        { font-family: 'Libre Baskerville', serif; font-size: 13px; font-weight: 700; color: #8a7820; letter-spacing: .05em; }
      table  { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 11px; }
      thead th { background: #f4f2e8; padding: 8px 10px; text-align: left; font-size: 10px; font-weight: 600; color: #444; text-transform: uppercase; letter-spacing: .07em; border-bottom: 1px solid #ccc; }
      tbody td { padding: 7px 10px; border-bottom: 1px solid #eee; color: #333; vertical-align: middle; }
      tbody tr:last-child td { border-bottom: none; }
      tbody tr:nth-child(even) td { background: #fafaf6; }
      .kpi-row   { display: flex; gap: 16px; margin: 16px 0 24px; flex-wrap: wrap; }
      .kpi-box   { flex: 1; min-width: 140px; border: 1px solid #ddd; border-radius: 6px; padding: 14px 16px; background: #fafaf6; }
      .kpi-label { font-size: 9px; color: #888; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 4px; }
      .kpi-val   { font-size: 20px; font-weight: 700; color: #1a1a1a; line-height: 1; }
      .kpi-box.green { border-color: #4a9e3f; }
      .kpi-box.red   { border-color: #c44a4a; }
      .kpi-box.amber { border-color: #c4843a; }
      .kpi-box.blue  { border-color: #3a78c4; }
      .kpi-val.green { color: #3a7e2f; }
      .kpi-val.red   { color: #c44a4a; }
      .kpi-val.amber { color: #a06420; }
      .kpi-val.blue  { color: #2a68b4; }
      .badge { display:inline-block; padding:2px 7px; border-radius:3px; font-size:9px; font-weight:700; text-transform:uppercase; }
      .badge-green { background:#e6f4e3; color:#2d7a24; }
      .badge-amber { background:#fef3e2; color:#a06420; }
      .badge-red   { background:#fce8e8; color:#c44a4a; }
      .badge-blue  { background:#e6eef8; color:#2a68b4; }
      .section-divider { border: none; border-top: 1px dashed #ddd; margin: 24px 0; }
      .footer { margin-top: 40px; padding-top: 12px; border-top: 1px solid #ddd; font-size: 10px; color: #aaa; display: flex; justify-content: space-between; }
      .nota { font-size: 10px; color: #888; font-style: italic; margin-top: 8px; }
      .receita { color: #2d7a24; font-weight: 600; }
      .despesa { color: #c44a4a; font-weight: 600; }
      .total-row td { font-weight: 700; background: #f4f2e8 !important; border-top: 2px solid #ccc; }
      @media print {
        body { padding: 20px; }
        @page { margin: 15mm; size: A4; }
      }
    </style>`;
}

function relHeader(titulo, subtitulo) {
  const agora = new Date().toLocaleString('pt-BR');
  return `
    <div class="header">
      <div class="header-left">
        <div class="brand">🐔 GranjaOS</div>
        <h1>${titulo}</h1>
        <p class="subtitle">${subtitulo}</p>
      </div>
      <div class="header-right">
        <div>Emitido em: <strong>${agora}</strong></div>
        <div>Sistema: GranjaOS v1.0</div>
        <div>Responsável: Administrador</div>
      </div>
    </div>`;
}

function relFooter() {
  return `<div class="footer"><span>GranjaOS — Sistema de Gerenciamento de Granja</span><span>Documento gerado automaticamente</span></div>`;
}

// ---- BUILDERS por tipo ----
function buildRelatorioHTML(tipo) {
  const builders = {
    producao:   buildRelProducao,
    financeiro: buildRelFinanceiro,
    saude:      buildRelSaude,
    estoque:    buildRelEstoque,
    animais:    buildRelAnimais,
    completo:   buildRelCompleto,
  };
  const body = (builders[tipo] || builders.completo)();
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>GranjaOS — Relatório</title>${relCSS()}</head><body>${body}</body></html>`;
}

// ---- PRODUÇÃO ----
function buildRelProducao() {
  const totalOvos   = state.producao.reduce((s, p) => s + p.primeira + p.segunda + p.quebrados, 0);
  const totalPrim   = state.producao.reduce((s, p) => s + p.primeira, 0);
  const totalSeg    = state.producao.reduce((s, p) => s + p.segunda, 0);
  const totalQue    = state.producao.reduce((s, p) => s + p.quebrados, 0);
  const totalAves   = state.animais.filter(a => a.status === 'Ativo').reduce((s, a) => s + a.qtd, 0);
  const mediaDia    = state.producao.length > 0 ? Math.round(totalOvos / [...new Set(state.producao.map(p => p.data))].length) : 0;
  const taxaMedia   = totalAves > 0 ? ((totalOvos / (totalAves * [...new Set(state.producao.map(p => p.data))].length)) * 100).toFixed(1) : '—';

  const linhas = state.producao.map(p => {
    const tot = p.primeira + p.segunda + p.quebrados;
    const an  = state.animais.find(a => a.lote === p.lote);
    const taxa = an ? ((tot / an.qtd) * 100).toFixed(1) + '%' : '—';
    return `<tr>
      <td>${fmtDate(p.data)}</td><td><strong>${p.lote}</strong></td><td>${p.galinheiro}</td>
      <td>${fmt(tot)}</td><td>${fmt(p.primeira)}</td><td>${fmt(p.segunda)}</td>
      <td style="color:#c44a4a">${fmt(p.quebrados)}</td><td>${taxa}</td>
    </tr>`;
  }).join('');

  return `
    ${relHeader('Relatório de Produção', 'Análise de postura, coleta e classificação de ovos')}
    <div class="kpi-row">
      <div class="kpi-box amber"><div class="kpi-label">Total de Ovos</div><div class="kpi-val amber">${fmt(totalOvos)}</div></div>
      <div class="kpi-box green"><div class="kpi-label">1ª Classe</div><div class="kpi-val green">${fmt(totalPrim)}</div></div>
      <div class="kpi-box blue"><div class="kpi-label">2ª Classe</div><div class="kpi-val blue">${fmt(totalSeg)}</div></div>
      <div class="kpi-box red"><div class="kpi-label">Quebrados</div><div class="kpi-val red">${fmt(totalQue)}</div></div>
      <div class="kpi-box amber"><div class="kpi-label">Média/Dia</div><div class="kpi-val">${fmt(mediaDia)}</div></div>
      <div class="kpi-box green"><div class="kpi-label">Taxa Postura</div><div class="kpi-val green">${taxaMedia}%</div></div>
    </div>
    <h2>Registros de Coleta</h2>
    <table><thead><tr><th>Data</th><th>Lote</th><th>Galinheiro</th><th>Total</th><th>1ª Classe</th><th>2ª Classe</th><th>Quebrados</th><th>Taxa Postura</th></tr></thead>
    <tbody>${linhas}
      <tr class="total-row"><td colspan="3">TOTAL GERAL</td><td>${fmt(totalOvos)}</td><td>${fmt(totalPrim)}</td><td>${fmt(totalSeg)}</td><td>${fmt(totalQue)}</td><td>—</td></tr>
    </tbody></table>
    <p class="nota">* Taxa de postura calculada sobre o total de aves ativas no lote na data de coleta.</p>
    ${relFooter()}`;
}

// ---- FINANCEIRO / DRE ----
function buildRelFinanceiro() {
  const receitas  = state.financeiro.filter(f => f.tipo === 'Receita');
  const despesas  = state.financeiro.filter(f => f.tipo === 'Despesa');
  const totRec    = receitas.reduce((s, f) => s + f.valor, 0);
  const totDesp   = despesas.reduce((s, f) => s + f.valor, 0);
  const lucro     = totRec - totDesp;
  const margem    = totRec > 0 ? ((lucro / totRec) * 100).toFixed(1) : '0';

  // Agrupa despesas por categoria
  const catDesp = {};
  despesas.forEach(f => { catDesp[f.categoria] = (catDesp[f.categoria] || 0) + f.valor; });

  const linhasRec  = receitas.map(f => `<tr><td>${fmtDate(f.data)}</td><td>${f.desc}</td><td>${f.categoria}</td><td class="receita">${fmtBRL(f.valor)}</td></tr>`).join('');
  const linhasDesp = despesas.map(f => `<tr><td>${fmtDate(f.data)}</td><td>${f.desc}</td><td>${f.categoria}</td><td class="despesa">${fmtBRL(f.valor)}</td></tr>`).join('');
  const linhasCat  = Object.entries(catDesp).map(([cat, val]) =>
    `<tr><td>${cat}</td><td class="despesa">${fmtBRL(val)}</td><td>${((val/totDesp)*100).toFixed(1)}%</td></tr>`
  ).join('');

  return `
    ${relHeader('DRE — Demonstrativo de Resultado', 'Receitas, despesas e apuração de resultado')}
    <div class="kpi-row">
      <div class="kpi-box green"><div class="kpi-label">Receita Total</div><div class="kpi-val green">${fmtBRL(totRec)}</div></div>
      <div class="kpi-box red"><div class="kpi-label">Despesa Total</div><div class="kpi-val red">${fmtBRL(totDesp)}</div></div>
      <div class="kpi-box ${lucro >= 0 ? 'green' : 'red'}"><div class="kpi-label">Resultado Líquido</div><div class="kpi-val ${lucro >= 0 ? 'green' : 'red'}">${fmtBRL(lucro)}</div></div>
      <div class="kpi-box amber"><div class="kpi-label">Margem de Lucro</div><div class="kpi-val amber">${margem}%</div></div>
    </div>
    <h2>Receitas</h2>
    <table><thead><tr><th>Data</th><th>Descrição</th><th>Categoria</th><th>Valor</th></tr></thead>
    <tbody>${linhasRec}<tr class="total-row"><td colspan="3">TOTAL RECEITAS</td><td class="receita">${fmtBRL(totRec)}</td></tr></tbody></table>
    <h2>Despesas por Categoria</h2>
    <table><thead><tr><th>Categoria</th><th>Total</th><th>% do Custo</th></tr></thead>
    <tbody>${linhasCat}<tr class="total-row"><td>TOTAL DESPESAS</td><td class="despesa">${fmtBRL(totDesp)}</td><td>100%</td></tr></tbody></table>
    <h2>Detalhamento de Despesas</h2>
    <table><thead><tr><th>Data</th><th>Descrição</th><th>Categoria</th><th>Valor</th></tr></thead>
    <tbody>${linhasDesp}<tr class="total-row"><td colspan="3">TOTAL DESPESAS</td><td class="despesa">${fmtBRL(totDesp)}</td></tr></tbody></table>
    ${relFooter()}`;
}

// ---- SANITÁRIO ----
function buildRelSaude() {
  const totalOcorr    = state.saude.length;
  const emTratamento  = state.saude.filter(s => s.status === 'Em Tratamento').length;
  const resolvidos    = state.saude.filter(s => s.status === 'Resolvido').length;
  const vacPendentes  = state.vacinas.filter(v => v.urgente).length;

  const statusColor = { 'Em Tratamento': 'amber', 'Resolvido': 'green', 'Monitorando': 'blue' };

  const linhasOcorr = state.saude.map(s => `<tr>
    <td>${fmtDate(s.data)}</td><td><strong>${s.lote}</strong></td><td>${s.tipo}</td>
    <td>${s.desc}</td><td><span class="badge badge-${statusColor[s.status] || 'blue'}">${s.status}</span></td>
  </tr>`).join('');

  const linhasVac = state.vacinas.map(v => `<tr>
    <td>${v.dia}/${v.mes}</td><td><strong>${v.lote}</strong></td><td>${v.nome}</td>
    <td><span class="badge badge-${v.urgente ? 'red' : 'green'}">${v.urgente ? 'URGENTE' : 'Planejado'}</span></td>
  </tr>`).join('');

  return `
    ${relHeader('Relatório Sanitário', 'Ocorrências, vacinações e monitoramento de saúde do plantel')}
    <div class="kpi-row">
      <div class="kpi-box blue"><div class="kpi-label">Total Ocorrências</div><div class="kpi-val blue">${totalOcorr}</div></div>
      <div class="kpi-box amber"><div class="kpi-label">Em Tratamento</div><div class="kpi-val amber">${emTratamento}</div></div>
      <div class="kpi-box green"><div class="kpi-label">Resolvidos</div><div class="kpi-val green">${resolvidos}</div></div>
      <div class="kpi-box red"><div class="kpi-label">Vacinações Urgentes</div><div class="kpi-val red">${vacPendentes}</div></div>
    </div>
    <h2>Ocorrências Sanitárias</h2>
    <table><thead><tr><th>Data</th><th>Lote</th><th>Tipo</th><th>Descrição</th><th>Status</th></tr></thead>
    <tbody>${linhasOcorr}</tbody></table>
    <h2>Calendário de Vacinações</h2>
    <table><thead><tr><th>Data Prevista</th><th>Lote</th><th>Vacina</th><th>Urgência</th></tr></thead>
    <tbody>${linhasVac}</tbody></table>
    ${relFooter()}`;
}

// ---- ESTOQUE ----
function buildRelEstoque() {
  const totalConsumo = state.alimentacao.reduce((s, a) => s + a.qtd, 0);
  const itensAlerta  = state.estoque.filter(e => e.qtd <= e.alerta).length;

  const linhasEst = state.estoque.map(e => {
    const pct = Math.round((e.qtd / e.max) * 100);
    const alerta = e.qtd <= e.alerta;
    return `<tr>
      <td>${e.nome}</td><td>${fmt(e.qtd)} ${e.unidade}</td><td>${fmt(e.max)} ${e.unidade}</td>
      <td>${pct}%</td>
      <td><span class="badge badge-${alerta ? 'red' : pct < 60 ? 'amber' : 'green'}">${alerta ? 'ALERTA' : pct < 60 ? 'MÉDIO' : 'OK'}</span></td>
    </tr>`;
  }).join('');

  const linhasConsumo = state.alimentacao.map(a =>
    `<tr><td>${fmtDate(a.data)}</td><td>${a.racao}</td><td>${a.lote}</td><td>${fmt(a.qtd)} kg</td><td>${a.responsavel}</td></tr>`
  ).join('');

  return `
    ${relHeader('Relatório de Estoque', 'Inventário de insumos, níveis de estoque e consumo')}
    <div class="kpi-row">
      <div class="kpi-box blue"><div class="kpi-label">Itens em Estoque</div><div class="kpi-val">${state.estoque.length}</div></div>
      <div class="kpi-box red"><div class="kpi-label">Itens em Alerta</div><div class="kpi-val red">${itensAlerta}</div></div>
      <div class="kpi-box amber"><div class="kpi-label">Consumo Registrado</div><div class="kpi-val">${fmt(totalConsumo)} kg</div></div>
    </div>
    <h2>Estoque Atual</h2>
    <table><thead><tr><th>Insumo</th><th>Qtd. Atual</th><th>Capacidade</th><th>Nível (%)</th><th>Status</th></tr></thead>
    <tbody>${linhasEst}</tbody></table>
    <h2>Histórico de Consumo</h2>
    <table><thead><tr><th>Data</th><th>Tipo de Ração</th><th>Lote</th><th>Quantidade</th><th>Responsável</th></tr></thead>
    <tbody>${linhasConsumo}</tbody></table>
    ${relFooter()}`;
}

// ---- ANIMAIS ----
function buildRelAnimais() {
  const ativos     = state.animais.filter(a => a.status === 'Ativo');
  const totalAves  = state.animais.reduce((s, a) => s + a.qtd, 0);
  const totalAtiv  = ativos.reduce((s, a) => s + a.qtd, 0);
  const statusCount = { Ativo: 0, Quarentena: 0, Descarte: 0, Encerrado: 0 };
  state.animais.forEach(a => { statusCount[a.status] = (statusCount[a.status] || 0) + 1; });

  const statusColor = { 'Ativo': 'green', 'Quarentena': 'amber', 'Descarte': 'red', 'Encerrado': 'blue' };

  const linhas = state.animais.map(a => `<tr>
    <td><strong>${a.lote}</strong></td><td>${a.raca}</td><td>${a.galinheiro}</td>
    <td>${fmt(a.qtd)}</td><td>${a.idade} semanas</td>
    <td><span class="badge badge-${statusColor[a.status] || 'blue'}">${a.status}</span></td>
    <td>${fmtDate(a.data)}</td>
  </tr>`).join('');

  return `
    ${relHeader('Inventário de Aves', 'Relação completa de lotes, raças e situação do plantel')}
    <div class="kpi-row">
      <div class="kpi-box blue"><div class="kpi-label">Total de Lotes</div><div class="kpi-val">${state.animais.length}</div></div>
      <div class="kpi-box green"><div class="kpi-label">Total de Aves</div><div class="kpi-val green">${fmt(totalAves)}</div></div>
      <div class="kpi-box green"><div class="kpi-label">Aves Ativas</div><div class="kpi-val green">${fmt(totalAtiv)}</div></div>
      <div class="kpi-box amber"><div class="kpi-label">Em Quarentena</div><div class="kpi-val amber">${statusCount.Quarentena || 0} lote(s)</div></div>
      <div class="kpi-box red"><div class="kpi-label">Descarte</div><div class="kpi-val red">${statusCount.Descarte || 0} lote(s)</div></div>
    </div>
    <h2>Relação de Lotes</h2>
    <table><thead><tr><th>Lote</th><th>Raça</th><th>Galinheiro</th><th>Qtd. Aves</th><th>Idade</th><th>Status</th><th>Data Entrada</th></tr></thead>
    <tbody>${linhas}
      <tr class="total-row"><td colspan="3">TOTAL GERAL</td><td>${fmt(totalAves)}</td><td colspan="3">—</td></tr>
    </tbody></table>
    ${relFooter()}`;
}

// ---- COMPLETO ----
function buildRelCompleto() {
  const totRec  = state.financeiro.filter(f => f.tipo === 'Receita').reduce((s, f) => s + f.valor, 0);
  const totDesp = state.financeiro.filter(f => f.tipo === 'Despesa').reduce((s, f) => s + f.valor, 0);
  const lucro   = totRec - totDesp;
  const totalAves = state.animais.filter(a => a.status === 'Ativo').reduce((s, a) => s + a.qtd, 0);
  const totalOvos = state.producao.reduce((s, p) => s + p.primeira + p.segunda + p.quebrados, 0);

  return `
    ${relHeader('Relatório Gerencial Completo', 'Consolidado operacional, produtivo e financeiro da granja')}
    <h2>1. Resumo Executivo</h2>
    <div class="kpi-row">
      <div class="kpi-box green"><div class="kpi-label">Aves Ativas</div><div class="kpi-val green">${fmt(totalAves)}</div></div>
      <div class="kpi-box amber"><div class="kpi-label">Ovos Produzidos</div><div class="kpi-val amber">${fmt(totalOvos)}</div></div>
      <div class="kpi-box green"><div class="kpi-label">Receita</div><div class="kpi-val green">${fmtBRL(totRec)}</div></div>
      <div class="kpi-box red"><div class="kpi-label">Despesas</div><div class="kpi-val red">${fmtBRL(totDesp)}</div></div>
      <div class="kpi-box ${lucro >= 0 ? 'green' : 'red'}"><div class="kpi-label">Lucro Líquido</div><div class="kpi-val ${lucro >= 0 ? 'green' : 'red'}">${fmtBRL(lucro)}</div></div>
    </div>
    <hr class="section-divider">
    <h2>2. Plantel</h2>
    ${buildRelAnimais().replace(/<.*?header.*?>/s, '').split('<h2>Relação')[1]?.split('</table>')[0]
      ? `<table><thead><tr><th>Lote</th><th>Raça</th><th>Galinheiro</th><th>Qtd.</th><th>Idade</th><th>Status</th></tr></thead><tbody>
        ${state.animais.map(a => `<tr><td><strong>${a.lote}</strong></td><td>${a.raca}</td><td>${a.galinheiro}</td><td>${fmt(a.qtd)}</td><td>${a.idade} sem.</td><td>${a.status}</td></tr>`).join('')}
      </tbody></table>` : ''}
    <hr class="section-divider">
    <h2>3. Produção</h2>
    <table><thead><tr><th>Data</th><th>Lote</th><th>Total Ovos</th><th>1ª Classe</th><th>2ª Classe</th><th>Quebrados</th></tr></thead>
    <tbody>${state.producao.map(p => `<tr><td>${fmtDate(p.data)}</td><td>${p.lote}</td><td>${fmt(p.primeira+p.segunda+p.quebrados)}</td><td>${fmt(p.primeira)}</td><td>${fmt(p.segunda)}</td><td>${fmt(p.quebrados)}</td></tr>`).join('')}
      <tr class="total-row"><td colspan="2">TOTAL</td><td>${fmt(totalOvos)}</td><td colspan="3">—</td></tr>
    </tbody></table>
    <hr class="section-divider">
    <h2>4. Resultado Financeiro</h2>
    <table><thead><tr><th>Data</th><th>Descrição</th><th>Tipo</th><th>Valor</th></tr></thead>
    <tbody>${state.financeiro.map(f => `<tr><td>${fmtDate(f.data)}</td><td>${f.desc}</td><td><span class="badge badge-${f.tipo==='Receita'?'green':'red'}">${f.tipo}</span></td><td class="${f.tipo==='Receita'?'receita':'despesa'}">${fmtBRL(f.valor)}</td></tr>`).join('')}
      <tr class="total-row"><td colspan="3">RESULTADO LÍQUIDO</td><td class="${lucro>=0?'receita':'despesa'}">${fmtBRL(lucro)}</td></tr>
    </tbody></table>
    <hr class="section-divider">
    <h2>5. Saúde & Ocorrências</h2>
    <table><thead><tr><th>Data</th><th>Lote</th><th>Tipo</th><th>Descrição</th><th>Status</th></tr></thead>
    <tbody>${state.saude.map(s => `<tr><td>${fmtDate(s.data)}</td><td>${s.lote}</td><td>${s.tipo}</td><td>${s.desc}</td><td>${s.status}</td></tr>`).join('')}</tbody></table>
    ${relFooter()}`;
}

// ============================================================
//  MODAIS
// ============================================================
function openModal(id) {
  const el = document.getElementById(id);
  if (!el) { console.warn('Modal não encontrado:', id); return; }
  el.classList.add('open');
  // Garante selects atualizados ao abrir qualquer modal que precise deles
  if (['modalEstoque','modalVacina','modalAlimentacao','modalProducao','modalSaude'].includes(id)) {
    populateLoteSelects();
  }
  // Preview de estoque ao abrir o modal
  if (id === 'modalEstoque') {
    setTimeout(preencherEstoqueAtual, 50);
  }
  // Data padrão hoje em campos de data dos modais
  const dateInputs = el.querySelectorAll('input[type="date"]');
  dateInputs.forEach(inp => { if (!inp.value) inp.value = today(); });
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

// Fechar ao clicar fora — tratado em initModalEvents()

// ============================================================
//  TOAST
// ============================================================
function showToast(msg, type = 'success') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `toast ${type} show`;
  clearTimeout(el._timeout);
  el._timeout = setTimeout(() => el.classList.remove('show'), 3000);
}