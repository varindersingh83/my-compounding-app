import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import App from './App';

describe('App', () => {
	it('renders the present value summary', async () => {
		const user = userEvent.setup();
		render(<App />);

		await user.type(screen.getByLabelText(/initial deposit/i), '1000');
		await user.type(screen.getByLabelText(/contribution amount/i), '1000');
		await user.type(screen.getByLabelText(/inflation rate/i), '3');
		await user.type(screen.getByLabelText(/years of growth/i), '2');
		await user.type(screen.getByLabelText(/estimated rate of return/i), '10');

		expect(screen.getByText(/present value/i)).toBeInTheDocument();
		expect(screen.getByText('$3,319')).toBeInTheDocument();
	});

	it('toggles between chart and table views', async () => {
		const user = userEvent.setup();
		render(<App />);

		await user.click(screen.getByRole('tab', { name: /table/i }));

		expect(screen.getByRole('columnheader', { name: /year/i })).toBeInTheDocument();
	});

	it('shows empty-state guidance before meaningful input', () => {
		render(<App />);

		expect(screen.getByText(/no growth data yet/i)).toBeInTheDocument();
		expect(screen.getByText(/\$0/)).toBeInTheDocument();
	});
});
