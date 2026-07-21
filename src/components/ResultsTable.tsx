import type { YearlyResult } from '../lib/finance';
import { formatCurrency, formatCurrencyCompact } from '../lib/format';

interface ResultsTableProps {
	series: YearlyResult[];
	withdrawalSeries?: YearlyResult[];
	hasMeaningfulData: boolean;
}

export function ResultsTable({ series, withdrawalSeries, hasMeaningfulData }: ResultsTableProps) {
	if (!hasMeaningfulData) {
		return (
			<div className="flex h-[320px] items-center justify-center rounded-[1.5rem] border border-dashed border-ink/15 bg-linen/60 text-center">
				<div className="max-w-sm px-6">
					<p className="font-display text-2xl font-semibold text-ink">No yearly breakdown yet</p>
					<p className="mt-3 text-sm leading-6 text-slate">
						Enter some assumptions and switch back here to inspect the yearly values.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-xl border border-ink/10">
			<div className="h-[min(58dvh,34rem)] min-h-[22rem] overflow-auto">
				<table className="min-w-full border-collapse bg-white text-left">
					<thead className="sticky top-0 bg-ink text-white">
						<tr>
							<th className="px-4 py-3 text-sm font-medium">Year</th>
							<th className="px-4 py-3 text-sm font-medium">Principal</th>
							<th className="px-4 py-3 text-sm font-medium">Base balance</th>
							{withdrawalSeries ? (
								<>
									<th className="px-4 py-3 text-sm font-medium">Withdrawal</th>
									<th className="px-4 py-3 text-sm font-medium">After withdrawals</th>
								</>
							) : null}
							<th className="px-4 py-3 text-sm font-medium">
								{withdrawalSeries ? 'Adjusted present value' : 'Present value'}
							</th>
						</tr>
					</thead>
					<tbody>
						{series.map((row, index) => {
							const withdrawalRow = withdrawalSeries?.[index];
							const displayedPresentValue = withdrawalRow?.presentValue ?? row.presentValue;

							return (
							<tr key={row.year} className="border-t border-ink/10 even:bg-linen/40">
								<td className="px-4 py-3 text-sm text-ink">{row.year}</td>
								<td className="px-4 py-3 text-sm text-slate" title={formatCurrency(row.principal)}>
									<div className="min-w-[8rem]">
										<p className="font-medium text-ink">{formatCurrencyCompact(row.principal)}</p>
										<p className="text-xs text-slate/70">{formatCurrency(row.principal)}</p>
									</div>
								</td>
								<td className="px-4 py-3 text-sm font-medium text-ink" title={formatCurrency(row.balance)}>
									<div className="min-w-[8rem]">
										<p>{formatCurrencyCompact(row.balance)}</p>
										<p className="text-xs font-normal text-slate/70">{formatCurrency(row.balance)}</p>
									</div>
								</td>
								{withdrawalRow ? (
									<>
										<td
											className="px-4 py-3 text-sm text-slate"
											title={formatCurrency(withdrawalRow.withdrawal)}
										>
											<div className="min-w-[8rem]">
												<p className="font-medium text-ink">
													{formatCurrencyCompact(withdrawalRow.withdrawal)}
												</p>
												<p className="text-xs text-slate/70">
													{formatCurrency(withdrawalRow.withdrawal)}
												</p>
											</div>
										</td>
										<td
											className="px-4 py-3 text-sm font-medium text-sky"
											title={formatCurrency(withdrawalRow.balance)}
										>
											<div className="min-w-[8rem]">
												<p>{formatCurrencyCompact(withdrawalRow.balance)}</p>
												<p className="text-xs font-normal text-slate/70">
													{formatCurrency(withdrawalRow.balance)}
												</p>
											</div>
										</td>
									</>
								) : null}
								<td
									className="px-4 py-3 text-sm font-medium text-ink"
									title={formatCurrency(displayedPresentValue)}
								>
									<div className="min-w-[8rem]">
										<p>{formatCurrencyCompact(displayedPresentValue)}</p>
										<p className="text-xs font-normal text-slate/70">
											{formatCurrency(displayedPresentValue)}
										</p>
									</div>
								</td>
							</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}
