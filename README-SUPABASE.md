# Integração SGQ PUEL com Supabase

## 📋 Visão Geral

Este projeto migra o sistema SGQ (Sistema de Gestão da Qualidade) do localStorage para o Supabase, proporcionando:
- Armazenamento de dados em nuvem
- Acesso multiusuário em tempo real
- Backup automático
- Escalabilidade
- Segurança aprimorada

## 🗂️ Estrutura de Arquivos

```
├── sgq-supabase.html          # Versão atualizada com Supabase
├── supabase-client.js         # Cliente de conexão com Supabase
├── sgq-supabase-schema.sql    # Esquema do banco de dados
├── README-SUPABASE.md         # Este arquivo
└── index.html                 # Versão original (localStorage)
```

## 🚀 Passos para Implementação

### 1. Criar Projeto Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Crie uma conta ou faça login
3. Clique em "New Project"
4. Escolha uma organização
5. Configure o projeto:
   - **Nome**: `sgq-puel`
   - **Database Password**: Crie uma senha forte
   - **Region**: Escolha a região mais próxima (ex: South America)
6. Aguarde a criação do projeto (2-3 minutos)

### 2. Configurar Banco de Dados

1. No painel do Supabase, vá para **SQL Editor**
2. Clique em **New query**
3. Copie e cole todo o conteúdo do arquivo `sgq-supabase-schema.sql`
4. Clique em **Run** para executar o script
5. Verifique se todas as tabelas foram criadas em **Table Editor**

### 3. Configurar Autenticação

1. Vá para **Authentication** → **Settings**
2. Em **Site URL**, adicione: `http://localhost:3000` (ou seu domínio)
3. Em **Redirect URLs**, adicione: `http://localhost:3000/**`
4. Habilite **Email/Password** authentication

### 4. Obter Credenciais

1. No painel Supabase, vá para **Project Settings** → **API**
2. Copie os seguintes valores:
   - **Project URL** (ex: `https://abcdefg.supabase.co`)
   - **anon public** API Key

### 5. Configurar Cliente Supabase

Abra o arquivo `supabase-client.js` e atualize as credenciais:

```javascript
// Linhas 6-7
this.supabaseUrl = 'https://SEU-PROJETO.supabase.co';  // Substitua
this.supabaseKey = 'SUA-CHAVE-ANONIMA';                // Substitua
```

### 6. Testar Sistema

1. Abra o arquivo `sgq-supabase.html` no navegador
2. Faça login com as credenciais padrão:
   - Email: `diretor@puel.com.br`
   - Senha: `123456`
3. Clique em **"🔄 Migrar dados para Supabase"** na tela de login
4. Aguarde a migração completar
5. Faça login novamente para testar com dados do Supabase

## 📊 Estrutura do Banco de Dados

### Tabelas Principais

- **`usuarios`**: Cadastro de usuários e perfis
- **`obras`**: Registro de obras e configurações
- **`templates_fvs`**: Templates para Ficha de Verificação de Serviço
- **`templates_fvm`**: Templates para Ficha de Verificação de Material
- **`fvs`**: FVS criadas e seus resultados
- **`ocorrencias`**: Não conformidades registradas
- **`fvm`**: FVM criadas e seus resultados
- **`fornecedores`**: Cadastro de fornecedores

### Relacionamentos

- `obras.engenheiro_id` → `usuarios.id`
- `fvs.obra_id` → `obras.id`
- `fvs.inspetor_id` → `usuarios.id`
- `ocorrencias.fvs_id` → `fvs.id`
- `ocorrencias.responsavel_id` → `usuarios.id`

## 🔧 Funcionalidades Implementadas

### ✅ Concluídas

- [x] Esquema completo do banco de dados
- [x] Cliente Supabase com CRUD básico
- [x] Sistema de login compatível
- [x] Dashboard com dados do Supabase
- [x] Migração automática de dados
- [x] Seleção de obras
- [x] Interface responsiva mantida

### 🚧 Em Desenvolvimento

- [ ] Autenticação nativa do Supabase Auth
- [ ] Implementação completa de FVS
- [ ] Implementação completa de FVM
- [ ] Gestão de templates
- [ ] Sistema de alertas
- [ ] Relatórios e PDFs

### 📋 Planejadas

- [ ] Upload de imagens para Storage
- [ ] Notificações em tempo real
- [ ] Backup e restore
- [ ] Auditoria de alterações
- [ ] API para integrações externas

## 🔄 Processo de Migração

### Dados Migrados Automaticamente

1. **Usuários**: Contas e perfis de acesso
2. **Obras**: Dados cadastrais e configurações
3. **Templates**: Critérios de verificação
4. **FVS**: Fichas abertas e resultados
5. **Ocorrências**: Não conformidades
6. **FVM**: Fichas de verificação de material
7. **Fornecedores**: Cadastro de fornecedores

### Validação Pós-Migração

- Verifique contagem de registros em cada tabela
- Teste login com diferentes usuários
- Confirme dados no dashboard
- Valide funcionalidades básicas

## 🛠️ Configuração Avançada

### Row Level Security (RLS)

O esquema inclui políticas básicas de RLS. Para produção:

1. Vá para **Authentication** → **Policies**
2. Revise e ajuste as políticas conforme necessário
3. Teste com diferentes perfis de usuário

### Performance

- Índices criados automaticamente
- Queries otimizadas
- Cache habilitado

### Backup

O Supabase faz backup automático diário. Para backup manual:

1. Vá para **Settings** → **Database**
2. Clique em **Backups**
3. Configure backup adicional se necessário

## 🐛 Solução de Problemas

### Erros Comuns

**"Connection failed"**
- Verifique URL e API key
- Confirme projeto está ativo
- Teste conectividade

**"Permission denied"**
- Verifique políticas RLS
- Confirme usuário autenticado
- Revise permissões da tabela

**"Migration failed"**
- Verifique conexão com internet
- Confirme schema criado
- Limpe localStorage e tente novamente

### Debug

Abra o console do navegador (F12) para ver mensagens de erro e debug.

## 📞 Suporte

### Recursos

- [Documentação Supabase](https://supabase.com/docs)
- [JavaScript Client Reference](https://supabase.com/docs/reference/javascript)
- [SQL Editor Guide](https://supabase.com/docs/guides/database/sql-editor)

### Contato

Para dúvidas específicas do SGQ:
- Analise os logs no console
- Verifique estrutura de dados
- Teste com dados de exemplo

## 🔄 Próximos Passos

1. **Implementar autenticação Supabase Auth**
2. **Completar migração de todas as telas**
3. **Adicionar upload de imagens**
4. **Implementar notificações real-time**
5. **Criar sistema de backup/restore**
6. **Desenvolver API externa**

---

## 📝 Notas de Versão

### v2.0 - Supabase Integration
- Migração de localStorage para Supabase
- Esquema de banco de dados relacional
- Sistema de login compatível
- Dashboard funcional
- Migração automática de dados

### v1.0 - LocalStorage
- Sistema completo em localStorage
- Todas as funcionalidades implementadas
- Interface responsiva
- Dados locais apenas
