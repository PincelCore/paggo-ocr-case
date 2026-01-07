
# Jornada de Desenvolvimento - Paggo OCR Case

## 🎯 Contexto Inicial

**Data de início:** 06/01/2025, 21:00h  
**Prazo:** 09/01/2025 (3 dias)  
**Meu nível:** Frontend (React, JS) - Primeira vez com backend

### Desafio Reconhecido
O case pede NestJS, tecnologia que nunca usei, sequer sei backend, confesso que isso é amedontrador, mas aceito o desafio e fiquei interessado, afinal sempre quis aprender backend e esse desafio me instigou. Porém, eu obviamente não vou conseguir resolver o case todo dado o nível de dificuldade. Minha estratégia é definir um MVP e entregar tudo que for mínimo e funcional o mais simplificado possível. 

Devido ao meu nível de experiência (júnior/estagiário), fiz as seguintes escolhas técnicas priorizando funcionalidade e aprendizado:
1. **Backend**: Pensei muito aqui em usar o Next.js API Routes ao invés de NestJS separado, mas decidi ficar com NestJS porque realmente parece ser requisito obrigatório do projeto. Vai ser complicado? Sim, mas estou disposto ao desafio. Vou pesquisar sobre esse framework e aprender backend do zero.
2. **Banco de Dados**: SQLite, pois é fácil e rápido de implementar. O banco de dados não importa muito porque vamos usar o Prisma ORM que vai basicamente permitir que a gente escreva BD em Javascript, o que é bizarramente incrível
3. **Autenticação**: Sistema básico email/senha sem o OAuth. Sei que esse é um dos requisitos do case, mas não acho que vou conseguir implementar essa feature de segurança. Posso tentar, mas não acho que esse critério seja "crítico" para o meu MVP. Dentre os objetivos além do MVP, esse é o mais importante (tentarei assim que tiver tudo funcionando do MVP)
4. **OCR**: Tesseract.js (client-side). Já trabalhei com ele, é fácil e simples.
### MVP Definido

**1. Tela de Login (simplificada)**

- Email e senha
- Validação básica
- Salvar "sessão" no localStorage

**2. Tela de Upload**

- Selecionar imagem
- Preview da imagem
- Botão de upload com loading
- Mensagens de sucesso/erro

**3. OCR Funcionando**

- Processar imagem com Tesseract.js
- Mostrar texto extraído na tela
- Salvar resultado (localStorage ou banco simples)

**4. Chat com IA**

- Campo para fazer perguntas sobre o texto extraído
- Integração com Claude API
- Mostrar histórico de perguntas/respostas

**5. Ver Documentos Anteriores**

- Lista simples dos uploads feitos
- Clicar e ver o texto extraído
- Voltar para o chat sobre aquele documento
### Panorama Geral
Ao olhar os outros requisitos do case, o que mais me chamou atenção foi o uso de LLM, essa aplicação realmente cativou meu interesse porque eu realmente gosto de trabalhar com LLMs e recentemente trabalhei com um RAG que usava justamente OCR (no caso Tesseract.js), acho que pegar esse case pode ser um grande aprendizado, apesar de eu não dominar nada de backend, vou aceitar o desafio, apesar de que a dificuldade desse case ser claramente de júnior/pleno iniciante.

Pedi ajuda a um amigo meu que é Dev pleno, ele é muito ocupado e respondeu de forma vaga que eu deveria usar o Claude AI para auxiliar o desenvolvimento.

---

## 📚 Dia 1 - Terça, 06/01/2025

### 18:00h - Análise e Planejamento

**Primeira ação:** Seguindo o conselho desse amigo meu, pedi ajuda ao Claude AI para entender como funcionaria a arquitetura geral do projeto e, principalmente, a me ajudar a entender os conceitos fundamentais de backend (Controladores, módulos e serviços). Estou me sentindo confiante mesmo sem nunca ter visto backend na vida, até agora estou gostando.

![alt text](image.png)

**Recursos consultados:**
- Documentação oficial NestJS: https://docs.nestjs.com
- Claude AI para explicações conceituais
- Vídeos: https://youtu.be/0M8AYU_hPas?si=lylM5qH6GsDqS0kf / https://youtu.be/vZp2e5Rr1w0?si=DRV73-4z874vqpMv

