# Project Structure

This document outlines the professional project structure of Freshcart.

## Directory Structure

```
freshcart-frontend/
├── docs/                    # Documentation
│   ├── ARCHITECTURE.md     # System architecture
│   ├── API_INTEGRATION.md  # External API integration guide
│   ├── PRODUCT_IMAGES.md   # Image specifications
│   └── PROJECT_STRUCTURE.md # This file
│
├── server/                  # Backend API server
│   ├── src/
│   │   ├── index.ts        # Express server entry point
│   │   ├── routes/         # API route handlers
│   │   ├── services/       # Business logic & API integrations
│   │   └── types/          # TypeScript type definitions
│   ├── API_INTEGRATION.md  # Backend API integration details
│   ├── README.md           # Backend documentation
│   └── package.json
│
├── src/                     # Frontend source code
│   ├── components/         # React components
│   │   ├── common/         # Reusable UI components
│   │   ├── home/           # Homepage components
│   │   ├── layout/         # Layout components
│   │   └── product/        # Product-related components
│   │
│   ├── pages/              # Page components
│   │   ├── AllProductsPage.tsx
│   │   ├── CategoryPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── RecipesPage.tsx
│   │   └── ...
│   │
│   ├── services/           # API service layer
│   │   └── api.ts          # Frontend API client
│   │
│   ├── state/              # React Context providers
│   │   ├── CartContext.tsx
│   │   └── UserContext.tsx
│   │
│   ├── types/              # TypeScript type definitions
│   │   ├── product.ts
│   │   ├── cart.ts
│   │   └── ...
│   │
│   ├── utils/              # Utility functions
│   │   ├── productAdapter.ts
│   │   └── imageUtils.ts
│   │
│   ├── styles/             # Global styles
│   │   ├── global.css
│   │   ├── reset.css
│   │   └── tokens.css
│   │
│   └── mocks/              # Mock data (for development)
│       ├── products.ts
│       ├── recipes.ts
│       └── meals.ts
│
├── public/                 # Static assets
│   ├── freshcart-Logo.jpg
│   └── images/            # Product images directory
│
├── .editorconfig          # Editor configuration
├── .gitignore             # Git ignore rules
├── .prettierrc.json       # Prettier configuration
├── eslint.config.js       # ESLint configuration
├── index.html             # HTML entry point
├── package.json           # Frontend dependencies
├── README.md              # Main project documentation
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## Code Organization Principles

### Components
- **Component per file**: One component per file
- **Colocation**: CSS files alongside components
- **Barrel exports**: Use `index.ts` for clean imports
- **Naming**: PascalCase for components, kebab-case for files

### Pages
- **Route-based**: One page per route
- **Self-contained**: Each page manages its own state
- **API integration**: Fetch data from backend API

### Services
- **API client**: Centralized API service (`src/services/api.ts`)
- **Error handling**: Consistent error handling
- **Type safety**: Full TypeScript support

### State Management
- **React Context**: Global state (cart, user)
- **Local state**: Component-level state with `useState`
- **No prop drilling**: Use Context for shared state

### Type Definitions
- **Shared types**: Types used across multiple files
- **API types**: Separate types for API responses
- **Component props**: Inline types for component-specific props

## File Naming Conventions

- **Components**: `PascalCase.tsx` (e.g., `ProductCard.tsx`)
- **Pages**: `PascalCase.tsx` (e.g., `HomePage.tsx`)
- **Services**: `camelCase.ts` (e.g., `api.ts`)
- **Utils**: `camelCase.ts` (e.g., `productAdapter.ts`)
- **Types**: `camelCase.ts` (e.g., `product.ts`)
- **Styles**: `ComponentName.css` (e.g., `ProductCard.css`)

## Import Organization

```typescript
// 1. External dependencies
import React from 'react';
import { Link } from 'react-router-dom';

// 2. Internal imports (components)
import { ProductCard } from '../components/product/ProductCard';

// 3. Internal imports (services/utils)
import { apiService } from '../services/api';

// 4. Internal imports (types)
import type { Product } from '../types/product';

// 5. Styles
import './Component.css';
```

## Best Practices

### Component Structure
1. Imports
2. Type definitions
3. Component function
4. Helper functions
5. Export

### Error Handling
- Try-catch blocks in async functions
- User-friendly error messages
- Loading states
- Fallback UI

### Performance
- Lazy loading images
- Code splitting
- Memoization when needed
- Optimized re-renders

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support

## Documentation

- **README.md**: Project overview and setup
- **docs/ARCHITECTURE.md**: System architecture
- **docs/API_INTEGRATION.md**: External API details
- **server/README.md**: Backend API documentation
- **Inline comments**: Complex logic explained

