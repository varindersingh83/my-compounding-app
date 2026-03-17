import type { ChangeEvent } from 'react';

import type { CalculatorInputs } from '../lib/input';
import { formatDisplayValue, sanitizeNumericInput } from '../lib/input';
import { InputField } from './ui/InputField';

interface CalculatorFormProps {
	inputs: CalculatorInputs;
	onChange: (next: CalculatorInputs) => void;
}

export function CalculatorForm({ inputs, onChange }: CalculatorFormProps) {
	const updateField =
		(field: keyof CalculatorInputs, kind: 'currency' | 'rate' | 'integer') =>
		(event: ChangeEvent<HTMLInputElement>) => {
			const nextValue = sanitizeNumericInput(event.target.value, kind);
			onChange({
				...inputs,
				[field]: nextValue
			});
		};

	return (
		<form className="space-y-4" aria-label="Investment calculator">
			<InputField
				id="initial-deposit"
				label="Initial deposit"
				description="Your starting balance before any future contributions."
				value={inputs.initialDeposit}
				onChange={updateField('initialDeposit', 'currency')}
				inputMode="decimal"
				placeholder="$25,000"
			/>
			<InputField
				id="annual-contribution"
				label="Contribution amount"
				description="How much you add each year."
				value={inputs.annualContribution}
				onChange={updateField('annualContribution', 'currency')}
				inputMode="decimal"
				placeholder="$10,000"
			/>
			<InputField
				id="annual-withdrawal"
				label="Annual withdrawal"
				description="How much you plan to withdraw each year once withdrawals begin."
				value={inputs.annualWithdrawal}
				onChange={updateField('annualWithdrawal', 'currency')}
				inputMode="decimal"
				placeholder="$100,000"
			/>
			<InputField
				id="withdrawal-start-year"
				label="Withdrawal start year"
				description="The first year when the annual withdrawal is taken before growth is applied."
				value={inputs.withdrawalStartYear}
				onChange={updateField('withdrawalStartYear', 'integer')}
				inputMode="numeric"
				placeholder="30"
			/>
			<InputField
				id="inflation-rate"
				label="Inflation rate"
				description="Used to convert the ending balance into today&apos;s dollars."
				value={inputs.inflationRate}
				onChange={updateField('inflationRate', 'rate')}
				inputMode="decimal"
				placeholder="3.0"
				suffix="%"
			/>
			<InputField
				id="years"
				label="Years of growth"
				description="Whole years only in this version."
				value={inputs.years}
				onChange={updateField('years', 'integer')}
				inputMode="numeric"
				placeholder="20"
			/>
			<InputField
				id="return-rate"
				label="Estimated rate of return"
				description="Expected annual return before inflation."
				value={inputs.returnRate}
				onChange={updateField('returnRate', 'rate')}
				inputMode="decimal"
				placeholder="8.0"
				suffix="%"
			/>

			<div className="rounded-2xl border border-ink/10 bg-linen/70 p-4">
				<p className="text-xs uppercase tracking-[0.18em] text-slate">Quick example</p>
				<p className="mt-2 text-sm leading-6 text-ink/80">
					{formatDisplayValue('5000', 'currency')} initial deposit,
					{` ${formatDisplayValue('1200', 'currency')} `}
					annual contribution, {formatDisplayValue('0', 'currency')} withdrawal, 10
					years, 8% return, 3% inflation.
				</p>
				<div className="mt-4 rounded-2xl border border-ink/10 bg-white/75 px-4 py-3">
					<p className="text-xs uppercase tracking-[0.18em] text-slate">
						Rate of Return Since Inception
					</p>
					<p className="mt-2 text-sm font-medium leading-6 text-ink">
						S&amp;P 500: 9.97% | Nasdaq: 17.91% | TQQQ: 41.04%
					</p>
					<p className="mt-2 text-xs leading-5 text-slate">
						With TQQQ&apos;s annualized return since inception on February 9, 2010,
						ProShares reports 41.04% annualized at NAV as of February 28, 2026.
					</p>
				</div>
			</div>
		</form>
	);
}