**Observações:** Segundo a documentação, o NestJS foi fortemente inspirado em bibliotecas como Angular, React e Vue, isso explica sua semelhança principalmente ao Angular. Ao que me parece, NestJS é basicamente um Angular para backend, é tudo muito parecido. O primeiro vídeo me fez ter essa visão também, o segundo vídeo me fez destravar e realmente pegar o feeling do NestJS. Ao que parece, esse framework facilita e muito o trabalho do backend (que eu não sei o quão difícil é porque eu nunca mexi com back). Temos os decorators igual no Angular, os imports e exports de classes iguais do React, é tudo muito "mastigado". 

**Decisão técnica:** Como já disse, vou focar no MVP:
- Upload de imagem ✅
- OCR (Tesseract.js) ✅
- Chat com IA (Claude API) ✅
- Prisma + SQLite ✅
- Deixar auth para o final ⚠️ (Tomara que dê tempo)

### 21:15h - Setup Inicial

**Problema encontrado:** Permissões no Arch Linux
```bash
npm i -g @nestjs/cli
# Error: EACCES: permission denied
```

**Solução:** Usar `sudo`
```bash
sudo npm i -g @nestjs/cli
# ✅ Funcionou!
```

**Aprendizado:** No Linux, pacotes globais precisam de sudo. (coisa boba, mas precisa prestar atenção)

### 21:30h - Criando Projeto NestJS
```bash
cd backend
nest new . --skip-git
npm run start:dev
```

![Screenshot: Hello World no localhost:3000](./docs/screenshots/day1-hello-world.png)

**Primeira impressão:** 
Ver "Hello World" pela primeira vez mexendo numa nova tecnologia é sempre gratificante, o npm nestjs criou um código base com vários arquivos de backend já pré feitos, típico de um framework, o React é assim, o Angular e por aí vai.

### 22:00h - Entendendo a Estrutura
```
src/
├── app.controller.ts  # "Garçom" - recebe requisições
├── app.service.ts     # "Cozinha" - processa lógica
├── app.module.ts      # "Cardápio" - registra tudo
└── main.ts            # Inicia o servidor
```

**Analogia que me ajudou:** Restaurante
- Controller = Garçom (recebe pedidos)
- Service = Cozinha (prepara comida)
- Module = Gerente (organiza tudo)

### 22:15h - Criando Módulo Document
```bash
nest g module document
nest g controller document
nest g service document
```

**Descoberta:** NestJS cria arquivos automaticamente e já registra no app.module

**Código implementado:**

`document.service.ts`:
```typescript
processarUpload(data: any) {
  return {
    success: true,
    message: 'Upload recebido',
    data: {
      filename: data.filename || 'unknown',
      timestamp: new Date().toISOString(),
    }
  };
}
```

`document.controller.ts`:
```typescript
@Controller('document')
export class DocumentController {
  constructor(private documentService: DocumentService) {}
  
  @Post('upload')
  uploadDocumentos(@Body() body: any) {
    return this.documentService.processarUpload(body);
  }
}
```

### 22:30h - Primeiro Bug 🐛

**Problema:** curl retornando 404
```bash
curl http://localhost:3000/document/list
# 404 Not Found
```

**Debug realizado:**
1. ✅ Código escrito corretamente
2. ✅ Imports corretos
3. ❓ Por que não funciona?

**Solução encontrada:** Hot reload do servidor não atualizou! Bastou eu fechar e abrir o server de novo (Novamente coisa boba)
```bash
# Ctrl+C no servidor
npm run start:dev
# Agora funcionou! ✅
```

**Aprendizado:** Às vezes precisa reiniciar o servidor manualmente.

### 22:45h - Endpoints Funcionando

![[Pasted image 20260107001241.png]]
![[Pasted image 20260107001035.png]]
**Emoção:** 🥳 Primeira vez fazendo backend funcionar sozinho!

### 23:00h - Configurando Prisma

