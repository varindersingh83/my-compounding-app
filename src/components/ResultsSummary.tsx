import type { CalculationResult } from '../lib/finance';
import { formatCurrency, formatCurrencyCompact } from '../lib/format';

interface ResultsSummaryProps {
	results: CalculationResult;
	hasMeaningfulData: boolean;
}

export function ResultsSummary({ results, hasMeaningfulData }: ResultsSummaryProps) {
	const items = [
		{
			label: 'Contributed',
			value: formatCurrencyCompact(results.contributionAmount),
			exactValue: formatCurrency(results.contributionAmount),
			accent: 'text-sky'
		},
		{
			label: 'Total',
			value: formatCurrencyCompact(results.total),
			exactValue: formatCurrency(results.total),
			accent: 'text-emerald'
		},
		{
			label: 'Present value',
			value: formatCurrencyCompact(results.presentValue),
			exactValue: formatCurrency(results.presentValue),
			accent: 'text-gold'
		}
	];

	return (
		<div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-white/80 bg-white/90 shadow-panel backdrop-blur">
			{items.map((item) => (
				<div
					key={item.label}
					className="min-w-0 border-r border-ink/10 px-3 py-3 last:border-r-0 sm:px-5 sm:py-4"
				>
					<p className="truncate text-[10px] font-semibold uppercase tracking-[0.08em] text-slate sm:text-xs">
						{item.label}
					</p>
					<p
						className={`mt-1 truncate font-display text-lg font-semibold leading-tight sm:mt-2 sm:text-2xl ${item.accent}`}
						title={hasMeaningfulData ? item.exactValue : '$0'}
					>
						{hasMeaningfulData ? item.value : '$0'}
					</p>
					<p className="mt-0.5 hidden truncate text-xs text-slate/75 sm:block">
						{hasMeaningfulData ? item.exactValue : 'Exact: $0'}
					</p>
				</div>
			))}
		</div>
	);
}
