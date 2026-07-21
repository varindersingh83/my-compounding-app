import type { ChangeEvent } from 'react';

import type { CalculatorInputs } from '../lib/input';
import { sanitizeNumericInput } from '../lib/input';
import { InputField } from './ui/InputField';

const returnPresets = [
	{
		label: 'S&P 500',
		value: '10',
		displayValue: '10.0%',
		period: 'Since 1957'
	},
	{
		label: 'Nasdaq-100',
		value: '14.60',
		displayValue: '14.60%',
		period: 'Since Feb 1985'
	},
	{
		label: 'TQQQ',
		value: '44.36',
		displayValue: '44.36%',
		period: 'Since Feb 2010'
	}
] as const;

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

	const applyReturnPreset = (value: string) => {
		onChange({
			...inputs,
			returnRate: value
		});
	};

	return (
		<form className="space-y-1" aria-label="Investment calculator">
			<InputField
				id="initial-deposit"
				label="Initial deposit"
				description="Your starting balance before any future contributions."
				value={inputs.initialDeposit}
				onChange={updateField('initialDeposit', 'currency')}
				formatKind="currency"
				inputMode="decimal"
				placeholder="$25,000"
			/>
			<InputField
				id="annual-contribution"
				label="Contribution amount"
				description="How much you add each year."
				value={inputs.annualContribution}
				onChange={updateField('annualContribution', 'currency')}
				formatKind="currency"
				inputMode="decimal"
				placeholder="$10,000"
			/>
			<InputField
				id="inflation-rate"
				label="Inflation rate"
				description="Used to convert the ending balance into today&apos;s dollars."
				value={inputs.inflationRate}
				onChange={updateField('inflationRate', 'rate')}
				formatKind="rate"
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
				formatKind="integer"
				inputMode="numeric"
				placeholder="20"
			/>
			<InputField
				id="return-rate"
				label="Estimated rate of return"
				description="Expected annual return before inflation."
				value={inputs.returnRate}
				onChange={updateField('returnRate', 'rate')}
				formatKind="rate"
				inputMode="decimal"
				placeholder="8.0"
				suffix="%"
			/>

			<fieldset className="pt-3">
				<legend className="px-1 text-xs font-semibold text-ink">Historical total return presets</legend>
				<div className="mt-2 grid grid-cols-3 gap-2">
					{returnPresets.map((preset) => {
						const isSelected = Number(inputs.returnRate) === Number(preset.value);

						return (
							<button
								key={preset.label}
								type="button"
								aria-pressed={isSelected}
								aria-label={`Use ${preset.label} historical return of ${preset.displayValue}`}
								onClick={() => applyReturnPreset(preset.value)}
								className={`min-w-0 rounded-xl border px-2 py-2.5 text-center transition focus:outline-none focus:ring-4 focus:ring-sky/15 active:scale-[0.98] ${
									isSelected
										? 'border-ink bg-ink text-white shadow-soft'
										: 'border-ink/15 bg-linen/70 text-ink hover:border-sky hover:bg-white'
								}`}
							>
								<span className="block truncate text-[11px] font-semibold">{preset.label}</span>
								<span className="mt-0.5 block text-sm font-bold">{preset.displayValue}</span>
								<span className={`mt-1 block truncate text-[9px] ${isSelected ? 'text-white/70' : 'text-slate'}`}>
									{preset.period}
								</span>
							</button>
						);
					})}
				</div>
				<p className="px-1 pt-2 text-[10px] leading-4 text-slate">
					Returns include reinvested distributions. TQQQ targets 3× the Nasdaq-100&apos;s daily return,
					so its long-term result can differ sharply from 3× the index.
				</p>
			</fieldset>

			<p className="px-1 pt-3 text-xs leading-5 text-slate">
				Annual contributions are added before growth. Add a withdrawal scenario after building the base projection.
			</p>
		</form>
	);
}
