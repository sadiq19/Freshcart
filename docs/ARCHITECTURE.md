# Freshcart Architecture Documentation

## Overview

Freshcart is a full-stack grocery e-commerce application built with React, TypeScript, and Express. The application follows modern architectural patterns with a clear separation between frontend and backend.

## Information Architecture

### Navigation Flow
```
Home → All Products → Category → Subcategory → Products → Product Detail
```

### Page Structure

#### Homepage (`/`)
- **Purpose**: Inspiration and navigation hub
- **Content**: 
  - Hero section with CTA
  - Inspiration meal cards (links to recipes)
  - Category entry points (first 8 categories)
- **No Products**: Homepage does not display individual products

#### All Products Page (`/products`)
- **Purpose**: Central hub for browsing
- **Content**: Grid of all main categories
- **API**: Fetches categories from `/api/categories`

#### Category Pages (`/products/:categorySlug`)
- **Purpose**: Display products in a specific category
- **Features**:
  - Subcategory filtering
  - Breadcrumb navigation
  - Product count display
- **API**: Fetches products from `/api/products?category={slug}`

#### Product Detail Page (`/product/:id`)
- **Purpose**: Display detailed product information
- **Features**:
  - Product details
  - Add to cart
  - Related products
- **API**: Fetches product from `/api/products/:id`

## Frontend Architecture

### Component Structure
```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── home/            # Homepage components
│   ├── layout/          # Layout components (Header, Footer)
│   └── product/         # Product-related components
├── pages/               # Page components
├── services/            # API service layer
├── state/               # React Context (Cart, User)
├── types/               # TypeScript definitions
└── utils/               # Utility functions
```

### State Management
- **React Context**: Global state (cart, user)
- **Local State**: Component-level state
- **API State**: Loading, error, data states

## Backend Architecture

### Server Structure
```
server/
├── src/
│   ├── index.ts         # Express server entry
│   ├── routes/          # API route handlers
│   ├── services/        # Business logic & API integrations
│   └── types/           # Type definitions
└── package.json
```

### API Design
- **RESTful**: Standard HTTP methods
- **JSON**: All responses in JSON format
- **Error Handling**: Consistent error responses
- **Caching**: In-memory cache (1 hour)

## External API Integrations

### USDA FoodData Central
- **Purpose**: Nutrition data
- **Endpoint**: `https://api.nal.usda.gov/fdc/v1`
- **Authentication**: API key required

### Open Food Facts
- **Purpose**: Product metadata & images
- **Endpoint**: `https://world.openfoodfacts.org`
- **Authentication**: None required

### UPCitemdb
- **Purpose**: High-quality product images
- **Endpoint**: `https://api.upcitemdb.com`
- **Authentication**: None required (free tier: 100 req/day)

## Data Flow

```
User Request → Frontend → API Service → Backend API → External APIs
                ↓                                           ↓
              Display ← Product Adapter ← Merged Data ← Multiple Sources
```

## Security & Performance

### Security
- Environment variables for sensitive data
- CORS configuration
- Error handling (no sensitive data leaked)

### Performance
- API response caching
- Lazy loading images
- Code splitting (Vite)
- Optimized bundle size

## Future Enhancements

- Database integration (PostgreSQL/MongoDB)
- Authentication with JWT
- Docker containerization
- CI/CD pipeline
- Unit and integration tests

