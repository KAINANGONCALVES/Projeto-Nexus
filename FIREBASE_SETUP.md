# 🔥 Configuração do Firebase

Este guia te ajudará a configurar o Firebase para o projeto TuctorCripto.

## 📋 Pré-requisitos

- Conta Google
- Node.js instalado
- Projeto TuctorCripto configurado

## 🚀 Passo a Passo

### 1. Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Criar projeto"
3. Digite o nome: `TuctorCripto`
4. Desabilite Google Analytics (opcional)
5. Clique em "Criar projeto"

### 2. Configurar Autenticação

1. No console do Firebase, vá em "Authentication"
2. Clique em "Get started"
3. Vá na aba "Sign-in method"
4. Habilite "Email/Password"
5. Clique em "Salvar"

### 3. Configurar Firestore Database

1. No console do Firebase, vá em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste" (para desenvolvimento)
4. Escolha a localização mais próxima (ex: us-central1)
5. Clique em "Próximo"

### 4. Configurar Regras do Firestore

1. No Firestore, vá em "Regras"
2. Substitua as regras por:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem ler/escrever apenas seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Conversões - usuários podem ler/escrever apenas suas próprias
    match /conversions/{conversionId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```
3. Clique em "Publicar"

### 5. Obter Credenciais

1. No console do Firebase, vá em "Configurações do projeto" (ícone de engrenagem)
2. Vá na aba "Geral"
3. Role até "Seus aplicativos"
4. Clique em "Adicionar app" e escolha "Web"
5. Digite o nome: `TuctorCripto Web`
6. Clique em "Registrar app"
7. Copie as credenciais que aparecem

### 6. Configurar no Projeto

1. Abra o arquivo `src/lib/firebase.ts`
2. Substitua as credenciais pelas suas:

```typescript
const firebaseConfig = {
  apiKey: "sua-api-key-aqui",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "seu-app-id"
};
```

### 7. Testar a Configuração

1. Execute o projeto: `npm run dev`
2. Acesse `http://localhost:8080`
3. Tente criar uma conta
4. Verifique se os dados aparecem no console do Firebase

## 📊 Estrutura do Banco

### Collection: `users`
```javascript
{
  uid: "string",
  email: "string",
  displayName: "string",
  favorites: ["BTC", "ETH"],
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

### Collection: `conversions`
```javascript
{
  userId: "string",
  fromSymbol: "string",
  toSymbol: "string",
  amount: "number",
  result: "number",
  rate: "number",
  date: "timestamp",
  createdAt: "timestamp"
}
```

## 🔒 Segurança

### Regras Recomendadas para Produção

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários autenticados podem gerenciar seus dados
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId;
    }
    
    // Conversões - usuários podem gerenciar apenas suas próprias
    match /conversions/{conversionId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 🚀 Deploy

### Para Produção

1. Configure as regras de segurança adequadas
2. Habilite índices necessários no Firestore
3. Configure domínios autorizados na autenticação
4. Monitore o uso no console do Firebase

### Variáveis de Ambiente

Para maior segurança, use variáveis de ambiente:

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

Crie um arquivo `.env.local`:
```env
VITE_FIREBASE_API_KEY=sua-api-key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=seu-app-id
```

## 🆘 Solução de Problemas

### Erro de Autenticação
- Verifique se o Email/Password está habilitado
- Confirme se as credenciais estão corretas

### Erro de Firestore
- Verifique se o banco foi criado
- Confirme se as regras estão corretas
- Teste as regras no console do Firebase

### Erro de CORS
- Adicione seu domínio aos domínios autorizados
- Configure corretamente as regras de segurança

## 📞 Suporte

- [Documentação Firebase](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Support](https://firebase.google.com/support) 