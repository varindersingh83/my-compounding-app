import { useEffect, useMemo, useRef, useState } from 'react';

import { CalculatorForm } from './components/CalculatorForm';
import { GrowthChart } from './components/GrowthChart';
import { ResultsSummary } from './components/ResultsSummary';
import { ResultsTable } from './components/ResultsTable';
import { WithdrawalForm } from './components/WithdrawalForm';
import { Tabs } from './components/ui/Tabs';
import { formatCurrencyCompact } from './lib/format';
import { calculateCompoundGrowth, calculateWithdrawalImpact } from './lib/finance';
import {
	defaultCalculatorInputs,
	parseCalculatorInput,
	type CalculatorInputs
} from './lib/input';

type ViewMode = 'graph' | 'data';
type DrawerMode = 'base' | 'withdrawal' | null;

export default function App() {
	const [inputs, setInputs] = useState<CalculatorInputs>(defaultCalculatorInputs);
	const [viewMode, setViewMode] = useState<ViewMode>('graph');
	const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);
	const baseButtonRef = useRef<HTMLButtonElement>(null);
	const withdrawalButtonRef = useRef<HTMLButtonElement>(null);

	const baselineInputs = useMemo(
		() => ({ ...inputs, annualWithdrawal: '', withdrawalStartYear: '' }),
		[inputs]
	);
	const results = useMemo(() => calculateCompoundGrowth(baselineInputs), [baselineInputs]);
	const withdrawalImpact = useMemo(() => calculateWithdrawalImpact(inputs), [inputs]);
	const hasWithdrawalScenario =
		parseCalculatorInput(inputs.annualWithdrawal, 'currency') > 0 &&
		parseCalculatorInput(inputs.withdrawalStartYear, 'integer') > 0;
	const withdrawalResults = useMemo(
		() => (hasWithdrawalScenario ? calculateCompoundGrowth(inputs) : null),
		[hasWithdrawalScenario, inputs]
	);

	const validYears = parseCalculatorInput(inputs.years, 'integer');
	const hasMeaningfulData =
		results.series.length > 0 ||
		parseCalculatorInput(inputs.initialDeposit, 'currency') > 0 ||
		parseCalculatorInput(inputs.annualContribution, 'currency') > 0 ||
		parseCalculatorInput(inputs.returnRate, 'rate') > 0 ||
		parseCalculatorInput(inputs.inflationRate, 'rate') > 0 ||
		validYears > 0;
	const canAddWithdrawal = results.series.length > 0 && results.total > 0;

	useEffect(() => {
		if (!drawerMode) return;

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				const activeButton =
					drawerMode === 'withdrawal' ? withdrawalButtonRef.current : baseButtonRef.current;
				setDrawerMode(null);
				activeButton?.focus();
			}
		};

		window.addEventListener('keydown', closeOnEscape);
		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener('keydown', closeOnEscape);
		};
	}, [drawerMode]);

	const closeDrawer = () => {
		const activeButton =
			drawerMode === 'withdrawal' ? withdrawalButtonRef.current : baseButtonRef.current;
		setDrawerMode(null);
		activeButton?.focus();
	};

	const clearWithdrawal = () => {
		setInputs((current) => ({
			...current,
			annualWithdrawal: '',
			withdrawalStartYear: ''
		}));
	};

	return (
		<div className="min-h-[100dvh] bg-linen bg-mesh text-ink">
			<header className="sticky top-0 z-20 border-b border-ink/10 bg-linen/90 backdrop-blur-xl">
				<div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
					<div className="min-w-0">
						<h1 className="truncate font-display text-xl font-bold tracking-tight sm:text-2xl">
							Compound It
						</h1>
						<p className="truncate text-xs text-slate sm:text-sm">Investment growth calculator</p>
					</div>
					<button
						ref={baseButtonRef}
						type="button"
						aria-haspopup="dialog"
						aria-expanded={drawerMode === 'base'}
						aria-controls="data-entry-panel"
						onClick={() => setDrawerMode('base')}
						className="shrink-0 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-sky focus:outline-none focus:ring-4 focus:ring-sky/20 active:scale-[0.98]"
					>
						Edit inputs
					</button>
				</div>
			</header>

			<main className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
				<ResultsSummary results={results} hasMeaningfulData={hasMeaningfulData} />

				{canAddWithdrawal ? (
					<div className="flex items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 shadow-soft">
						<div className="min-w-0">
							<p className="text-sm font-semibold text-ink">
								{withdrawalResults ? 'Withdrawal scenario added' : 'See how withdrawals change growth'}
							</p>
							<p className="truncate text-xs text-slate">
								{withdrawalResults
									? `After withdrawals: ${formatCurrencyCompact(withdrawalResults.total)}`
									: 'Compare your base projection with an annual withdrawal plan.'}
							</p>
						</div>
						<button
							ref={withdrawalButtonRef}
							type="button"
							aria-haspopup="dialog"
							aria-expanded={drawerMode === 'withdrawal'}
							aria-controls="withdrawal-entry-panel"
							onClick={() => setDrawerMode('withdrawal')}
							className="shrink-0 rounded-xl bg-sky px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-ink focus:outline-none focus:ring-4 focus:ring-sky/20 active:scale-[0.98]"
						>
							{withdrawalResults ? 'Edit withdrawal' : 'Add withdrawal'}
						</button>
					</div>
				) : null}

				<section
					className="overflow-hidden rounded-2xl border border-white/80 bg-white/90 shadow-panel backdrop-blur"
					aria-labelledby="results-heading"
				>
					<div className="flex items-center justify-between gap-3 border-b border-ink/10 px-4 py-3 sm:px-5">
						<div className="min-w-0">
							<h2 id="results-heading" className="truncate font-display text-lg font-semibold sm:text-xl">
								Growth over time
							</h2>
							<p className="hidden text-sm text-slate sm:block">
								{withdrawalResults
									? 'Base balance, contributed principal, and balance after withdrawals.'
									: 'Balance compared with contributed principal.'}
							</p>
						</div>
						<Tabs
							value={viewMode}
							onValueChange={(value) => setViewMode(value as ViewMode)}
							options={[
								{ value: 'graph', label: 'Graph' },
								{ value: 'data', label: 'Data' }
							]}
						/>
					</div>

					<div className="p-3 sm:p-5">
						{viewMode === 'graph' ? (
							<GrowthChart
								series={results.series}
								withdrawalSeries={withdrawalResults?.series}
								hasMeaningfulData={hasMeaningfulData}
							/>
						) : (
							<ResultsTable
								series={results.series}
								withdrawalSeries={withdrawalResults?.series}
								hasMeaningfulData={hasMeaningfulData}
							/>
						)}
					</div>
				</section>
			</main>

			<div
				className={`fixed inset-0 z-40 bg-ink/45 transition-opacity duration-200 ${
					drawerMode ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
				}`}
				aria-hidden="true"
				onClick={closeDrawer}
			/>

			<aside
				id="data-entry-panel"
				role="dialog"
				aria-modal="true"
				aria-labelledby="data-entry-heading"
				aria-hidden={drawerMode !== 'base'}
				className={`fixed inset-y-0 left-0 z-50 flex w-[min(92vw,25rem)] flex-col bg-white shadow-[20px_0_60px_rgba(16,42,67,0.22)] transition-transform duration-200 ease-out ${
					drawerMode === 'base' ? 'translate-x-0' : '-translate-x-full'
				}`}
			>
				<div className="flex items-center justify-between border-b border-ink/10 px-4 py-4">
					<div>
						<h2 id="data-entry-heading" className="font-display text-xl font-semibold">
							Data entry
						</h2>
						<p className="text-xs text-slate">Results update as you type.</p>
					</div>
					<button
						type="button"
						onClick={closeDrawer}
						className="rounded-xl border border-ink/15 px-3 py-2 text-sm font-semibold text-ink transition hover:bg-linen focus:outline-none focus:ring-4 focus:ring-sky/15 active:scale-[0.98]"
					>
						Done
					</button>
				</div>

				<div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
					<CalculatorForm inputs={inputs} onChange={setInputs} />
				</div>
			</aside>

			<aside
				id="withdrawal-entry-panel"
				role="dialog"
				aria-modal="true"
				aria-labelledby="withdrawal-entry-heading"
				aria-hidden={drawerMode !== 'withdrawal'}
				className={`fixed inset-y-0 right-0 z-50 flex w-[min(92vw,25rem)] flex-col bg-white shadow-[-20px_0_60px_rgba(16,42,67,0.22)] transition-transform duration-200 ease-out ${
					drawerMode === 'withdrawal' ? 'translate-x-0' : 'translate-x-full'
				}`}
			>
				<div className="flex items-center justify-between border-b border-ink/10 px-4 py-4">
					<div>
						<h2 id="withdrawal-entry-heading" className="font-display text-xl font-semibold">
							Withdrawal plan
						</h2>
						<p className="text-xs text-slate">Compare against your base projection.</p>
					</div>
					<button
						type="button"
						onClick={closeDrawer}
						className="rounded-xl border border-ink/15 px-3 py-2 text-sm font-semibold text-ink transition hover:bg-linen focus:outline-none focus:ring-4 focus:ring-sky/15 active:scale-[0.98]"
					>
						Done
					</button>
				</div>

				<div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
					<WithdrawalForm
						inputs={inputs}
						onChange={setInputs}
						onClear={clearWithdrawal}
						withdrawalImpact={withdrawalImpact}
					/>
				</div>
			</aside>
		</div>
	);
}
