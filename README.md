# PeiFeira - Frontend

Sistema de gestão de Projetos Integradores acadêmicos.

## 🚀 Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Origin UI** (coss.com/ui) - Base UI components
- **React Query** (TanStack Query)
- **Axios**
- **Zod**
- **React Hook Form**
- **Zustand**
- **Node.js 22.20.0**

## 📦 Instalação

```bash
# Usar Node.js 22.20.0
nvm use

# Instalar dependências
npm install
```

## 🔧 Configuração

Crie um arquivo `.env.local` na raiz:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🏃 Executar

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start

# Lint
npm run lint
```

Abra [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura

```
frontend-peifeira/
├── app/              # Rotas Next.js (App Router)
├── components/       # Componentes React
│   └── ui/          # Origin UI components
├── lib/             # Core (API, hooks, types, utils)
│   └── config/      # Configurações
├── providers/       # Context Providers
├── .nvmrc          # Node version (22.20.0)
├── .env.local      # Variáveis de ambiente (não commitado)
└── .env.example    # Template de variáveis
```

## 🔗 Links

- **Origin UI**: https://coss.com/ui/docs
- **Backend .NET**: (https://github.com/Clinkoff/PeiFeira)

## 📝 Scripts

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm start` - Inicia servidor de produção
- `npm run lint` - Executa ESLint
- `npm run format` - Formata código com Prettier (adicionar script)

## 🎯 Próximos Passos

Ver [MILESTONES.md](./MILESTONES.md) para roadmap completo.
