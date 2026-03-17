import { z } from 'zod';

const numericSchema = z.number().finite();

export interface CalculatorInputs {
	initialDeposit: string;
	annualContribution: string;
	annualWithdrawal: string;
	withdrawalStartYear: string;
	years: string;
	returnRate: string;
	inflationRate: string;
}

export const defaultCalculatorInputs: CalculatorInputs = {
	initialDeposit: '',
	annualContribution: '',
	annualWithdrawal: '',
	withdrawalStartYear: '',
	years: '',
	returnRate: '',
	inflationRate: ''
};

export type NumericInputKind = 'currency' | 'rate' | 'integer';

export function sanitizeNumericInput(value: string, kind: NumericInputKind) {
	const cleaned = value.replace(kind === 'integer' ? /[^0-9]/g : /[^0-9.-]/g, '');
	if (kind === 'integer') {
		return cleaned.replace(/^0+(?=\d)/, '');
	}

	const hasNegative = cleaned.startsWith('-');
	const [whole = '', ...rest] = cleaned.replace(/-/g, '').split('.');
	const fractional = rest.join('');
	const normalized = fractional.length > 0 ? `${whole}.${fractional}` : whole;
	return hasNegative ? `-${normalized}` : normalized;
}

export function parseCalculatorInput(value: string, kind: NumericInputKind) {
	const normalized = value.trim();
	if (!normalized) return 0;

	const parsed =
		kind === 'integer'
			? Number.parseInt(normalized, 10)
			: Number.parseFloat(normalized.replace(/,/g, ''));

	if (!numericSchema.safeParse(parsed).success || Number.isNaN(parsed)) return 0;
	if (kind === 'integer') return Math.max(0, Math.trunc(parsed));
	return parsed;
}

export function formatDisplayValue(value: string, kind: NumericInputKind) {
	const parsed = parseCalculatorInput(value, kind);
	if (!value.trim()) return '';

	if (kind === 'currency') {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0
		}).format(parsed);
	}

	if (kind === 'integer') {
		return String(parsed);
	}

	return Number.isInteger(parsed) ? String(parsed) : parsed.toFixed(2).replace(/\.?0+$/, '');
}
