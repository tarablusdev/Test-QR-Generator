# QR Generator

A modern, responsive web application that converts URLs into QR codes and provides shortened URLs with PDF download functionality.

## Features

- ✅ **QR Code Generation** - Convert any valid URL into scannable QR codes
- ✅ **URL Shortening** - Get shortened versions of original URLs
- ✅ **Copy to Clipboard** - One-click copying with visual feedback
- ✅ **PDF Download** - Download PDFs containing QR codes and shortened URLs
- ✅ **Modern Design** - Professional, responsive interface using Tailwind CSS
- ✅ **Real-time Validation** - Comprehensive error handling and user feedback
- ✅ **Mobile Friendly** - Seamless experience on desktop and mobile

## Tech Stack

- **Frontend**: HTML5 + Tailwind CSS + Vanilla JavaScript (ES6+)
- **Build Tool**: Vite
- **Libraries**: 
  - `qrcode.js` for QR code generation
  - `jsPDF` for PDF creation
- **Architecture**: Component-based modular structure

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm, yarn, or pnpm

### Installation

1. Clone or download the project
2. Navigate to the project directory:
   ```bash
   cd Test-QR-generator
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

Create an optimized production build:
```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

## Usage

1. **Enter URL**: Paste or type any URL in the input field
2. **Generate**: Click the "Generate QR Code" button
3. **View Results**: See your QR code and shortened URL instantly
4. **Copy URL**: Click the copy button to copy the shortened URL to clipboard
5. **Download PDF**: Click "Download PDF" to get a printable version

## Project Structure

```
Test-QR-generator/
├── src/
│   ├── styles/           # Tailwind CSS and custom styles
│   │   ├── main.css      # Main stylesheet entry point
│   │   ├── base/         # Base layer customizations
│   │   ├── components/   # Component styles
│   │   └── utilities/    # Utility classes
│   └── scripts/          # JavaScript modules
│       ├── main.js       # Application entry point
│       ├── components/   # Core functionality components
│       └── utils/        # Utility functions
├── index.html            # Main HTML file
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── postcss.config.js     # PostCSS configuration
```

## Components

### Core Components
- **QRGenerator**: Handles QR code generation using qrcode.js
- **URLShortener**: Manages URL shortening (mock service)
- **ClipboardCopy**: Handles clipboard operations with fallback support
- **PDFGenerator**: Creates downloadable PDFs using jsPDF
- **FormValidator**: Real-time form validation and error handling

### Utilities
- **DOMHelpers**: DOM manipulation utilities
- **URLValidator**: URL validation and normalization
- **ErrorHandler**: Centralized error handling and user feedback
- **LoadingStates**: Loading state management

## Browser Support

- Modern browsers with ES6+ support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Deployment

The application generates static files that can be deployed to any static hosting service:

- **Netlify**: Drag and drop the `dist/` folder
- **Vercel**: Connect your repository for automatic deployments
- **GitHub Pages**: Upload the `dist/` contents to your repository
- **Any static hosting**: Upload the `dist/` folder contents

## Development Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality
- `npm run format` - Format code with Prettier

## Customization

### Styling
Modify `tailwind.config.js` to customize colors, fonts, and other design tokens.

### URL Shortening Service
Replace the mock URL shortener in `src/scripts/components/url-shortener.js` with a real service integration.

### QR Code Options
Customize QR code generation options in `src/scripts/components/qr-generator.js`.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

Built with ❤️ using modern web technologies
