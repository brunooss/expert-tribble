# Seja bem-vindo ao Chat Expert Tribble

O melhor chat...

## O que usamos no Firebase?

- Autenticação
- Realtime database
- Functions
- Hospedagem

## O deploy

Enviar react para hospedagem:

```bash
cd react-project/
npm run build
cd ../
firebase deploy --only hosting

```

Publicar functions no servidor:

```bash
firebase deploy --only functions
```

Alterar regras do banco de dados:

```bash
firebase deploy --only database
```

Fazer deploy de tudo:

```bash
firebase deploy
```
