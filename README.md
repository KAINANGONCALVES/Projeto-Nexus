# TuctorCripto - Conversor de Criptomoedas

Uma aplicação moderna para conversão de criptomoedas com dados em tempo real da API do CoinGecko.

## 🚀 Funcionalidades

- **Conversão em Tempo Real**: Converta criptomoedas usando dados atualizados da API do CoinGecko
- **Lista de Criptomoedas**: Visualize as principais criptomoedas com preços e variações em tempo real
- **Sistema de Favoritos**: Adicione criptomoedas aos favoritos para acesso rápido
- **Histórico de Conversões**: Acompanhe todas as suas conversões anteriores
- **Busca Avançada**: Encontre qualquer criptomoeda através da busca
- **Interface Moderna**: Design responsivo e intuitivo com tema escuro

## 🛠️ Tecnologias Utilizadas

- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes
- **React Query** para gerenciamento de estado e cache
- **React Router** para navegação
- **Lucide React** para ícones
- **Firebase** para autenticação e banco de dados
- **CoinGecko API** para dados de criptomoedas

## 📊 Integração com APIs

### CoinGecko API
O projeto está totalmente integrado com a [API do CoinGecko](https://www.coingecko.com/api/documentation), oferecendo:

- **Dados em Tempo Real**: Preços atualizados de mais de 20.000 criptomoedas
- **Conversões Precisas**: Taxas de câmbio reais para conversões
- **Informações Detalhadas**: Market cap, volume, variações de preço
- **Busca Global**: Encontre qualquer criptomoeda disponível na API

### Firebase
O projeto utiliza o Firebase para:

- **Autenticação**: Sistema de login/registro seguro
- **Banco de Dados**: Armazenamento de perfil e histórico de conversões
- **Real-time**: Sincronização automática de dados
- **Segurança**: Regras de acesso configuráveis

### Endpoints Utilizados

- `/coins/markets` - Lista das principais criptomoedas
- `/simple/price` - Preços para conversões
- `/search` - Busca de criptomoedas
- `/coins/{id}` - Detalhes completos de uma criptomoeda

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone <URL_DO_REPOSITORIO>
cd TuctorCripto

# Instale as dependências
npm install

# Execute o projeto
npm run dev
```

O projeto estará disponível em `http://localhost:8080`

### Scripts Disponíveis

```bash
npm run dev          # Inicia o servidor de desenvolvimento
npm run build        # Gera build de produção
npm run preview      # Visualiza o build de produção
npm run lint         # Executa o linter
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/            # Componentes base do shadcn/ui
│   ├── CryptoCard.tsx # Card de criptomoeda
│   ├── SearchCrypto.tsx # Modal de busca
│   └── Navbar.tsx     # Barra de navegação
├── hooks/             # Hooks personalizados
│   ├── use-crypto.ts  # Hooks para API de criptomoedas
│   └── use-toast.ts   # Hook para notificações
├── lib/               # Utilitários e configurações
│   ├── api.ts         # Serviço da API do CoinGecko
│   ├── types.ts       # Tipos TypeScript
│   └── utils.ts       # Funções utilitárias
├── pages/             # Páginas da aplicação
│   ├── Dashboard.tsx  # Página principal
│   ├── Favorites.tsx  # Página de favoritos
│   ├── History.tsx    # Página de histórico
│   ├── Login.tsx      # Página de login
│   └── Register.tsx   # Página de registro
└── App.tsx            # Componente raiz
```

## 🔧 Configuração da API

A aplicação utiliza a API pública do CoinGecko, que não requer chave de API para uso básico. Para implementações em produção, recomenda-se:

1. **Rate Limiting**: A API pública tem limites de requisições
2. **Cache**: Implementar cache para otimizar performance
3. **Error Handling**: Tratamento robusto de erros de rede

## 🎨 Design System

O projeto utiliza um design system consistente com:

- **Cores**: Paleta escura com acentos azuis e cian
- **Tipografia**: Inter como fonte principal
- **Componentes**: Sistema de componentes do shadcn/ui
- **Responsividade**: Design mobile-first

## 📱 Funcionalidades Principais

### Dashboard
- Conversão de criptomoedas em tempo real
- Lista das principais criptomoedas
- Sistema de favoritos
- Busca avançada de criptomoedas

### Favoritos
- Visualização das criptomoedas favoritas
- Adição/remoção de favoritos
- Navegação rápida para conversão

### Histórico
- Lista de todas as conversões realizadas
- Filtros por criptomoeda
- Ordenação por data ou valor
- Limpeza do histórico

## 🔒 Autenticação e Banco de Dados

O sistema utiliza **Firebase** para autenticação e armazenamento de dados:

### Autenticação
- **Firebase Auth**: Sistema de login/registro seguro
- **Proteção de Rotas**: Componente ProtectedRoute
- **Context API**: Gerenciamento global do estado do usuário
- **Persistência**: Sessão mantida automaticamente

### Banco de Dados
- **Firestore**: Banco NoSQL em tempo real
- **Coleções**: `users` e `conversions`
- **Segurança**: Regras configuráveis por usuário
- **Sincronização**: Dados atualizados automaticamente

### Configuração
Veja o arquivo `FIREBASE_SETUP.md` para instruções detalhadas de configuração.

## 🚀 Deploy

Para fazer deploy da aplicação:

```bash
# Build de produção
npm run build

# Os arquivos estarão em dist/
```

### Plataformas Recomendadas

- **Vercel**: Deploy automático com GitHub
- **Netlify**: Deploy com drag & drop
- **GitHub Pages**: Deploy gratuito
- **Firebase Hosting**: Deploy do Google

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🙏 Agradecimentos

- [CoinGecko](https://www.coingecko.com/) pela API gratuita
- [shadcn/ui](https://ui.shadcn.com/) pelos componentes
- [Lucide](https://lucide.dev/) pelos ícones
- [Tailwind CSS](https://tailwindcss.com/) pelo framework CSS
