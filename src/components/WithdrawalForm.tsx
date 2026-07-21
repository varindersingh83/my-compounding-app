import type { ChangeEvent } from 'react';

import type { WithdrawalImpact } from '../lib/finance';
import { formatCurrencyCompact } from '../lib/format';
import type { CalculatorInputs } from '../lib/input';
import { sanitizeNumericInput } from '../lib/input';
import { InputField } from './ui/InputField';

interface WithdrawalFormProps {
	inputs: CalculatorInputs;
	onChange: (next: CalculatorInputs) => void;
	onClear: () => void;
	withdrawalImpact: WithdrawalImpact | null;
}

export function WithdrawalForm({
	inputs,
	onChange,
	onClear,
	withdrawalImpact
}: WithdrawalFormProps) {
	const updateField =
		(field: 'annualWithdrawal' | 'withdrawalStartYear', kind: 'currency' | 'integer') =>
		(event: ChangeEvent<HTMLInputElement>) => {
			onChange({
				...inputs,
				[field]: sanitizeNumericInput(event.target.value, kind)
			});
		};

	const applySuggestedYear = (year: number) => {
		onChange({
			...inputs,
			withdrawalStartYear: String(year)
		});
	};

	const hasPlan = Boolean(inputs.annualWithdrawal || inputs.withdrawalStartYear);

	return (
		<form className="space-y-1" aria-label="Withdrawal scenario">
			<InputField
				id="annual-withdrawal"
				label="Annual withdrawal"
				description="How much you plan to withdraw each year once withdrawals begin."
				value={inputs.annualWithdrawal}
				onChange={updateField('annualWithdrawal', 'currency')}
				formatKind="currency"
				inputMode="decimal"
				placeholder="$10,000"
			/>
			<InputField
				id="withdrawal-start-year"
				label="Start in year"
				description="The first year when the annual withdrawal is taken before growth is applied."
				value={inputs.withdrawalStartYear}
				onChange={updateField('withdrawalStartYear', 'integer')}
				formatKind="integer"
				inputMode="numeric"
				placeholder="5"
			/>

			<section
				className="mt-4 rounded-xl border border-ink/10 bg-linen/70 p-3"
				aria-labelledby="withdrawal-impact-heading"
				aria-live="polite"
			>
				<div className="flex items-start justify-between gap-3">
					<div>
						<h3 id="withdrawal-impact-heading" className="text-sm font-semibold text-ink">
							Low-impact timing
						</h3>
						<p className="mt-1 text-xs leading-5 text-slate">
							Finds the earliest start that keeps the ending balance within 5% of the base projection.
						</p>
					</div>
					{withdrawalImpact && inputs.withdrawalStartYear ? (
						<span
							className={`shrink-0 rounded-lg px-2 py-1 text-[10px] font-semibold ${
								withdrawalImpact.plannedReductionPercent <= withdrawalImpact.thresholdPercent
									? 'bg-emerald/10 text-emerald'
									: 'bg-rose/10 text-rose'
							}`}
						>
							{withdrawalImpact.plannedReductionPercent <= withdrawalImpact.thresholdPercent
								? 'Within 5%'
								: 'Above 5%'}
						</span>
					) : null}
				</div>

				{withdrawalImpact ? (
					<div className="mt-3 space-y-2">
						{inputs.withdrawalStartYear ? (
							<p className="text-xs leading-5 text-ink">
								Starting in year {inputs.withdrawalStartYear} changes the ending balance by{' '}
								<strong>{formatCurrencyCompact(withdrawalImpact.plannedReduction)}</strong> (
								{withdrawalImpact.plannedReductionPercent.toFixed(1)}%).
							</p>
						) : null}

						{withdrawalImpact.suggestedStartYear ? (
							<div className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2.5">
								<div className="min-w-0">
									<p className="text-[10px] text-slate">Earliest suggested start</p>
									<p className="font-display text-lg font-semibold text-ink">
										Year {withdrawalImpact.suggestedStartYear}
									</p>
									<p className="truncate text-[10px] text-slate">
										Base ending balance {formatCurrencyCompact(withdrawalImpact.baselineTotal)}
									</p>
								</div>
								<button
									type="button"
									onClick={() => applySuggestedYear(withdrawalImpact.suggestedStartYear!)}
									className="shrink-0 rounded-lg bg-ink px-3 py-2 text-xs font-semibold text-white transition focus:outline-none focus:ring-4 focus:ring-sky/15 active:scale-[0.98]"
								>
									Use year {withdrawalImpact.suggestedStartYear}
								</button>
							</div>
						) : (
							<p className="text-xs leading-5 text-rose">
								Even a final-year withdrawal lowers the ending balance by more than 5%.
							</p>
						)}
					</div>
				) : (
					<p className="mt-3 text-xs leading-5 text-slate">
						Enter an annual withdrawal to calculate a suggested start year.
					</p>
				)}
			</section>

			<p className="px-1 pt-3 text-xs leading-5 text-slate">
				The comparison line appears after both fields are entered. Withdrawals are applied before annual growth.
			</p>

			{hasPlan ? (
				<button
					type="button"
					onClick={onClear}
					className="mt-3 w-full rounded-xl border border-rose/25 px-4 py-2.5 text-sm font-semibold text-rose transition hover:bg-rose/5 focus:outline-none focus:ring-4 focus:ring-rose/10 active:scale-[0.98]"
				>
					Remove withdrawal plan
				</button>
			) : null}
		</form>
	);
}
