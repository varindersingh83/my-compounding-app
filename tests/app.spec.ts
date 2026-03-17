import { expect, test } from '@playwright/test';

test('calculator updates total and present value', async ({ page }) => {
	await page.goto('/');

	await page.getByLabel('Initial deposit').fill('1000');
	await page.getByLabel('Contribution amount').fill('1000');
	await page.getByLabel('Inflation rate').fill('3');
	await page.getByLabel('Years of growth').fill('2');
	await page.getByLabel('Estimated rate of return').fill('10');

	await expect(page.getByText('Present value')).toBeVisible();
	await expect(page.getByText('$3,520')).toBeVisible();
	await expect(page.getByText('$3,319')).toBeVisible();
});

test('table view shows yearly data', async ({ page }) => {
	await page.goto('/');

	await page.getByLabel('Contribution amount').fill('1000');
	await page.getByLabel('Years of growth').fill('2');
	await page.getByLabel('Estimated rate of return').fill('10');
	await page.getByRole('tab', { name: 'Table' }).click();

	await expect(page.getByRole('columnheader', { name: 'Year' })).toBeVisible();
	await expect(page.getByRole('cell', { name: '2' })).toBeVisible();
});
