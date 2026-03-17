# Compound It

Compound It is a modern React + Vite investment growth calculator that projects compound growth, total contributed principal, and inflation-adjusted present value.

## Stack

- React 19
- Vite
- TypeScript
- Tailwind CSS
- Recharts
- Zod
- Vitest + Testing Library
- Playwright

## Running Locally

```bash
npm install
npm run dev
```

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run check
npm run test:unit
npm run test:integration
npm test
```

## Product Notes

- Inputs are annual values
- Blank fields default to zero
- Present value is discounted from the ending balance using the inflation rate
- The chart compares total balance vs contributed principal
