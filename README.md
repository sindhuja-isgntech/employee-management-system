# EMS UI — Employee Management System (React + TypeScript + Vite)

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — type-check (`tsc -b`) and build for production
- `npm run lint` — run ESLint

## Project Structure

```
src/
├── main.tsx              # App entry: providers (React Query, EmployeeContext, Router)
├── App.tsx               # Route definitions
├── index.css             # Tailwind + shadcn theme and global styles
├── vite-env.d.ts         # Typed import.meta.env
├── api/                  # Axios instance, endpoints, employee API client
├── services/             # Alternate REST service layer
├── assets/               # Static images bundled by Vite
├── components/
│   ├── ui/               # shadcn/ui primitives (button, card, input, select, ...)
│   ├── layout/           # MainLayout, Header, Sidebar, Footer
│   ├── dashboard/        # EmployeeDashboard, MetricsGrid, DashboardSummary, DashboardHeader
│   └── employees/        # EmployeeCard, modals/forms, FilterPanel, SearchBar, EmployeeList
├── context/              # EmployeeContext provider + hook
├── hooks/                # useEmployees, useEmployeeFilter
├── lib/                  # Shared helpers (cn)
├── pages/                # Route-level pages
├── types/                # Shared TypeScript types
└── utils/                # Constants / seed data
```

Import from `src` using the `@/` alias (e.g. `import { Button } from '@/components/ui/button'`).
Environment variables live in `.env` (e.g. `VITE_API_BASE_URL`).

---

## Vite template notes

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
