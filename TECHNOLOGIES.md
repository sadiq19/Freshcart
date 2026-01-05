# Teknologier og Språk i FreshCart Frontend

## Hovedprogrammeringsspråk

### TypeScript
- **Versjon:** ~5.6.2
- **Bruk:** Hovedprogrammeringsspråk for hele prosjektet
- **Filer:** Alle `.ts` og `.tsx` filer
- **Konfigurasjon:** `tsconfig.json`

### JavaScript (ES2020+)
- **Versjon:** ES2020 / ESNext
- **Bruk:** Kompileres fra TypeScript
- **Moduler:** ES Modules (`"type": "module"`)

## Frontend Framework

### React
- **Versjon:** ^18.3.1
- **Bruk:** UI-framework for hele applikasjonen
- **Features:**
  - React Hooks (useState, useEffect, useContext, useReducer)
  - React Router for navigasjon
  - Context API for state management

### React Router DOM
- **Versjon:** ^7.11.0
- **Bruk:** Routing og navigasjon
- **Features:**
  - BrowserRouter
  - Routes og Route
  - Link og useNavigate

## Styling

### CSS3
- **Bruk:** All styling i prosjektet
- **Filer:** Alle `.css` filer
- **Features:**
  - CSS Custom Properties (CSS Variables)
  - Flexbox og Grid
  - Media Queries (Responsive Design)
  - CSS Transitions og Animations

## Build Tools

### Vite
- **Versjon:** ^6.0.3
- **Bruk:** Build tool og development server
- **Features:**
  - Hot Module Replacement (HMR)
  - Fast builds
  - Optimized production builds

### TypeScript Compiler
- **Bruk:** Type checking og kompilering
- **Script:** `tsc -b`

## Code Quality

### ESLint
- **Versjon:** ^9.39.2
- **Bruk:** Code linting og kvalitetssikring
- **Plugins:**
  - @typescript-eslint/eslint-plugin
  - @typescript-eslint/parser
  - eslint-plugin-react
  - eslint-plugin-react-hooks
  - eslint-plugin-react-refresh

## Biblioteker og Pakker

### Lucide React
- **Versjon:** ^0.562.0
- **Bruk:** Ikoner (SVG icons)
- **Eksempel:** Clock, Users, Zap ikoner

### date-fns
- **Versjon:** ^4.1.0
- **Bruk:** Datoformatering og manipulering
- **Features:** Støtte for mange språk/locales

### UUID
- **Versjon:** ^13.0.0
- **Bruk:** Generering av unike ID-er
- **Type:** @types/uuid ^10.0.0

## Type Definitions

### TypeScript Type Definitions
- @types/react: ^18.3.12
- @types/react-dom: ^18.3.1
- @types/node: ^22.10.2
- @types/react-router-dom: ^5.3.3
- @types/uuid: ^10.0.0

## Konfigurasjonsfiler

### TypeScript Config
- **Fil:** `tsconfig.json`
- **Target:** ES2020
- **Module:** ESNext
- **JSX:** react-jsx
- **Strict mode:** Aktivert

### Vite Config
- **Fil:** `vite.config.ts`
- **Plugin:** @vitejs/plugin-react
- **Alias:** `@` → `src/`
- **Server:** Port 5173

### ESLint Config
- **Fil:** `eslint.config.js`
- **Parser:** TypeScript ESLint Parser
- **Plugins:** React, React Hooks, TypeScript

### Package.json
- **Fil:** `package.json`
- **Type:** module (ES Modules)
- **Scripts:**
  - `dev`: Start development server
  - `build`: Build for production
  - `lint`: Run ESLint
  - `preview`: Preview production build

## Filtyper i Prosjektet

### TypeScript/React Filer
- `.ts` - TypeScript filer
- `.tsx` - TypeScript React komponenter

### Styling Filer
- `.css` - CSS stylesheets

### Konfigurasjonsfiler
- `.json` - JSON konfigurasjon (package.json, tsconfig.json)
- `.js` - JavaScript konfigurasjon (eslint.config.js)

### HTML
- `index.html` - Entry point HTML fil

## Prosjektstruktur

```
freshcart-frontend/
├── src/
│   ├── components/     # React komponenter (.tsx)
│   ├── pages/          # Side komponenter (.tsx)
│   ├── state/          # State management (.tsx)
│   ├── types/          # TypeScript type definitions (.ts)
│   ├── styles/         # Global CSS (.css)
│   ├── mocks/          # Mock data (.ts)
│   └── assets/         # Statiske assets
├── public/             # Public assets
├── node_modules/       # Dependencies
├── package.json        # NPM konfigurasjon
├── tsconfig.json       # TypeScript konfigurasjon
├── vite.config.ts      # Vite konfigurasjon
└── eslint.config.js    # ESLint konfigurasjon
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ features
- CSS Grid og Flexbox
- CSS Custom Properties

## Development Tools

- **Node.js:** Runtime environment
- **npm:** Package manager
- **Vite Dev Server:** Development server med HMR
- **TypeScript:** Type checking
- **ESLint:** Code linting

## Summary

**Hovedteknologier:**
1. **TypeScript** - Hovedprogrammeringsspråk
2. **React** - UI Framework
3. **CSS3** - Styling
4. **Vite** - Build tool
5. **React Router** - Routing

**Totalt antall språk/teknologier:** 5 hovedteknologier + flere støttebiblioteker

