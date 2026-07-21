import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import App from './App';

describe('App', () => {
	it('renders the present value summary', async () => {
		const user = userEvent.setup();
		render(<App />);
		await user.click(screen.getByRole('button', { name: /edit inputs/i }));

		await user.type(screen.getByLabelText(/initial deposit/i), '1000');
		await user.type(screen.getByLabelText(/contribution amount/i), '1000');
		await user.type(screen.getByLabelText(/inflation rate/i), '3');
		await user.type(screen.getByLabelText(/years of growth/i), '2');
		await user.type(screen.getByLabelText(/estimated rate of return/i), '10');

		expect(screen.getByText(/present value/i)).toBeInTheDocument();
		expect(screen.getAllByText('$3,318').length).toBeGreaterThan(0);
	});

	it('toggles between graph and data views', async () => {
		const user = userEvent.setup();
		render(<App />);

		await user.click(screen.getByRole('tab', { name: /data/i }));

		expect(screen.getByRole('tab', { name: /data/i })).toHaveAttribute('aria-selected', 'true');
		expect(screen.getByText(/no yearly breakdown yet/i)).toBeInTheDocument();
	});

	it('shows empty-state guidance before meaningful input', () => {
		render(<App />);

		expect(screen.getByText(/no growth data yet/i)).toBeInTheDocument();
		expect(screen.getAllByText(/\$0/).length).toBeGreaterThan(0);
		expect(screen.queryByRole('button', { name: /add withdrawal/i })).not.toBeInTheDocument();
	});

	it('opens and closes the mobile data-entry drawer', async () => {
		const user = userEvent.setup();
		render(<App />);

		await user.click(screen.getByRole('button', { name: /edit inputs/i }));
		expect(screen.getByRole('dialog', { name: /data entry/i })).toHaveAttribute(
			'aria-hidden',
			'false'
		);

		await user.click(screen.getByRole('button', { name: /done/i }));
		expect(document.getElementById('data-entry-panel')).toHaveAttribute('aria-hidden', 'true');
	});

	it('applies a historical return preset to the estimated return field', async () => {
		const user = userEvent.setup();
		render(<App />);

		await user.click(screen.getByRole('button', { name: /edit inputs/i }));
		await user.click(
			screen.getByRole('button', { name: /use nasdaq-100 historical return of 14.60%/i })
		);

		expect(screen.getByLabelText(/estimated rate of return/i)).toHaveValue('14.6');
		expect(
			screen.getByRole('button', { name: /use nasdaq-100 historical return of 14.60%/i })
		).toHaveAttribute('aria-pressed', 'true');
	});

	it('adds withdrawals through a separate scenario drawer', async () => {
		const user = userEvent.setup();
		render(<App />);
		await user.click(screen.getByRole('button', { name: /edit inputs/i }));

		await user.type(screen.getByLabelText(/initial deposit/i), '1000000');
		await user.type(screen.getByLabelText(/years of growth/i), '20');
		await user.click(screen.getByRole('button', { name: /use s&p 500 historical return/i }));
		expect(
			within(screen.getByRole('dialog', { name: /data entry/i })).queryByLabelText(
				/^annual withdrawal\./i
			)
		).not.toBeInTheDocument();
		await user.click(screen.getByRole('button', { name: /done/i }));

		await user.click(screen.getByRole('button', { name: /add withdrawal/i }));
		expect(screen.getByRole('dialog', { name: /withdrawal plan/i })).toHaveAttribute(
			'aria-hidden',
			'false'
		);
		await user.type(screen.getByLabelText(/^annual withdrawal\./i), '10000');
		await user.type(screen.getByLabelText(/^start in year\./i), '5');

		expect(screen.getByText(/withdrawal scenario added/i)).toBeInTheDocument();
		await user.click(screen.getByRole('button', { name: /done/i }));
		await user.click(screen.getByRole('tab', { name: /data/i }));
		expect(screen.getByRole('columnheader', { name: /^withdrawal$/i })).toBeInTheDocument();
		expect(screen.getByRole('columnheader', { name: /after withdrawals/i })).toBeInTheDocument();
	});

	it('applies the suggested low-impact withdrawal start year', async () => {
		const user = userEvent.setup();
		render(<App />);
		await user.click(screen.getByRole('button', { name: /edit inputs/i }));
		await user.type(screen.getByLabelText(/initial deposit/i), '1000000');
		await user.type(screen.getByLabelText(/years of growth/i), '20');
		await user.click(screen.getByRole('button', { name: /use s&p 500 historical return/i }));
		await user.click(screen.getByRole('button', { name: /done/i }));
		await user.click(screen.getByRole('button', { name: /add withdrawal/i }));
		await user.type(screen.getByLabelText(/^annual withdrawal\./i), '10000');

		const useYearButton = screen.getByRole('button', { name: /use year/i });
		await user.click(useYearButton);

		expect(screen.getByLabelText(/^start in year\./i)).not.toHaveValue('');
		expect(screen.getByText(/changes the ending balance/i)).toBeInTheDocument();
	});
});
