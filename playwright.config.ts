import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './tests',
	testMatch: /.*\.spec\.ts/,
	use: {
		baseURL: 'http://127.0.0.1:4183',
		trace: 'on-first-retry'
	},
	webServer: {
		command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4183',
		port: 4183,
		reuseExistingServer: !process.env.CI
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		}
	]
});
