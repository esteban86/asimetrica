import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

export default [
	{ ignores: ['node_modules/**', 'dist/**', '.astro/**', 'tools/**'] },

	// Componentes / islands React
	{
		files: ['**/*.{js,jsx}'],
		plugins: { react, 'react-hooks': reactHooks },
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parserOptions: { ecmaFeatures: { jsx: true } },
			globals: { ...globals.browser, React: 'readonly' },
		},
		settings: { react: { version: 'detect' } },
		rules: {
			...react.configs.recommended.rules,
			...reactHooks.configs.recommended.rules,
			'react/prop-types': 'off',
			'react/no-unescaped-entities': 'off',
			'react/react-in-jsx-scope': 'off',
			'react/jsx-uses-react': 'off',
			'no-unused-vars': 'off',
			'no-undef': 'error',
		},
	},

	// Páginas y componentes Astro
	...astro.configs.recommended,
];
