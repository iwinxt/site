# LMS Platform - Sistema de E-learning SaaS

Plataforma completa de vendas de cursos online com arquitetura moderna, escalável e segura.

## Stack Tecnológica

### Backend
- Node.js
- Express
- Supabase (PostgreSQL)
- JWT para autenticação
- Stripe/MercadoPago para pagamentos
- PandaVideo/Bunny.net para vídeos

### Frontend
- HTML5
- CSS3 (Vanilla)
- JavaScript ES6+ (Vanilla)
- SPA com Router customizado

## Estrutura do Projeto
```
saas-lms/
├── backend/          # API Node.js
└── frontend/         # SPA Vanilla JS
```

## Instalação

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configure as variáveis de ambiente
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Variáveis de Ambiente

Consulte os arquivos `.env.example` em cada diretório.

## Funcionalidades

- ✅ Autenticação JWT com refresh tokens
- ✅ Sessão única por usuário
- ✅ Proteção de vídeos com URLs assinadas
- ✅ Progresso automático (90% = concluído)
- ✅ Sistema de pagamentos integrado
- ✅ Assinaturas recorrentes
- ✅ LGPD compliance
- ✅ Rate limiting
- ✅ Auditoria de logs

## Segurança

- HTTPS obrigatório
- Criptografia de dados sensíveis
- RLS (Row Level Security) no Supabase
- Proteção contra fraudes
- Rate limiting
- Validação de dados

## Performance

- Cache com Redis (opcional)
- Lazy loading
- Code splitting
- CDN para assets estáticos
- Otimização de imagens

## Licença

Proprietário