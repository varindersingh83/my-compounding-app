const usdFormatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	maximumFractionDigits: 0
});

const compactFormatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	notation: 'compact',
	maximumFractionDigits: 1
});

export function formatCurrency(value: number) {
	return usdFormatter.format(Number.isFinite(value) ? value : 0);
}

export function formatCurrencyCompact(value: number) {
	const safeValue = Number.isFinite(value) ? value : 0;

	if (Math.abs(safeValue) < 1_000_000) {
		return formatCurrency(safeValue);
	}

	return compactFormatter
		.format(safeValue)
		.replace('.0M', 'M')
		.replace('.0B', 'B')
		.replace('.0T', 'T');
}
