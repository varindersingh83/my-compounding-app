import { cn } from '../../lib/cn';

interface TabsProps {
	value: string;
	onValueChange: (value: string) => void;
	options: Array<{ value: string; label: string }>;
}

export function Tabs({ value, onValueChange, options }: TabsProps) {
	return (
		<div
			className="inline-flex rounded-full border border-ink/10 bg-linen/80 p-1"
			role="tablist"
			aria-label="Results view"
		>
			{options.map((option) => {
				const isActive = option.value === value;
				return (
					<button
						key={option.value}
						type="button"
						role="tab"
						aria-selected={isActive}
						onClick={() => onValueChange(option.value)}
						className={cn(
							'rounded-full px-4 py-2 text-sm font-medium transition',
							isActive
								? 'bg-ink text-white shadow-soft'
								: 'text-slate hover:text-ink'
						)}
					>
						{option.label}
					</button>
				);
			})}
		</div>
	);
}
