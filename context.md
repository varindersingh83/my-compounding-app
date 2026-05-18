# Compound It - Project Context

## Overview
**Compound It** is a web-based compound interest calculator that helps users visualize how their investments grow over time with compound interest and regular contributions. The application provides both graphical and tabular views of investment growth projections.

## Tech Stack

### Core Framework
- **SvelteKit** (v2.0.0) - Full-stack web framework
- **TypeScript** - Type-safe development
- **Vite** - Build tool and development server

### UI & Styling
- **Tailwind CSS** (v3.4.3) - Utility-first CSS framework
- **Skeleton UI** (v2.10.0) - Component library for Svelte
- **Chart.js** (v4.4.3) - Charting library for data visualization
- **highlight.js** (v11.9.0) - Syntax highlighting

### Development Tools
- **Vitest** - Unit testing framework
- **Playwright** - End-to-end testing
- **ESLint** + **Prettier** - Code quality and formatting
- **svelte-check** - Type checking for Svelte

### Deployment & Analytics
- **@sveltejs/adapter-auto** - Automatic adapter selection
- **@vercel/analytics** - Analytics tracking
- **@vercel/speed-insights** - Performance monitoring

## Project Structure

```
src/
├── routes/
│   ├── +layout.svelte       # App layout with Skeleton UI shell
│   └── +page.svelte         # Main calculator interface
├── lib/
│   ├── Chart.svelte         # Chart.js wrapper component
│   ├── compounding.ts       # Core compound interest calculation logic
│   ├── compounding.test.ts  # Unit tests for compounding logic
│   └── index.ts             # Library exports
├── app.html                 # HTML template
├── app.postcss              # Global styles
└── app.d.ts                 # TypeScript definitions
```

## Key Features

### Compound Interest Calculator
The application calculates compound interest with the following inputs:
- **Initial Deposit**: Starting investment amount
- **Annual Contribution**: Regular yearly contribution amount
- **Years of Growth**: Investment timeframe
- **Rate of Return**: Expected annual return percentage

### Calculation Logic
The compound interest is calculated yearly using the formula:
1. Add annual contribution to the total
2. Apply rate of return percentage to the total
3. Track both total balance and principal (contributed amount) over time

Located in `src/lib/compounding.ts`:
```typescript
calculateCompoundInterest(
  initialDeposit: number,
  annualContribution: number,
  yearsOfGrowth: number,
  rateOfReturn: number
): YearlyContribution[]
```

### Visualization
- **Graph View**: Line chart showing:
  - Total Balance over time (white line)
  - Principal Value over time (red line)
- **Table View**: Year-by-year breakdown showing:
  - Year number
  - Total contributions made
  - Total balance (including interest)

### User Interface
- Responsive design (mobile and desktop)
- Currency formatting for dollar amounts
- Input validation and formatting
- Toggle between graph and table views
- Reference link to S&P 500 and Nasdaq historical returns

## Testing

### Unit Tests (`src/lib/compounding.test.ts`)
Tests cover:
- Calculations with and without initial deposits
- Edge cases (zero years, zero rate, negative rate)
- Zero annual contribution scenarios

Run with: `npm run test:unit`

### Integration Tests
Playwright tests for end-to-end functionality.

Run with: `npm run test:integration`

Run all tests: `npm test`

## Development

### Getting Started
1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Build for production: `npm run build`
4. Preview production build: `npm run preview`

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run all tests
- `npm run test:unit` - Run unit tests only
- `npm run test:integration` - Run integration tests only
- `npm run check` - Type check with svelte-check
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

## Configuration Files

- `svelte.config.js` - SvelteKit configuration
- `vite.config.ts` - Vite build configuration
- `tailwind.config.ts` - Tailwind CSS customization
- `tsconfig.json` - TypeScript configuration
- `playwright.config.ts` - Playwright test configuration
- `postcss.config.cjs` - PostCSS configuration

## External References
The app includes a link to historical S&P 500 and Nasdaq returns since 1986:
- S&P 500: 9.97% average return
- Nasdaq: 17.91% average return

## Notes
- The project uses `@sveltejs/adapter-auto` which automatically selects the appropriate adapter for deployment platforms
- Analytics and speed insights from Vercel are integrated
- The app uses Skeleton UI components with a dark theme for code highlighting
- Currency formatting uses USD locale (`en-US`)

