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
	withdrawalSeries?: YearlyResult[];
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

export function GrowthChart({ series, withdrawalSeries, hasMeaningfulData }: GrowthChartProps) {
	if (!hasMeaningfulData) {
		return (
			<div className="flex h-[min(58dvh,34rem)] min-h-[22rem] items-center justify-center rounded-xl border border-dashed border-ink/15 bg-linen/60 text-center">
				<div className="max-w-sm px-6">
					<p className="font-display text-2xl font-semibold text-ink">No growth data yet</p>
					<p className="mt-3 text-sm leading-6 text-slate">
						Add a few values to see your projected balance and principal line out over time.
					</p>
				</div>
			</div>
		);
	}

	const chartData = series.map((row, index) => ({
		...row,
		withdrawalBalance: withdrawalSeries?.[index]?.balance
	}));

	return (
		<div className="h-[min(58dvh,34rem)] min-h-[22rem] rounded-xl bg-linen/55 py-3 pr-1 sm:p-3">
			<ResponsiveContainer width="100%" height="100%">
				<LineChart data={chartData} margin={{ left: -8, right: 8, top: 12, bottom: 0 }}>
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
						width={68}
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
					{withdrawalSeries ? (
						<Line
							type="monotone"
							dataKey="withdrawalBalance"
							name="After withdrawals"
							stroke="#2563eb"
							strokeWidth={3}
							dot={false}
							activeDot={{ r: 5 }}
						/>
					) : null}
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}
