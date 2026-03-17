import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	TooltipProps,
	XAxis,
	YAxis
} from 'recharts';

import type { YearlyResult } from '../lib/finance';
import { formatCurrency, formatCurrencyCompact } from '../lib/format';

interface GrowthChartProps {
	series: YearlyResult[];
	hasMeaningfulData: boolean;
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
	if (!active || !payload?.length) return null;

	return (
		<div className="rounded-2xl border border-ink/10 bg-white px-4 py-3 shadow-soft">
			<p className="text-sm font-semibold text-ink">{label}</p>
			<div className="mt-2 space-y-1 text-sm text-slate">
				{payload.map((entry) => (
					<div className="flex items-center justify-between gap-4" key={entry.dataKey}>
						<span>{entry.name}</span>
						<div className="text-right">
							<p className="font-semibold text-ink">
								{formatCurrencyCompact(Number(entry.value ?? 0))}
							</p>
							<p className="text-xs text-slate">{formatCurrency(Number(entry.value ?? 0))}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export function GrowthChart({ series, hasMeaningfulData }: GrowthChartProps) {
	if (!hasMeaningfulData) {
		return (
			<div className="flex h-[360px] items-center justify-center rounded-[1.5rem] border border-dashed border-ink/15 bg-linen/60 text-center">
				<div className="max-w-sm px-6">
					<p className="font-display text-2xl font-semibold text-ink">No growth data yet</p>
					<p className="mt-3 text-sm leading-6 text-slate">
						Add a few values to see your projected balance and principal line out over time.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="h-[360px] rounded-[1.5rem] bg-linen/55 p-3 sm:h-[420px]">
			<ResponsiveContainer width="100%" height="100%">
				<LineChart data={series} margin={{ left: 4, right: 20, top: 12, bottom: 0 }}>
					<CartesianGrid stroke="rgba(16,42,67,0.10)" strokeDasharray="4 6" />
					<XAxis
						dataKey="year"
						stroke="#3e5c76"
						tickLine={false}
						axisLine={false}
						tickMargin={12}
					/>
					<YAxis
						stroke="#3e5c76"
						tickLine={false}
						axisLine={false}
						tickFormatter={(value) => formatCurrencyCompact(Number(value))}
						width={88}
					/>
					<Tooltip content={<CustomTooltip />} />
					<Legend />
					<Line
						type="monotone"
						dataKey="balance"
						name="Total balance"
						stroke="#0f766e"
						strokeWidth={3}
						dot={false}
						activeDot={{ r: 5 }}
					/>
					<Line
						type="monotone"
						dataKey="principal"
						name="Principal"
						stroke="#b91c1c"
						strokeWidth={2.5}
						strokeDasharray="6 6"
						dot={false}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}
