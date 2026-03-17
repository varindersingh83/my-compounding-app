import { parseCalculatorInput, type CalculatorInputs } from './input';

export interface YearlyResult {
	year: number;
	principal: number;
	balance: number;
	presentValue: number;
	withdrawal: number;
}

export interface CalculationResult {
	contributionAmount: number;
	total: number;
	presentValue: number;
	series: YearlyResult[];
}

export function calculatePresentValue(
	futureValue: number,
	inflationRatePercent: number,
	years: number
) {
	if (years <= 0) return roundCurrency(futureValue);
	const discounted = futureValue / Math.pow(1 + inflationRatePercent / 100, years);
	return roundCurrency(discounted);
}

export function calculateCompoundGrowth(inputs: CalculatorInputs): CalculationResult {
	const initialDeposit = Math.max(0, parseCalculatorInput(inputs.initialDeposit, 'currency'));
	const annualContribution = Math.max(
		0,
		parseCalculatorInput(inputs.annualContribution, 'currency')
	);
	const annualWithdrawal = Math.max(
		0,
		parseCalculatorInput(inputs.annualWithdrawal, 'currency')
	);
	const withdrawalStartYear = Math.max(
		0,
		parseCalculatorInput(inputs.withdrawalStartYear, 'integer')
	);
	const years = Math.max(0, parseCalculatorInput(inputs.years, 'integer'));
	const returnRate = parseCalculatorInput(inputs.returnRate, 'rate');
	const inflationRate = parseCalculatorInput(inputs.inflationRate, 'rate');

	let balance = initialDeposit;
	const series: YearlyResult[] = [];

	for (let year = 1; year <= years; year += 1) {
		const withdrawalsApplied =
			annualWithdrawal > 0 && withdrawalStartYear > 0 && year >= withdrawalStartYear
				? annualWithdrawal
				: 0;

		balance += annualContribution;
		balance -= withdrawalsApplied;
		balance = Math.max(0, balance);
		balance += balance * (returnRate / 100);

		const withdrawalYears =
			annualWithdrawal > 0 && withdrawalStartYear > 0 && year >= withdrawalStartYear
				? year - withdrawalStartYear + 1
				: 0;
		const netPrincipal =
			initialDeposit +
			annualContribution * year -
			annualWithdrawal * Math.max(0, withdrawalYears);

			series.push({
				year,
				principal: roundCurrency(netPrincipal),
				balance: roundCurrency(balance),
				presentValue: calculatePresentValue(balance, inflationRate, year),
				withdrawal: roundCurrency(withdrawalsApplied)
			});
		}

	const total = series.at(-1)?.balance ?? 0;
	const contributionAmount = roundCurrency(initialDeposit + annualContribution * years);
	const presentValue = calculatePresentValue(total, inflationRate, years);

	return {
		contributionAmount,
		total,
		presentValue,
		series
	};
}

function roundCurrency(value: number) {
	return Number.parseFloat(value.toFixed(2));
}
