# Tailwind CSS Customizations Documentation

## Overview
This document outlines all custom Tailwind CSS extensions, components, and utilities used in the Qubex Tools project.

## Custom Theme Extensions

### Colors
Extended color palette defined in `tailwind.config.js`:

```javascript
colors: {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6', 
    600: '#2563eb',
    700: '#1d4ed8',
  },
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
  }
}
```

**Usage**: Use for consistent branding across the application
- `bg-primary-500`, `text-primary-600`, etc.
- `bg-success-500`, `text-success-600`, etc.

### Typography
Custom font family configuration:

```javascript
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
}
```

**Usage**: Applied automatically to all text elements via the sans-serif font stack.

### Animations
Custom animation extensions:

```javascript
animation: {
  'spin-slow': 'spin 2s linear infinite',
  'pulse-success': 'pulse 0.5s ease-in-out',
}
```

**Usage**:
- `animate-spin-slow`: Slower spinning animation for loading states
- `animate-pulse-success`: Quick pulse for success feedback

## Custom Component Classes (@layer components)

### Button Components
Defined in `src/styles/main.css`:

#### `.btn-primary`
Primary action button with blue styling and focus states.
```css
@apply bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
```

#### `.btn-secondary` 
Secondary button with gray styling.
```css
@apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2;
```

#### `.btn-success`
Success/confirmation button with green styling.
```css
@apply bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2;
```

#### `.btn-copy`
Small copy button for clipboard actions.
```css
@apply bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2;
```

#### `.btn-disabled`
Disabled button state.
```css
@apply bg-gray-300 text-gray-500 cursor-not-allowed;
```

### Form Components

#### `.form-input`
Standard form input with dark mode support.
```css
@apply w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400;
```

#### `.form-input-error`
Error state for form inputs.
```css
@apply border-red-500 focus:ring-red-500 focus:border-red-500;
```

#### `.form-label`
Standard form label styling.
```css
@apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2;
```

#### `.form-error`
Error message styling.
```css
@apply text-red-600 text-sm mt-1;
```

#### `.form-success`
Success message styling.
```css
@apply text-green-600 text-sm mt-1;
```

### Card Components

#### `.card`
Main card container with dark mode support.
```css
@apply bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6;
```

#### `.card-header`
Card header with bottom border.
```css
@apply border-b border-gray-200 dark:border-gray-700 pb-4 mb-4;
```

#### `.card-title`
Card title styling.
```css
@apply text-lg font-semibold text-gray-900 dark:text-white;
```

### QR Code Components

#### `.qr-container`
Container for QR code display.
```css
@apply flex justify-center items-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600;
```

#### `.qr-code`
QR code image styling.
```css
@apply max-w-full h-auto;
```

### URL Display Components

#### `.url-result`
Container for displaying shortened URLs.
```css
@apply bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 flex items-center justify-between;
```

#### `.url-text`
URL text styling with monospace font.
```css
@apply text-gray-800 dark:text-gray-200 font-mono text-sm break-all flex-1 mr-3;
```

### Loading Components

#### `.loading-spinner`
CSS-only loading spinner.
```css
@apply inline-block w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin;
```

### Animation Classes

#### `.fade-in`
Fade in animation for showing elements.
```css
animation: fadeIn 0.3s ease-in-out;
```

#### `.slide-up`
Slide up animation for revealing content.
```css
animation: slideUp 0.3s ease-out;
```

#### `.copy-feedback`
Tooltip feedback for copy actions.
```css
@apply absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 transition-opacity duration-200;
```

## Custom Utility Classes (@layer utilities)

### Text Utilities

#### `.text-gradient-primary`
Primary gradient text effect.
```css
background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

**Usage**: Apply to headings and important text for brand consistency.

## Keyframe Animations

### fadeIn
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### slideUp
```css
@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}
```

## Configuration Best Practices

### Content Configuration
Ensure all HTML files are included in the content array:
```javascript
content: [
  "./index.html",
  "./qr/**/*.html", 
  "./shortener/**/*.html",
  "./src/**/*.{js,html,css}",
]
```

### JIT Mode
Just-In-Time compilation is enabled for faster builds:
```javascript
mode: 'jit'
```

### Dark Mode
Class-based dark mode is configured:
```javascript
darkMode: 'class'
```

### Plugins
The @tailwindcss/forms plugin is included for better form styling:
```javascript
plugins: [
  require('@tailwindcss/forms'),
]
```

## Usage Guidelines

1. **Prefer Utility Classes**: Use Tailwind utilities directly in HTML when possible
2. **Component Classes**: Use @apply directive for repeated patterns (3+ uses)
3. **Custom Utilities**: Only create custom utilities for unique design requirements
4. **Dark Mode**: Always include dark mode variants for custom components
5. **Accessibility**: Ensure focus states and proper contrast in all custom classes
6. **Performance**: Keep custom CSS minimal to maintain Tailwind's performance benefits

## Maintenance

- Review custom classes quarterly for usage and optimization opportunities
- Update color palette and spacing when design system changes
- Test all custom components across different screen sizes and themes
- Document any new custom classes added to the project
