import type { CalculationResult } from '../lib/finance';
import { formatCurrency, formatCurrencyCompact } from '../lib/format';

interface ResultsSummaryProps {
	results: CalculationResult;
	hasMeaningfulData: boolean;
}

export function ResultsSummary({ results, hasMeaningfulData }: ResultsSummaryProps) {
	const items = [
		{
			label: 'Contribution amount',
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
		<div className="grid gap-4 md:grid-cols-3">
			{items.map((item) => (
				<div
					key={item.label}
					className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/90 p-5 shadow-panel backdrop-blur md:p-6"
				>
					<p className="text-sm uppercase tracking-[0.18em] text-slate">{item.label}</p>
					<p
						className={`mt-4 break-words font-display text-[clamp(1.9rem,4vw,2.6rem)] font-semibold leading-none ${item.accent}`}
						title={hasMeaningfulData ? item.exactValue : '$0'}
					>
						{hasMeaningfulData ? item.value : '$0'}
					</p>
					<p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-slate/75">
						{hasMeaningfulData ? item.exactValue : 'Exact: $0'}
					</p>
					<p className="mt-3 text-sm leading-6 text-slate">
						{item.label === 'Present value'
							? 'Inflation-adjusted estimate of your ending balance.'
							: item.label === 'Total'
								? 'Projected ending balance after contributions and growth.'
								: 'Total capital added from your initial investment and annual contributions.'}
					</p>
				</div>
			))}
		</div>
	);
}
