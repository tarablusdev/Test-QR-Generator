# AI Context File - QR Generator & URL Shortener Project

## Project Overview
**Qubex Tools** is a modern, multi-featured web application that provides free online tools for QR code generation and URL shortening. The project is built as a comprehensive suite of specialized QR generators and includes a URL shortening service with analytics capabilities.

**Primary Purpose**: Provide users with professional-grade, free tools for generating various types of QR codes and shortening URLs, all accessible through a modern web interface.

## Technologies & Stack

### Frontend Technologies
- **HTML5**: Semantic markup with accessibility features (ARIA labels, skip navigation)
- **Vanilla JavaScript (ES6+)**: Modular, component-based architecture using ES modules
- **Tailwind CSS v3.3+**: Utility-first CSS framework with custom theme extensions
- **CSS PostCSS**: CSS processing with autoprefixer

### Build Tools & Development
- **Vite v5.0+**: Modern build tool and development server
- **Node.js v16+**: Runtime environment
- **PNPM**: Package manager (preferred over npm/yarn)
- **ESLint**: Code linting and quality assurance
- **Prettier**: Code formatting
- **Vitest**: Testing framework

### Core Libraries
- **qrcode.js v1.5.3**: QR code generation library
- **jsPDF v2.5.1**: PDF generation for downloadable QR codes
- **Terser v5.44+**: JavaScript minification

### Backend & Deployment
- **Vercel**: Hosting platform with serverless functions
- **Vercel KV**: Key-value database for URL shortening service
- **Vercel Serverless Functions**: API endpoints for URL shortening

### Development Dependencies
- **@tailwindcss/forms**: Enhanced form styling
- **Concurrently**: Running multiple development servers
- **Autoprefixer**: CSS vendor prefixing

## Project Structure

```
Test-QR-generator/
├── 📁 api/                          # Vercel serverless functions
│   ├── shorten.js                   # URL shortening API endpoint
│   └── [shortCode].js              # URL redirect handler
├── 📁 qr/                          # QR generator pages
│   ├── index.html                  # Main QR generator
│   ├── wifi/                       # WiFi QR generator
│   ├── vcard/                      # vCard QR generator
│   ├── event/                      # Calendar event QR generator
│   ├── location/                   # Location/GPS QR generator
│   ├── sms/                        # SMS QR generator
│   ├── email/                      # Email QR generator
│   ├── phone/                      # Phone number QR generator
│   ├── text/                       # Text QR generator
│   └── payment/                    # Payment QR generator
├── 📁 shortener/                   # URL shortener tool
├── 📁 src/                         # Source code
│   ├── scripts/                    # JavaScript modules
│   │   ├── components/             # Reusable components
│   │   ├── utils/                  # Utility functions
│   │   ├── config/                 # Configuration files
│   │   └── *.js                    # Page-specific entry points
│   └── styles/                     # CSS and Tailwind files
├── 📁 Documents/                   # Project documentation
├── index.html                      # Landing page
├── package.json                    # Dependencies and scripts
├── vite.config.js                  # Vite build configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── vercel.json                     # Vercel deployment configuration
└── postcss.config.js               # PostCSS configuration
```

## Core Features & Implementation

### 1. QR Code Generation System
**Location**: `src/scripts/components/qr-generator.js`

**Implementation Details**:
- Uses `qrcode.js` library for QR generation
- Renders QR codes on HTML5 Canvas elements
- Supports multiple output formats (PNG, DataURL, Blob)
- Configurable options: size, colors, error correction level
- Real-time generation with visual feedback

**Specialized QR Generators**:
- **WiFi QR**: Network credentials (SSID, password, security type)
- **vCard QR**: Contact information (name, phone, email, organization)
- **Event QR**: Calendar events (title, date, location, description)
- **Location QR**: GPS coordinates and addresses
- **SMS QR**: Pre-filled SMS messages
- **Email QR**: Pre-configured email composition
- **Phone QR**: Direct dial phone numbers
- **Text QR**: Plain text content
- **Payment QR**: Payment information and amounts

### 2. URL Shortening Service
**Location**: `api/shorten.js`, `src/scripts/components/url-shortener.js`

**Implementation Details**:
- Vercel serverless function backend
- Vercel KV database for URL storage
- Custom domain: `qubex.it`
- 7-character alphanumeric short codes
- Collision detection and retry logic
- 1-year expiration on stored URLs
- CORS-enabled API endpoints

**Features**:
- Duplicate URL detection (returns existing short code)
- Analytics tracking capability
- Custom domain branding
- No registration required

### 3. PDF Generation System
**Location**: `src/scripts/components/pdf-generator.js`

**Implementation Details**:
- Uses `jsPDF` library
- Generates professional PDF documents
- Includes QR code image and URL information
- Downloadable with custom filenames
- Optimized for printing

### 4. Component Architecture

