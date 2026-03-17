/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				body: ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif']
			},
			colors: {
				ink: '#102a43',
				slate: '#3e5c76',
				linen: '#f8f4ec',
				gold: '#d4a017',
				emerald: '#0f766e',
				rose: '#b91c1c',
				sky: '#0f4c81'
			},
			boxShadow: {
				panel: '0 24px 64px rgba(16, 42, 67, 0.14)',
				soft: '0 12px 32px rgba(15, 76, 129, 0.12)'
			},
			backgroundImage: {
				mesh:
					'radial-gradient(circle at top left, rgba(212,160,23,0.20), transparent 28%), radial-gradient(circle at bottom right, rgba(15,118,110,0.16), transparent 30%)'
			}
		}
	},
	plugins: []
};
