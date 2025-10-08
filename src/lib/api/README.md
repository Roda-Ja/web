# Sistema de API e Autenticação

Este diretório contém toda a configuração e serviços para comunicação com a API backend.

## Estrutura

- `client.ts` - Cliente Axios configurado com interceptors
- `types.ts` - Tipos TypeScript para requisições e respostas
- `auth.ts` - Serviços de autenticação (sign-up, sign-in, etc.)
- `index.ts` - Exportações principais

## Configuração

### Base URL

A API está configurada para `http://localhost:3000/api/v1`

### Autenticação

- **Access Token**: Enviado no header `Authorization: Bearer <token>`
- **Refresh Token**: Enviado no header `X-Refresh-Token` quando necessário
- **Persistência**: Tokens são salvos no localStorage via Zustand persist

## Uso

### Sign Up

```typescript
import { useSignUp } from '@/hooks/use-auth'

const signUpMutation = useSignUp()

// No formulário
const handleSubmit = (data) => {
  signUpMutation.mutate({
    name: data.name,
    email: data.email,
    password: data.password,
  })
}
```

### Sign In

```typescript
import { useSignIn } from '@/hooks/use-auth'

const signInMutation = useSignIn()

// No formulário
const handleSubmit = (data) => {
  signInMutation.mutate({
    email: data.email,
    password: data.password,
  })
}
```

## Store de Autenticação

O `useAuthStore` gerencia:

- Estado do usuário logado
- Tokens de acesso e refresh
- Métodos de login/logout
- Persistência no localStorage

```typescript
import { useAuthStore } from '@/lib/stores/auth-store'

const { user, isAuthenticated, login, logout } = useAuthStore()
```

## Tratamento de Erros

Todos os hooks incluem tratamento automático de erros com toasts usando Sonner:

- Sucesso: Toast verde
- Erro: Toast vermelho com mensagem da API

## Interceptors

### Request Interceptor

Adiciona automaticamente o token de autenticação nas requisições

### Response Interceptor

Trata erros 401 (não autorizado) automaticamente, removendo tokens expirados
