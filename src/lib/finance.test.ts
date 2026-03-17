import { describe, expect, it } from 'vitest';

import { calculateCompoundGrowth, calculatePresentValue } from './finance';
import { formatCurrencyCompact } from './format';
import type { CalculatorInputs } from './input';

function buildInputs(partial: Partial<CalculatorInputs>): CalculatorInputs {
	return {
		initialDeposit: '',
		annualContribution: '',
		annualWithdrawal: '',
		withdrawalStartYear: '',
		years: '',
		returnRate: '',
		inflationRate: '',
		...partial
	};
}

describe('calculateCompoundGrowth', () => {
	it('calculates compound growth with no initial deposit', () => {
		const result = calculateCompoundGrowth(
			buildInputs({
				initialDeposit: '0',
				annualContribution: '1000',
				years: '2',
				returnRate: '10'
			})
		);

		expect(result.series).toEqual([
			{ year: 1, balance: 1100, principal: 1000, presentValue: 1100, withdrawal: 0 },
			{ year: 2, balance: 2310, principal: 2000, presentValue: 2310, withdrawal: 0 }
		]);
		expect(result.total).toBe(2310);
		expect(result.contributionAmount).toBe(2000);
	});

	it('calculates compound growth with an initial deposit', () => {
		const result = calculateCompoundGrowth(
			buildInputs({
				initialDeposit: '1000',
				annualContribution: '1000',
				years: '2',
				returnRate: '10'
			})
		);

		expect(result.series[0]).toEqual({
			year: 1,
			balance: 2200,
			principal: 2000,
			presentValue: 2200,
			withdrawal: 0
		});
		expect(result.series[1]).toEqual({
			year: 2,
			balance: 3520,
			principal: 3000,
			presentValue: 3520,
			withdrawal: 0
		});
	});

	it('handles zero years', () => {
		const result = calculateCompoundGrowth(
			buildInputs({
				initialDeposit: '1000',
				annualContribution: '1000',
				years: '0',
				returnRate: '10'
			})
		);

		expect(result.series).toEqual([]);
		expect(result.total).toBe(0);
	});

	it('handles zero return rate', () => {
		const result = calculateCompoundGrowth(
			buildInputs({
				initialDeposit: '1000',
				annualContribution: '1000',
				years: '2',
				returnRate: '0'
			})
		);

		expect(result.series[0]).toEqual({
			year: 1,
			balance: 2000,
			principal: 2000,
			presentValue: 2000,
			withdrawal: 0
		});
		expect(result.series[1]).toEqual({
			year: 2,
			balance: 3000,
			principal: 3000,
			presentValue: 3000,
			withdrawal: 0
		});
	});

	it('handles negative return rates', () => {
		const result = calculateCompoundGrowth(
			buildInputs({
				initialDeposit: '1000',
				annualContribution: '1000',
				years: '2',
				returnRate: '-10'
			})
		);

		expect(result.series[0]).toEqual({
			year: 1,
			balance: 1800,
			principal: 2000,
			presentValue: 1800,
			withdrawal: 0
		});
		expect(result.series[1]).toEqual({
			year: 2,
			balance: 2520,
			principal: 3000,
			presentValue: 2520,
			withdrawal: 0
		});
	});

	it('handles zero annual contribution', () => {
		const result = calculateCompoundGrowth(
			buildInputs({
				initialDeposit: '1000',
				annualContribution: '0',
				years: '2',
				returnRate: '10'
			})
		);

		expect(result.series[0]).toEqual({
			year: 1,
			balance: 1100,
			principal: 1000,
			presentValue: 1100,
			withdrawal: 0
		});
		expect(result.series[1]).toEqual({
			year: 2,
			balance: 1210,
			principal: 1000,
			presentValue: 1210,
			withdrawal: 0
		});
	});

	it('includes present value using inflation input', () => {
		const result = calculateCompoundGrowth(
			buildInputs({
				initialDeposit: '0',
				annualContribution: '1000',
				years: '10',
				returnRate: '10',
				inflationRate: '3'
			})
		);

		expect(result.presentValue).toBeLessThan(result.total);
		expect(result.presentValue).toBe(10318.34);
		expect(result.series[0].presentValue).toBe(1067.96);
		expect(result.series[9].presentValue).toBe(10318.34);
	});

	it('applies withdrawals before annual growth starting at the configured year', () => {
		const result = calculateCompoundGrowth(
			buildInputs({
				initialDeposit: '1000000',
				annualContribution: '50000',
				annualWithdrawal: '100000',
				withdrawalStartYear: '3',
				years: '4',
				returnRate: '10',
				inflationRate: '3'
			})
		);

			expect(result.series[1]).toEqual({
				year: 2,
				balance: 1270500,
				principal: 1100000,
				presentValue: 1197356.05,
				withdrawal: 0
			});
			expect(result.series[2]).toEqual({
				year: 3,
				balance: 1331550,
				principal: 1050000,
				presentValue: 1218367.6,
				withdrawal: 100000
			});
			expect(result.series[3]).toEqual({
				year: 4,
				balance: 1415205,
				principal: 1000000,
				presentValue: 1257429.54,
				withdrawal: 100000
			});
		expect(result.contributionAmount).toBe(1000000);
	});
});

describe('calculatePresentValue', () => {
	it('discounts future value by inflation over time', () => {
		expect(calculatePresentValue(10000, 3, 10)).toBe(7440.94);
	});

	it('returns future value when years are zero', () => {
		expect(calculatePresentValue(10000, 3, 0)).toBe(10000);
	});

	it('supports zero inflation', () => {
		expect(calculatePresentValue(10000, 0, 10)).toBe(10000);
	});
});

describe('formatCurrencyCompact', () => {
	it('keeps smaller values fully expanded', () => {
		expect(formatCurrencyCompact(3520)).toBe('$3,520');
	});

	it('formats millions compactly', () => {
		expect(formatCurrencyCompact(1_250_000)).toBe('$1.3M');
	});

	it('formats billions compactly', () => {
		expect(formatCurrencyCompact(1_441_003_520)).toBe('$1.4B');
	});
});
