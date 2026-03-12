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
  renderAll();
  initCharts();
});

function initDates() {
  const now = new Date();
  const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('todayDate').textContent = now.toLocaleDateString('pt-BR', opts);
  document.getElementById('sidebarDate').textContent = now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  document.getElementById('dataProd').value = today();
  document.getElementById('finData').value = today();
  document.getElementById('saudeData').value = today();
  document.getElementById('prodData').value = today();
  document.getElementById('loteData').value = today();
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

// Busca
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('searchAnimal')?.addEventListener('input', e => renderAnimais(e.target.value.toLowerCase()));
  document.getElementById('filterStatus')?.addEventListener('change', () => renderAnimais(document.getElementById('searchAnimal').value));
});

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

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('filterFinanceiro')?.addEventListener('change', renderFinanceiro);
});

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
  ['prodLote', 'saudeLote'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = lotes.map(l => `<option>${l}</option>`).join('');
  });
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
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
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
//  RELATÓRIOS
// ============================================================
function gerarRelatorio(tipo) {
  const nomes = {
    producao: 'Relatório de Produção',
    financeiro: 'DRE — Demonstrativo',
    saude: 'Relatório Sanitário',
    estoque: 'Relatório de Estoque',
    animais: 'Inventário de Aves',
    completo: 'Relatório Gerencial Completo',
  };
  showToast(`📄 ${nomes[tipo]} gerado com sucesso`, 'success');
}

// ============================================================
//  MODAIS
// ============================================================
function openModal(id) {
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

// Fechar ao clicar fora
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });
});

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