#### Core Components (`src/scripts/components/`)
- **QRGenerator**: QR code generation and canvas management
- **URLShortener**: URL shortening API integration
- **ClipboardCopy**: Clipboard operations with fallback support
- **PDFGenerator**: PDF creation and download functionality
- **FormValidator**: Real-time form validation and error handling
- **ThemeToggle**: Dark/light mode switching

#### Utilities (`src/scripts/utils/`)
- **DOMHelpers**: DOM manipulation and element selection
- **URLValidator**: URL validation and normalization
- **ErrorHandler**: Centralized error handling and user feedback
- **LoadingStates**: Loading state management and UI feedback
- **ThemeManager**: Theme persistence and system preference detection

### 5. User Interface & Experience

**Design System**:
- Modern, responsive design using Tailwind CSS
- Dark/light mode support with system preference detection
- Mobile-first responsive layout
- Accessibility features (ARIA labels, keyboard navigation)
- Professional color scheme with custom brand colors

**User Flow**:
1. Landing page with tool selection
2. Specialized tool pages for different QR types
3. Form-based input with real-time validation
4. Instant QR generation and preview
5. Copy-to-clipboard functionality
6. PDF download options

### 6. Form Validation System

**Implementation**:
- Real-time validation for all input fields
- Specialized validators for each QR type
- URL normalization and protocol handling
- Visual feedback with error messages
- Accessibility-compliant error reporting

**Validation Types**:
- URL validation with protocol detection
- Email format validation
- Phone number format validation
- Required field validation
- Custom format validation (WiFi security, payment amounts)

### 7. Development & Build System

**Development Workflow**:
```bash
npm run dev          # Start development server (Vite)
npm run dev:api      # Start Vercel dev server for API
npm run dev:full     # Start both frontend and API servers
npm run build        # Production build
npm run preview      # Preview production build
```

**Build Configuration**:
- Multi-page application with separate entry points
- Asset optimization and minification
- Source map generation (disabled in production)
- CSS processing with PostCSS and Autoprefixer

### 8. Deployment Configuration

**Vercel Setup**:
- Static site hosting with serverless functions
- Custom domain routing and redirects
- Environment variable management for API keys
- Automatic deployments from Git repository

**URL Routing**:
- Clean URLs for all tools (`/qr/`, `/shortener/`)
- API endpoints (`/api/shorten`, `/api/[shortCode]`)
- Short URL redirects (`/[7-character-code]`)

## Environment Variables

**Required for URL Shortening**:
```env
KV_REST_API_URL=<Vercel KV URL>
KV_REST_API_TOKEN=<Vercel KV Token>
KV_REST_API_READ_ONLY_TOKEN=<Vercel KV Read Token>
```

## Key Implementation Patterns

### 1. Modular Component System
Each major feature is implemented as an ES6 class with:
- Constructor for initialization
- Public methods for external interaction
- Private methods for internal logic
- Error handling and validation
- Event management

### 2. Async/Await Pattern
All asynchronous operations use modern async/await syntax:
- QR code generation
- API calls to shortening service
- File downloads and clipboard operations
- Form validation

### 3. Error Handling Strategy
Centralized error handling with:
- User-friendly error messages
- Console logging for debugging
- Graceful degradation for failed operations
- Visual feedback for all error states

### 4. Responsive Design Approach
Mobile-first design with:
- Tailwind CSS utility classes
- Flexible grid layouts
- Touch-friendly interface elements
- Optimized for all screen sizes

## Browser Compatibility
- **Modern browsers with ES6+ support**
- **Chrome 60+**
- **Firefox 55+**
- **Safari 12+**
- **Edge 79+**

## Performance Considerations
- Lazy loading of components
- Optimized bundle splitting
- Minimal external dependencies
- Client-side processing (no server dependency for QR generation)
- Efficient DOM manipulation

## Security Features
- Client-side processing for sensitive data
- CORS configuration for API endpoints
- Input validation and sanitization
- No persistent storage of user data
- Secure URL shortening with expiration

## Future Enhancement Areas
1. **Analytics Dashboard**: Click tracking and usage statistics
2. **Custom QR Styling**: Colors, logos, and branding options
3. **Bulk QR Generation**: Multiple QR codes at once
4. **API Integration**: Third-party service integrations
5. **User Accounts**: Save and manage generated QR codes
6. **Advanced PDF Options**: Templates and customization

## Development Guidelines

### Adding New Features
1. Create component in `src/scripts/components/`
2. Add corresponding HTML page if needed
3. Update Vite configuration for new entry points
4. Add routing in `vercel.json` if required
5. Update this context file with new feature details

### Code Style
- Use ES6+ features and modules
- Follow existing component patterns
- Implement proper error handling
- Add JSDoc comments for complex functions
- Use Tailwind CSS for styling
- Maintain accessibility standards

### Testing Approach
- Manual testing across browsers
- Form validation testing
- QR code scanning verification
- Mobile device testing
- Accessibility testing with screen readers

---

**Last Updated**: September 2025
**Project Version**: 1.0.0
**Maintainer**: Development Team

This context file should be updated whenever new features are added or significant changes are made to the project structure or implementation.
