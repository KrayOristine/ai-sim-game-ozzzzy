import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, '.', '');
	return {
		root: './src',
		server: {
			port: 3000,
			host: '0.0.0.0',
		},
		plugins: [react(), tailwindcss({})],
		define: {
			'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
			'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
		},
		resolve: {
			alias: {
				'#': path.resolve(__dirname, 'src'),
			},
		},
		css: {
			postcss: './postcss.config.js',
		},
		build: {
			assetsDir: './assets',
			outDir: '../dist',
			emptyOutDir: true,
			cssMinify: false,
			rollupOptions: {
				output: {
					compact: true,
					generatedCode: {
						constBindings: true,
						objectShorthand: true,
					},
					manualChunks: function (id) {
						const isReact = id.includes('react');
						const isGoogle = id.includes('google');

						if (isReact) {
							return 'react';
						}

						if (isGoogle) {
							return 'google';
						}

						if (id.includes('vendor') && !(isReact || isGoogle)) {
							return 'vendor';
						}

						if (id.includes('services') || id.includes('utils')) {
							return 'core';
						}

						if (id.includes('components')) {
							return 'ux';
						}

						if (id.includes('constants')) {
							return 'helper';
						}

						return null;
					},
				},
			},
		},
	};
});

