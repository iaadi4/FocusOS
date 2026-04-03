import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Disabled: This rule is experimental in v7 and fires false positives on
      // the standard async data-fetching pattern in useEffect hooks.
      // Actual cascading-render issues are fixed structurally (e.g. LimitCard key remount).
      'react-hooks/set-state-in-effect': 'off',
      // Disabled: react-hooks/immutability is also an experimental rule in v7
      'react-hooks/immutability': 'off',
    },
  },
])
