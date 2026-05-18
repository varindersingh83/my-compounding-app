import { describe, it, expect } from 'vitest';
import { calculateCompoundInterest } from './compounding';

describe('calculateCompoundInterest', () => {
	it('should calculate compound interest with no initial deposit', () => {
		const result = calculateCompoundInterest(0, 1000, 2, 10);
		expect(result).toHaveLength(2);
		expect(result[0]).toEqual({
			yearNumber: 1,
			total: 1100,
			principalValue: 1000
		});
		expect(result[1]).toEqual({
			yearNumber: 2,
			total: 2310,
			principalValue: 2000
		});
	});

	it('should calculate compound interest with initial deposit', () => {
		const result = calculateCompoundInterest(1000, 1000, 2, 10);
		expect(result).toHaveLength(2);
		expect(result[0]).toEqual({
			yearNumber: 1,
			total: 2200,
			principalValue: 2000
		});
		expect(result[1]).toEqual({
			yearNumber: 2,
			total: 3520,
			principalValue: 3000
		});
	});

	it('should handle zero years', () => {
		const result = calculateCompoundInterest(1000, 1000, 0, 10);
		expect(result).toHaveLength(0);
	});

	it('should handle zero rate of return', () => {
		const result = calculateCompoundInterest(1000, 1000, 2, 0);
		expect(result).toHaveLength(2);
		expect(result[0]).toEqual({
			yearNumber: 1,
			total: 2000,
			principalValue: 2000
		});
		expect(result[1]).toEqual({
			yearNumber: 2,
			total: 3000,
			principalValue: 3000
		});
	});

	it('should handle negative rate of return', () => {
		const result = calculateCompoundInterest(1000, 1000, 2, -10);
		expect(result).toHaveLength(2);
		expect(result[0]).toEqual({
			yearNumber: 1,
			total: 1800,
			principalValue: 2000
		});
		expect(result[1]).toEqual({
			yearNumber: 2,
			total: 2520,
			principalValue: 3000
		});
	});

	it('should handle zero annual contribution', () => {
		const result = calculateCompoundInterest(1000, 0, 2, 10);
		expect(result).toHaveLength(2);
		expect(result[0]).toEqual({
			yearNumber: 1,
			total: 1100,
			principalValue: 1000
		});
		expect(result[1]).toEqual({
			yearNumber: 2,
			total: 1210,
			principalValue: 1000
		});
	});
}); 