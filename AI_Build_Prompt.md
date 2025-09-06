# QR Generator Project Build Prompt

## Role Assignment
You are an expert full-stack web developer with 10+ years of experience specializing in modern JavaScript frameworks, Tailwind CSS, and single-page applications. You have extensive knowledge of QR code generation, URL shortening services, PDF generation, and creating responsive, user-friendly web interfaces.

## Context
I need you to build a complete QR Generator web application based on the detailed specifications and project structure provided in the context files. This is a single-page application that converts URLs into QR codes, provides URL shortening functionality, and allows users to download results as PDFs.

**Tech Stack Requirements:**
- **Frontend**: HTML5 + Tailwind CSS + Vanilla JavaScript (ES6+)
- **Build Tool**: Vite
- **Key Libraries**: qrcode.js for QR generation, jsPDF for PDF creation
- **Architecture**: Component-based modular structure

## Task
Build the complete QR Generator application following the exact specifications in the Feature Specification document and the project structure outlined in the Project Structure document. Think step-by-step through the implementation, starting with the project setup, then building each component systematically.

**Core Implementation Requirements:**
1. **Project Setup**: Create the complete directory structure as specified in the Project Structure document
2. **Core Functionality**: Implement all features detailed in the Feature Specification (QR generation, URL shortening, clipboard copy, PDF download)
3. **Modern UI**: Build a responsive, professional interface using Tailwind CSS
4. **Error Handling**: Include comprehensive validation and user feedback
5. **Production Ready**: Ensure the application is optimized and deployment-ready

## Implementation Approach

**Phase 1: Foundation Setup**
- Initialize project with exact directory structure from Project Structure document
- Configure package.json, Vite, Tailwind CSS, and PostCSS
- Set up the main index.html entry point

**Phase 2: Core Components Development**
- Build QR generator component using qrcode.js library
- Implement URL shortening functionality (mock service initially)
- Create clipboard copy functionality using Clipboard API
- Develop PDF generator using jsPDF library
- Build comprehensive form validation and error handling

**Phase 3: User Interface Implementation**
- Create main application layout following the interface components from Feature Specification
- Build URL input form with real-time validation
- Design results display area for QR codes and shortened URLs
- Implement responsive design and smooth loading states
- Add user feedback animations and success indicators

**Phase 4: Integration & Polish**
- Connect all components in the main application workflow
- Test complete user journey as outlined in Feature Specification
- Optimize performance, accessibility, and mobile responsiveness
- Prepare production build configuration

## Expected Deliverables

**Complete Working Application:**
1. **Full Project Structure** - All directories and files as specified
2. **Functional Code** - Working implementation of every component
3. **Development Environment** - Ready to run with `npm run dev`
4. **Production Build** - Optimized for deployment to static hosting
5. **Documentation** - Setup and deployment instructions

## Success Criteria

The final application must:
- ✅ **Generate QR Codes** - Convert any valid URL into scannable QR codes
- ✅ **Shorten URLs** - Provide shortened versions of original URLs
- ✅ **Copy Functionality** - One-click clipboard copying with visual feedback
- ✅ **PDF Generation** - Download PDFs containing QR codes and shortened URLs
- ✅ **Modern Design** - Professional, responsive interface using Tailwind CSS
- ✅ **Robust Validation** - Comprehensive error handling and user feedback
- ✅ **Cross-Device Compatibility** - Seamless experience on desktop and mobile
- ✅ **Production Ready** - Optimized, secure, and deployment-ready

## Quality Standards

- **Clean Code**: Follow modern JavaScript ES6+ best practices
- **Component Architecture**: Modular, reusable component structure
- **Performance**: Fast loading and smooth user interactions
- **Accessibility**: WCAG compliant interface elements
- **Security**: Proper input validation and sanitization
- **Maintainability**: Well-organized, documented, and scalable codebase

Begin implementation by carefully reviewing both context documents, then proceed with systematic development following the phase-by-phase approach outlined above.
