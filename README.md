# FENINJER+ · App demo (orçamentos)

Web app mobile-first de demonstração para a feira virtual FENINJER+.
React + Vite + TypeScript, Tailwind CSS v4 e Radix UI. Sem backend: o estado fica no `localStorage` do navegador.

## Rodar

```bash
npm install
npm run dev       # http://localhost:5173 (também exposto na rede local para abrir no celular)
npm run build     # gera /dist estático (HashRouter + base './' → hospeda em qualquer pasta)
```

**Login pronto:** `demo@feninjer.com.br` / `feninjer84` (ou botão "Entrar com a conta demo").

## Onde editar

| O quê | Arquivo |
|---|---|
| Lojas e produtos (5 × 5) | `src/data/stores.ts` |
| Feira, agenda, espaços, hotéis | `src/data/fair.ts` |
| Cores e tipografia (tokens) | `src/styles.css` → bloco `@theme` |
| Estado (login, orçamento, envios) | `src/store.tsx` |
| Planta do mapa | `src/pages/MapPage.tsx` |

Todos os dados (lojas, produtos, preços, hotéis, palestrantes) são fictícios.
