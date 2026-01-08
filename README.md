# Freshcart - Modern Grocery E-Commerce Platform

A full-stack grocery e-commerce application built with React, TypeScript, and Express. Inspired by modern grocery platforms like Oda, Freshcart demonstrates production-ready architecture, API integration, and real-world problem-solving.

## 🎯 Project Overview

Freshcart is a complete grocery e-commerce solution featuring:
- **Frontend**: Modern React/TypeScript application with responsive design
- **Backend**: Express/TypeScript API server with external API integrations
- **Features**: Category-based browsing, shopping cart, checkout, user authentication, recipe system

## ✨ Key Features

### Frontend
- **Modern UI/UX**: Clean, responsive design inspired by leading grocery platforms
- **Product Browsing**: Category-based navigation with subcategory filtering
- **Shopping Cart**: Full cart management with quantity controls
- **Checkout Flow**: Multi-step checkout process
- **User Authentication**: Login and registration pages
- **Recipe System**: Browse recipes and add ingredients to cart
- **Responsive Design**: Mobile-first approach

### Backend
- **RESTful API**: Clean API endpoints for products, categories, and user data
- **External API Integration**: 
  - USDA FoodData Central (nutrition data)
  - Open Food Facts (product metadata & images)
  - UPCitemdb (high-quality product images)
- **Data Merging**: Smart logic to combine data from multiple sources
- **Caching**: In-memory caching for performance
- **Error Handling**: Robust error handling and fallbacks

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Router DOM** - Navigation
- **Vite** - Build tool and dev server
- **CSS/SCSS** - Styling with CSS variables
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

### External APIs
- **USDA FoodData Central** - Nutrition data
- **Open Food Facts** - Product information & images
- **UPCitemdb** - Product images

## 📁 Project Structure

```
freshcart-frontend/
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/           # Page components
│   ├── services/        # API service layer
│   ├── state/           # React Context (Cart, User)
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── server/
│   ├── src/
│   │   ├── routes/      # API route handlers
│   │   ├── services/    # Business logic & API integrations
│   │   └── types/       # Backend type definitions
│   └── package.json
└── public/
    └── images/          # Product images directory
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- USDA API key (free): https://fdc.nal.usda.gov/api-key-signup/

### Backend Setup

1. **Install dependencies**:
   ```bash
   cd server
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp env.example .env
   # Edit .env and add your USDA API key
   ```

3. **Start backend server**:
   ```bash
   npm run dev
   # Server runs on http://localhost:3001
   ```

### Frontend Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

## 🏗️ Architecture Highlights

### Information Architecture
- **Homepage**: Inspiration and category entry points (no products)
- **All Products**: Central hub listing all categories
- **Category Pages**: Strict separation, each category has its own page
- **Product Pages**: Detailed product information

### API Integration
- **Multiple Sources**: Combines data from USDA, Open Food Facts, and UPCitemdb
- **Smart Matching**: Manual linking logic for product matching
- **Fallback System**: Graceful degradation when data is missing
- **Caching**: Reduces external API calls

### State Management
- **React Context**: Global state for cart and user
- **Local State**: Component-level state for UI interactions
- **API State**: Loading, error, and data states

## 📚 Documentation

Detailed documentation is available in the `docs/` directory:

- `docs/ARCHITECTURE.md` - Complete architecture documentation
- `docs/API_INTEGRATION.md` - External API integration guide  
- `docs/PRODUCT_IMAGES.md` - Product image specifications
- `docs/PROJECT_STRUCTURE.md` - Project structure and organization
- `server/README.md` - Backend API documentation
- `server/API_INTEGRATION.md` - Backend API integration details

## 🎨 Design Principles

- **Clean UI**: Minimal, focused design
- **Smooth UX**: Animations and transitions
- **Responsive**: Mobile-first approach
- **Accessible**: Semantic HTML and ARIA labels
- **Performance**: Optimized images and lazy loading

## 🧪 What I've Built

### Frontend Development
- Built reusable component library
- Implemented responsive layouts
- Created smooth animations and transitions
- Managed complex state with React Context
- Integrated with RESTful API

### Backend Development
- Designed RESTful API architecture
- Integrated multiple external APIs
- Implemented data merging logic
- Built error handling and fallback systems
- Added caching for performance

### Problem Solving
- Designed category-based browsing system
- Solved product image quality challenges
- Implemented manual linking for API data
- Built graceful error handling
- Created maintainable code architecture

## 🔄 Future Enhancements

- Database integration (PostgreSQL/MongoDB)
- User authentication with JWT
- Payment integration
- Admin panel for product management
- Docker containerization
- CI/CD pipeline
- Unit and integration tests

## 📝 About

This project represents my exploration of modern full-stack development, combining React, TypeScript, and Express to build a complete e-commerce solution. I focused on creating a clean, maintainable architecture while learning how to integrate multiple external APIs and handle real-world data challenges.

Key learning areas:
- Building a RESTful API with Express and TypeScript
- Integrating and merging data from multiple external sources
- Creating reusable React components with proper state management
- Implementing error handling and fallback strategies
- Designing a scalable project structure
