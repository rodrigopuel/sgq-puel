# SGQ PUEL - Sistema de Gestão da Qualidade

## 🚀 Deploy via GitHub Pages

### Passos para Deploy:

1. **Criar Repositório GitHub**
   - Vá para [github.com](https://github.com)
   - Clique em "New repository"
   - Nome: `sgq-puel`
   - Public (recomendado para deploy)
   - Não marque "Add README"

2. **Fazer Upload dos Arquivos**
   - Copie estes arquivos para o repositório:
     - `index.html` (cópia de sgq-supabase.html)
     - `supabase-client.js`
     - `README.md` (este arquivo)

3. **Configurar GitHub Pages**
   - Vá para Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `main` ou `master`
   - Folder: `/root`
   - Clique "Save"

4. **Acessar Sistema**
   - URL: `https://seu-usuario.github.io/sgq-puel/`
   - Aguarde 2-5 minutos para o deploy

## 🔐 Configuração de Segurança

### CORS no Supabase:
Execute o script `cors-config.sql` no painel SQL do Supabase

### Redirecionamentos:
1. Vá para Authentication → Settings
2. Adicione: `https://seu-usuario.github.io/sgq-puel/**`

## 📱 Acesso Multiplataforma

- **Desktop**: Chrome, Firefox, Edge, Safari
- **Mobile**: Navegador nativo (100% responsivo)
- **Tablet**: Interface adaptável automática

## 🛡️ Segurança Implementada

- RLS (Row Level Security) ativo
- Autenticação via Supabase Auth
- Políticas de acesso por usuário
- HTTPS automático via GitHub

## 📞 Suporte

Sistema configurado para múltiplos usuários em locais diferentes com acesso global seguro.
