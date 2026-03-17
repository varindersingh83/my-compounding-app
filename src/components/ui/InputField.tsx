import { type ChangeEvent, type HTMLAttributes } from 'react';

import { cn } from '../../lib/cn';

interface InputFieldProps {
	id: string;
	label: string;
	description: string;
	value: string;
	onChange: (event: ChangeEvent<HTMLInputElement>) => void;
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
	inputMode,
	placeholder,
	suffix
}: InputFieldProps) {
	return (
		<div className="space-y-2">
			<label htmlFor={id} className="block text-sm font-semibold text-ink">
				{label}
			</label>
			<div className="relative">
				<input
					id={id}
					value={value}
					onChange={onChange}
					inputMode={inputMode}
					placeholder={placeholder}
					className={cn(
						'w-full rounded-2xl border border-ink/10 bg-linen/70 px-4 py-3 pr-12 text-base text-ink shadow-sm outline-none transition',
						'placeholder:text-slate/60 focus:border-sky focus:bg-white focus:ring-4 focus:ring-sky/10'
					)}
				/>
				{suffix ? (
					<span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-medium text-slate">
						{suffix}
					</span>
				) : null}
			</div>
			<p className="text-sm leading-6 text-slate">{description}</p>
		</div>
	);
}
