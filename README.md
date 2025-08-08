# MT5 Optimizer Analyzer

## 🔒 Segurança

Este projeto implementa várias medidas de segurança:

### ✅ Medidas Implementadas

- **Autenticação obrigatória** via Supabase
- **Validação de arquivos XML** (tamanho, tipo MIME, conteúdo)
- **Sanitização XML** para prevenir ataques XXE
- **Variáveis de ambiente** para credenciais sensíveis
- **Headers de segurança** configurados no Vercel
- **Content Security Policy (CSP)** implementada
- **Validação de entrada** em todos os formulários
- **Tratamento de erros** personalizado

### 🛡️ Proteções Contra

- **XXE (XML External Entity) attacks**
- **XSS (Cross-Site Scripting)**
- **CSRF (Cross-Site Request Forgery)**
- **Clickjacking**
- **MIME type sniffing**
- **Upload de arquivos maliciosos**

## 🚀 Deploy na Vercel

### Pré-requisitos
1. Conta no [Vercel](https://vercel.com)
2. Projeto Supabase configurado
3. Repositório Git (GitHub, GitLab, ou Bitbucket)

### Passos para Deploy

1. **Preparar o repositório:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <seu-repositorio>
   git push -u origin main
   ```

2. **Configurar variáveis de ambiente no Vercel:**
   - `VITE_SUPABASE_URL`: URL do seu projeto Supabase
   - `VITE_SUPABASE_ANON_KEY`: Chave anônima do Supabase

3. **Conectar repositório ao Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Importe seu repositório
   - Configure as variáveis de ambiente
   - Deploy automático

4. **Configurar Supabase:**
   - Ativar autenticação por email
   - Configurar políticas RLS se necessário
   - Adicionar domínio do Vercel nas configurações de autenticação
   - Configurar templates de email personalizados

### Configurações de Segurança Implementadas

#### Headers de Segurança
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- Content Security Policy (CSP) restritiva

#### Validações de Input
- Validação de email com regex
- Limitação de tamanho de senha (6-128 caracteres)
- Sanitização de dados de entrada
- Escape de HTML para prevenir XSS

#### Segurança de Arquivos
- Validação de extensão (.xml apenas)
- Limitação de tamanho (50MB máximo)
- Verificação de MIME type
- Sanitização de conteúdo XML
- Prevenção de ataques XXE

### Monitoramento e Manutenção

1. **Logs de Erro:**
   - Monitore logs no Vercel Dashboard
   - Configure alertas para erros críticos

2. **Performance:**
   - Use Vercel Analytics
   - Monitore Core Web Vitals

3. **Segurança:**
   - Revise logs de autenticação regularmente
   - Monitore tentativas de upload maliciosos
   - Mantenha dependências atualizadas

### Troubleshooting

**Erro de CORS:**
- Verifique configurações do Supabase
- Adicione domínio nas configurações de autenticação

**Erro de autenticação:**
- Verifique variáveis de ambiente
- Confirme configuração de email no Supabase

**Erro de upload:**
- Verifique tamanho do arquivo (máx 50MB)
- Confirme formato XML válido

## 📁 Estrutura do Projeto

```
├── index.html          # Página principal
├── script.js           # Lógica da aplicação
├── styles.css          # Estilos
├── supabase.js         # Configuração do Supabase
├── vercel.json         # Configuração do Vercel
├── .env.example        # Exemplo de variáveis de ambiente
├── .gitignore          # Arquivos ignorados pelo Git
└── README.md           # Este arquivo
```

## 🔧 Desenvolvimento Local

1. Clone o repositório
2. Copie `.env.example` para `.env`
3. Configure suas credenciais do Supabase
4. Abra `index.html` em um servidor local

## ⚠️ Importante

- **NUNCA** commite o arquivo `.env` no Git
- Use sempre HTTPS em produção
- Mantenha as dependências atualizadas
- Monitore logs de erro regularmente

## 📞 Suporte

Para questões de segurança, entre em contato imediatamente.