**O que é Prisma?** (aprendi hoje)
- ORM = Não precisa escrever SQL
- Escreve em JavaScript/TypeScript
- Autocomplete no editor
```bash
npm install @prisma/client
npm install -D prisma
npx prisma init --datasource-provider sqlite
```
![[Pasted image 20260107001543.png]]

**Schema criado:**
```prisma
model Document {
  id            Int      @id @default(autoincrement())
  filename      String
  extractedText String?
  createdAt     DateTime @default(now())
  chats         Chat[]
}

model Chat {
  id         Int      @id @default(autoincrement())
  documentId Int
  question   String
  answer     String
  document   Document @relation(fields: [documentId], references: [id])
}
```

**Verificar o modelo no studio:** 
```bash
npx prisma migrate dev --name init
npx prisma studio
```

![[Pasted image 20260107001642.png]]

**Reação:** Cara, isso aqui é muito mais legal que phpMyAdmin!
Lembrou minha aula de Banco de Dados do semestre passado, mas moderno! Até mesmo a linha de relação das tabelas ele mostra, muito daora.

Consegui ver:
- ✅ Primary Keys (id)
- ✅ Foreign Keys (documentId)
- ✅ Relações entre tabelas
- ✅ Interface limpa e moderna

### 23:30h - Reflexões do Dia

**O que funcionou:**
- ✅ Pedir ajuda quando travei
- ✅ Entender conceitos antes de codar
- ✅ Testar cada passo (curl)
- ✅ Documentar enquanto faço

**Dificuldades:**
- ⚠️ TypeScript decorators ainda confusos (não manjo muito  de Angular, só React)
- ⚠️ Dependency Injection preciso praticar mais
- ⚠️ Hot reload nem sempre funciona

**Surpresas positivas:**
- 🎉 NestJS é mais organizado que pensei
- 🎉 Prisma Studio é incrível
- 🎉 Claude AI me ajudou MUITO a entender conceitos

**Honestidade:**
Usei Claude AI intensivamente para:
- Explicar conceitos (Controllers, Services, DI)
- Debugar erros (404, permissões)
- Sugerir estrutura de código
- MAS: Digitei todo código eu mesmo, entendi cada linha

**Status:** 🟢 Confiante para continuar amanhã!

---

## 📊 Progresso Geral

### ✅ Concluído (Dia 1)
- [x] Ambiente configurado
- [x] NestJS rodando
- [x] 2 endpoints funcionando
- [x] Prisma + SQLite configurado
- [x] Entendimento básico da arquitetura

### 🔄 Em Progresso
- [ ] Upload real de arquivos
- [ ] OCR
- [ ] Chat com IA

### ⏳ Próximos Passos (Dia 2)
1. Conectar endpoints ao banco Prisma
2. Implementar upload de arquivos (Multer)
3. Integrar Tesseract.js
4. Começar Claude API

---

## 🎓 Aprendizados Técnicos

### Conceitos Novos Hoje
1. **NestJS Architecture**
   - Modules organizam features
   - Controllers são pontos de entrada HTTP
   - Services contêm lógica de negócio
   - Dependency Injection conecta tudo

2. **TypeScript Decorators**
   - `@Controller()` - Define rota base
   - `@Injectable()` - Permite injeção
   - `@Get()` / `@Post()` - Define método HTTP
   - `@Body()` - Extrai dados da requisição

3. **Prisma ORM**
   - Schema define estrutura do banco
   - Migrations criam/atualizam tabelas
   - Prisma Client gera TypeScript types
   - Prisma Studio = UI para visualizar dados

### Comandos Importantes
```bash
# NestJS
nest new projeto          # Criar projeto
nest g module nome        # Gerar módulo
nest g controller nome    # Gerar controller
nest g service nome       # Gerar service

# Prisma
npx prisma init           # Inicializar
npx prisma migrate dev    # Criar migration
npx prisma generate       # Gerar client
npx prisma studio         # Abrir UI
```

---

## 🙏 Recursos Utilizados

**Ferramentas:**
- Claude AI - Explicações e debug
- NestJS Docs - Referência oficial
- Prisma Docs - Schema e queries
- curl - Testar endpoints

**Sistema:**
- SO: Arch Linux
- Editor: VSCodium
- Node: v25.2.1
- npm: 11.7.0