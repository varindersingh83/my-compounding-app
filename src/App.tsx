import { useMemo, useState } from 'react';

import { CalculatorForm } from './components/CalculatorForm';
import { GrowthChart } from './components/GrowthChart';
import { ResultsSummary } from './components/ResultsSummary';
import { ResultsTable } from './components/ResultsTable';
import { Tabs } from './components/ui/Tabs';
import {
	defaultCalculatorInputs,
	parseCalculatorInput,
	type CalculatorInputs
} from './lib/input';
import { calculateCompoundGrowth } from './lib/finance';

type ViewMode = 'chart' | 'table';

export default function App() {
	const [inputs, setInputs] = useState<CalculatorInputs>(defaultCalculatorInputs);
	const [viewMode, setViewMode] = useState<ViewMode>('chart');

	const results = useMemo(() => calculateCompoundGrowth(inputs), [inputs]);

	const validYears = parseCalculatorInput(inputs.years, 'integer');
	const hasMeaningfulData =
		results.series.length > 0 ||
		parseCalculatorInput(inputs.initialDeposit, 'currency') > 0 ||
		parseCalculatorInput(inputs.annualContribution, 'currency') > 0 ||
		parseCalculatorInput(inputs.returnRate, 'rate') > 0 ||
		parseCalculatorInput(inputs.inflationRate, 'rate') > 0 ||
		validYears > 0;

	return (
		<div className="min-h-screen bg-linen bg-mesh text-ink">
			<div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
				<header className="mb-8 overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 px-6 py-8 shadow-panel backdrop-blur md:px-8 md:py-10">
					<div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
						<div className="space-y-4">
							<p className="inline-flex rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-sm font-medium text-slate">
								Investment growth calculator
							</p>
							<h1 className="max-w-3xl font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
								See what your money could grow into, and what it may still be worth in today&apos;s dollars.
							</h1>
							<p className="max-w-2xl text-base leading-7 text-slate sm:text-lg">
								Compound It projects annual growth from your starting balance, yearly
								contributions, expected return, and inflation. Adjust the inputs and the
								results update instantly.
							</p>
						</div>
						<div className="grid gap-4 rounded-[1.75rem] bg-ink px-5 py-5 text-white shadow-soft sm:grid-cols-3 lg:grid-cols-1">
							<div>
								<p className="text-sm uppercase tracking-[0.18em] text-white/65">Compounding</p>
								<p className="mt-2 text-lg font-semibold">Annual contribution, annual returns</p>
							</div>
							<div>
								<p className="text-sm uppercase tracking-[0.18em] text-white/65">Inflation</p>
								<p className="mt-2 text-lg font-semibold">Present value shown in today&apos;s dollars</p>
							</div>
							<div>
								<p className="text-sm uppercase tracking-[0.18em] text-white/65">View</p>
								<p className="mt-2 text-lg font-semibold">Chart and year-by-year table</p>
							</div>
						</div>
					</div>
				</header>

				<main className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
					<section aria-labelledby="calculator-heading">
						<div className="rounded-[1.75rem] border border-white/70 bg-white/90 p-5 shadow-panel backdrop-blur md:p-6">
							<div className="mb-6">
								<h2 id="calculator-heading" className="font-display text-2xl font-semibold">
									Calculator inputs
								</h2>
								<p className="mt-2 text-sm leading-6 text-slate">
									Enter annual values. Blank fields default to zero, and present value uses
									your inflation assumption to discount the ending balance.
								</p>
							</div>
							<CalculatorForm inputs={inputs} onChange={setInputs} />
						</div>
					</section>

					<section className="space-y-6" aria-labelledby="results-heading">
						<ResultsSummary results={results} hasMeaningfulData={hasMeaningfulData} />

						<div className="rounded-[1.75rem] border border-white/70 bg-white/90 p-5 shadow-panel backdrop-blur md:p-6">
							<div className="mb-5 flex flex-col gap-4 border-b border-ink/10 pb-4 md:flex-row md:items-end md:justify-between">
								<div>
									<h2 id="results-heading" className="font-display text-2xl font-semibold">
										Growth over time
									</h2>
									<p className="mt-2 text-sm leading-6 text-slate">
										Track your total balance versus contributed principal year by year.
									</p>
								</div>
								<Tabs
									value={viewMode}
									onValueChange={(value) => setViewMode(value as ViewMode)}
									options={[
										{ value: 'chart', label: 'Chart' },
										{ value: 'table', label: 'Table' }
									]}
								/>
							</div>

							{viewMode === 'chart' ? (
								<GrowthChart series={results.series} hasMeaningfulData={hasMeaningfulData} />
							) : (
								<ResultsTable series={results.series} hasMeaningfulData={hasMeaningfulData} />
							)}
						</div>

						<div className="rounded-[1.75rem] border border-ink/10 bg-ink px-5 py-5 text-white shadow-soft md:px-6">
							<h3 className="font-display text-xl font-semibold">Assumptions</h3>
							<p className="mt-3 text-sm leading-7 text-white/78">
								This version uses annual contributions, optional annual withdrawals, and
								annual compounding. Withdrawals are applied at the start of the withdrawal
								year before that year&apos;s growth. Present value is calculated with the
								standard inflation discounting formula:
								<span className="mx-1 rounded bg-white/10 px-2 py-1 font-medium">
									PV = FV / (1 + inflation rate)
									<sup>years</sup>
								</span>
								which estimates the ending balance in today&apos;s purchasing power.
							</p>
						</div>
					</section>
				</main>
			</div>
		</div>
	);
}
