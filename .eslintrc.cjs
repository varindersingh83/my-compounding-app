module.exports = {
	root: true,
	env: {
		browser: true,
		es2022: true,
		node: true
	},
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	ignorePatterns: ['dist', 'coverage', 'node_modules'],
	extends: ['eslint:recommended'],
	overrides: [
		{
			files: ['**/*.{ts,tsx}'],
			parser: '@typescript-eslint/parser',
			plugins: ['@typescript-eslint', 'react-hooks', 'react-refresh'],
			extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
			rules: {
				'react-hooks/rules-of-hooks': 'error',
				'react-hooks/exhaustive-deps': 'warn',
				'react-refresh/only-export-components': [
					'warn',
					{ allowConstantExport: true }
				]
			}
		}
	]
};
