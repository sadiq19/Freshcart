# Product Images Specification

## Overview

This document outlines the requirements for product images in Freshcart.

## Image Requirements

### Technical Specifications
- **Format**: JPG or PNG
- **Dimensions**: Square (1:1 aspect ratio)
- **Resolution**: Minimum 800x800px, recommended 1200x1200px
- **Background**: Pure white (#FFFFFF)
- **File Size**: Optimized, typically 50-200KB per image

### Visual Style
- **Background**: Pure white (#FFFFFF)
- **Shadows**: Soft, subtle shadows only
- **Lighting**: Consistent, even lighting
- **Product Position**: Centered in frame
- **Angle**: Slight angle (3/4 view) or straight-on
- **No Text**: No brand names, labels, or watermarks
- **Generic Products**: Use generic products, not real brands

## File Structure

```
/public/images/
  /fruits/          # Fruit products
  /vegetables/      # Vegetable products
  /meat/            # Meat products
  /fish/            # Fish products
  /dairy/           # Dairy products
  /drinks/          # Beverages
  /bakery/          # Bakery items
  /pantry/          # Pantry items
  /snacks/          # Snacks and sweets
```

## Naming Convention

Format: `{category}_{product}_{variant}_{index}.jpg`

Examples:
- `fruit_apple_red_01.jpg`
- `meat_chicken_breast_02.jpg`
- `dairy_milk_whole_01.jpg`

## Image Sources

Currently using external APIs:
- **UPCitemdb** (primary) - High-quality images
- **Open Food Facts** (fallback) - Community images
- **Placeholder** (last resort) - Generic placeholder

Future: Replace with local images stored in `/public/images/`

