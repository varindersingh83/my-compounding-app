import { expect, test } from '@playwright/test';

test('calculator updates total and present value', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'Edit inputs' }).click();

	await page.getByLabel('Initial deposit').fill('1000');
	await page.getByLabel('Contribution amount').fill('1000');
	await page.getByLabel('Inflation rate').fill('3');
	await page.getByLabel('Years of growth').fill('2');
	await page.getByLabel('Estimated rate of return').fill('10');

	await expect(page.getByText('Present value')).toBeVisible();
	await expect(page.getByTitle('$3,520')).toBeVisible();
	await expect(page.getByText('$3,318').first()).toBeVisible();
});

test('table view shows yearly data', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'Edit inputs' }).click();

	await page.getByLabel('Contribution amount').fill('1000');
	await page.getByLabel('Years of growth').fill('2');
	await page.getByLabel('Estimated rate of return').fill('10');
	await page.getByRole('button', { name: 'Done' }).click();
	await page.getByRole('tab', { name: 'Data' }).click();

	await expect(page.getByRole('columnheader', { name: 'Year' })).toBeVisible();
	await expect(page.getByRole('cell', { name: '2', exact: true })).toBeVisible();
});

test('mobile layout keeps the graph primary and uses a left data-entry drawer', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/');

	await expect(page.getByRole('heading', { name: 'Growth over time' })).toBeVisible();
	await expect(page.getByRole('tab', { name: 'Graph' })).toHaveAttribute('aria-selected', 'true');

	await page.getByRole('button', { name: 'Edit inputs' }).click();
	const drawer = page.getByRole('dialog', { name: 'Data entry' });
	await expect(drawer).toBeVisible();
	await expect(drawer).toHaveCSS('left', '0px');
	await expect(page.getByLabel('Estimated rate of return')).toBeVisible();

	await page.getByRole('button', { name: 'Done' }).click();
	await expect(drawer).toBeHidden();
});

test('historical return preset updates the estimated annual return', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/');
	await page.getByRole('button', { name: 'Edit inputs' }).click();

	const nasdaqPreset = page.getByRole('button', {
		name: 'Use Nasdaq-100 historical return of 14.60%'
	});
	await nasdaqPreset.click();

	await expect(page.getByLabel('Estimated rate of return')).toHaveValue('14.6');
	await expect(nasdaqPreset).toHaveAttribute('aria-pressed', 'true');
});

test('withdrawal scenario enters from the right and adds graph and data comparisons', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/');
	await expect(page.getByRole('button', { name: 'Add withdrawal' })).toBeHidden();
	await page.getByRole('button', { name: 'Edit inputs' }).click();

	await page.getByLabel('Initial deposit').fill('1000000');
	await page.getByLabel('Years of growth').fill('20');
	await page.getByRole('button', { name: /use s&p 500 historical return/i }).click();
	await expect(
		page.getByRole('dialog', { name: 'Data entry' }).getByLabel(/^Annual withdrawal\./)
	).toHaveCount(0);
	await page.getByRole('button', { name: 'Done' }).click();

	await page.getByRole('button', { name: 'Add withdrawal' }).click();
	const withdrawalDrawer = page.getByRole('dialog', { name: 'Withdrawal plan' });
	await expect(withdrawalDrawer).toBeVisible();
	await expect(withdrawalDrawer).toHaveCSS('right', '0px');
	await page.getByLabel(/^Annual withdrawal\./).fill('10000');
	await page.getByLabel(/^Start in year\./).fill('5');

	await expect(page.getByText('After withdrawals', { exact: true })).toBeVisible();
	await page.getByRole('button', { name: 'Done' }).click();
	await page.getByRole('tab', { name: 'Data' }).click();
	await expect(page.getByRole('columnheader', { name: 'Withdrawal', exact: true })).toBeVisible();
	await expect(page.getByRole('columnheader', { name: 'After withdrawals' })).toBeVisible();
});

test('suggested withdrawal timing can populate the start year', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/');
	await page.getByRole('button', { name: 'Edit inputs' }).click();
	await page.getByLabel('Initial deposit').fill('1000000');
	await page.getByLabel('Years of growth').fill('20');
	await page.getByRole('button', { name: /use s&p 500 historical return/i }).click();
	await page.getByRole('button', { name: 'Done' }).click();
	await page.getByRole('button', { name: 'Add withdrawal' }).click();
	await page.getByLabel(/^Annual withdrawal\./).fill('10000');

	const useYearButton = page.getByRole('button', { name: /use year/i });
	await expect(useYearButton).toBeVisible();
	await useYearButton.click();

	await expect(page.getByLabel(/^Start in year\./)).not.toHaveValue('');
	await expect(page.getByText(/changes the ending balance/i)).toBeVisible();
});
