import { type ChangeEvent, type HTMLAttributes } from 'react';

import { cn } from '../../lib/cn';
import { formatDisplayValue, type NumericInputKind } from '../../lib/input';

interface InputFieldProps {
	id: string;
	label: string;
	description: string;
	value: string;
	onChange: (event: ChangeEvent<HTMLInputElement>) => void;
	formatKind?: NumericInputKind;
	inputMode: HTMLAttributes<HTMLInputElement>['inputMode'];
	placeholder: string;
	suffix?: string;
}

export function InputField({
	id,
	label,
	description,
	value,
	onChange,
	formatKind,
	inputMode,
	placeholder,
	suffix
}: InputFieldProps) {
	const displayValue = formatKind ? formatDisplayValue(value, formatKind) : value;

	return (
		<div className="grid min-h-14 grid-cols-[minmax(0,1fr)_minmax(8rem,46%)] items-center gap-3 border-b border-ink/10 py-2 last:border-b-0">
			<label htmlFor={id} className="min-w-0 whitespace-nowrap text-[13px] font-semibold text-ink">
				{label}
				<span className="sr-only">. {description}</span>
			</label>
			<div className="relative min-w-0">
				<input
					id={id}
					value={displayValue}
					onChange={onChange}
					inputMode={inputMode}
					placeholder={placeholder}
					className={cn(
						'w-full rounded-xl border border-ink/15 bg-linen/70 px-3 py-2.5 pr-9 text-right text-base font-semibold text-ink outline-none transition',
						'placeholder:text-slate/60 focus:border-sky focus:bg-white focus:ring-4 focus:ring-sky/10'
					)}
				/>
				{suffix ? (
					<span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm font-medium text-slate">
						{suffix}
					</span>
				) : null}
			</div>
		</div>
	);
}
