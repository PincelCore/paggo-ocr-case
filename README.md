# Paggo OCR Case - Sistema de OCR com IA

Sistema completo de upload de documentos com extração de texto via OCR e chat interativo com IA.

## 🎯 Funcionalidades Implementadas

### Backend (NestJS)
- ✅ **Autenticação JWT** - Login e registro de usuários
- ✅ **Upload de arquivos** - Multer com validação de imagens
- ✅ **OCR** - Extração de texto com Tesseract.js
- ✅ **Chat com IA** - Integração com Groq (Llama 3.3 70B)
- ✅ **Banco de dados** - Prisma ORM com SQLite
- ✅ **Proteção de rotas** - Guards JWT em todas as rotas sensíveis
- ✅ **Isolamento de dados** - Cada usuário vê apenas seus documentos

### Frontend (Next.js)
- ✅ **Autenticação** - Login e registro com feedback visual
- ✅ **Upload de documentos** - Preview, validação e feedback
- ✅ **Visualização de OCR** - Exibição do texto extraído
- ✅ **Chat interativo** - Interface para perguntas sobre documentos
- ✅ **Histórico** - Lista de documentos e conversas anteriores
- ✅ **CSS organizado** - Modules CSS com nomenclatura em português

## 🛠️ Stack Técnica

**Backend:**
- NestJS 10.x
- Prisma ORM 5.22
- SQLite
- Passport JWT
- Bcryptjs
- Tesseract.js
- Groq SDK (Llama 3.3)
- Multer

**Frontend:**
- Next.js 14 (App Router)
- React 18
- CSS Modules
- Tailwind CSS (utilitários globais)

## 📦 Instalação e Execução Local

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Backend
```bash
# 1. Entrar na pasta
cd backend

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env

# Editar .env e adicionar:
# DATABASE_URL="file:./dev.db"
# JWT_SECRET="sua-chave-secreta-aqui"
# GROQ_API_KEY="sua-api-key-do-groq"

# 4. Gerar Prisma Client e rodar migrations
npx prisma generate
npx prisma migrate dev

# 5. Iniciar servidor
npm run start:dev

# Servidor rodando em: http://localhost:3000
```

### Frontend
```bash
# 1. Entrar na pasta
cd frontend

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
# Criar arquivo .env.local com:
NEXT_PUBLIC_API_URL=http://localhost:3000

# 4. Iniciar servidor de desenvolvimento
npm run dev

# Aplicação rodando em: http://localhost:3001
```

## 🔑 Obter API Key do Groq (Gratuita)

1. Acesse: https://console.groq.com/
2. Crie uma conta (login com Google/GitHub)
3. Vá em "API Keys"
4. Crie uma nova key
5. Copie e cole no `.env` do backend

## 🚀 Deploy

### Backend (Railway)
```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Deploy
cd backend
railway init
railway up
```

### Frontend (Vercel)
```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Deploy
cd frontend
vercel

# Seguir instruções interativas
```

## 📚 Endpoints da API

### Autenticação
```
POST /auth/register - Criar conta
POST /auth/login    - Fazer login
```

### Documentos (Protegido - requer token)
```
POST /document/upload - Upload de imagem
GET  /document/list   - Listar meus documentos
GET  /document/:id    - Buscar documento específico
```

### Chat (Protegido - requer token)
```
POST /chat/ask              - Fazer pergunta sobre documento
GET  /chat/history/:docId   - Histórico de conversas
```

## 🧪 Testando a API

### Registrar usuário
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@email.com",
    "password": "senha123",
    "name": "Usuário Teste"
  }'
```

### Fazer login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@email.com",
    "password": "senha123"
  }'
```

### Upload (com token)
```bash
curl -X POST http://localhost:3000/document/upload \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -F "file=@caminho/para/imagem.jpg"
```

## 🏗️ Arquitetura
```
┌─────────────┐
│   Frontend  │ (Next.js)
│   :3001     │
└──────┬──────┘
       │ HTTP + JWT
       ▼
┌─────────────┐
│   Backend   │ (NestJS)
│   :3000     │
└──────┬──────┘
       │
       ├─► Prisma ──► SQLite (dev.db)
       ├─► Tesseract.js (OCR)
       └─► Groq API (LLM)
```

## 📝 Decisões Técnicas

### Por que Groq ao invés de Claude?
- Claude API passou a ser paga ($5 mínimo)
- Groq oferece 14.4k requests/dia grátis
- Llama 3.3 70B tem qualidade comparável
- Velocidade superior (~0.5s vs ~3s)

### Por que SQLite?
- Simplicidade de setup (zero configuração)
- Suficiente para MVP
- Prisma facilita migração futura para PostgreSQL

### Por que CSS Modules?
- Evita conflitos de classe
- Melhor organização que Tailwind inline
- Mais fácil manutenção
- Nomenclatura em português (mais natural)

## 🐛 Problemas Conhecidos

### OCR não pegou todo o texto
**Causa:** Tesseract.js tem limitações com layouts complexos  
**Solução:** 
- Usar imagens com melhor contraste
- Pré-processar imagem (converter p/ preto e branco)
- Considerar Google Vision API para produção

### CORS em produção
**Solução:** Configurar origins corretas no `main.ts`:
```typescript
app.enableCors({
  origin: ['https://seu-frontend.vercel.app'],
  credentials: true,
});
```
### Problema de conexão do backend com o banco de dados
-Existe um bug conhecido do prisma com o nest.js , para resolver, basta usar uma versão anterior do prisma 5.0 ao invés do mais recente 7.0

## 🐛 Limitação Conhecida: OCR

### Problema
Tesseract.js tem dificuldade com layouts complexos e cores.

### Solução Implementada
Pré-processamento com Sharp:
- Conversão pra escala de cinza
- Normalização de contraste  
- Binarização
- Aumento de nitidez

### Solução Produção
Para produção, recomenda-se:
- Google Cloud Vision API (99% precisão)
- AWS Textract
- Azure Computer Vision

### Trade-off
Mantive Tesseract.js por ser:
- ✅ Gratuito
- ✅ Sem dependências externas
- ✅ Funciona offline
- ⚠️ Menor precisão em layouts complexos

## 👤 Autor

**Davi Gomes Alves**  
Email: daviga@ic.ufrj.br

## 📄 Licença

Este projeto foi desenvolvido como case técnico para processo seletivo da Paggo.