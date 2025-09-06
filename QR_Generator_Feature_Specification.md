# QR Generator - Feature Specification

## What is this website?

A simple web tool that converts any URL into a QR code and provides a shortened version of the link. Users can download everything as a PDF for easy sharing or printing.

## Who is it for?

- Anyone who needs to share links quickly
- People who want QR codes for marketing materials
- Users who need printable QR codes for offline use
- Anyone wanting to shorten long URLs

## Main Interface Components

### 1. URL Input Section
- **Large text input box** where users paste or type their URL
- **Submit/Generate button** to process the URL
- **Validation messages** that appear if the URL format is incorrect

### 2. Results Display Area
- **QR Code Image** - displays the generated QR code
- **Shortened URL** - shows the shortened version of the original link
- **Copy Button** - next to the shortened URL for easy copying
- **Download PDF Button** - to get a PDF with both QR code and shortened URL

## Core Functionalities

### 1. QR Code Generation
**What it does:** Takes any URL and creates a scannable QR code
- User enters a URL (like `https://example.com/very/long/path/to/page`)
- System generates a QR code image
- QR code appears on screen immediately
- QR code can be scanned by any standard QR reader

### 2. URL Shortening
**What it does:** Creates a shorter, easier-to-share version of the original URL
- Original URL: `https://example.com/very/long/path/to/page`
- Shortened URL: `https://short.ly/abc123`
- Shortened URL redirects to the original when clicked
- Displayed clearly below the QR code

### 3. Copy to Clipboard
**What it does:** One-click copying of the shortened URL
- Click the copy button next to the shortened URL
- URL is automatically copied to clipboard
- Visual confirmation shows the copy was successful
- Can paste the URL anywhere (email, chat, documents)

### 4. PDF Download
**What it does:** Creates a downloadable PDF containing both the QR code and shortened URL
- PDF includes the QR code image in high quality
- Shortened URL text is displayed below the QR code
- PDF is formatted for easy printing
- File downloads immediately when button is clicked
- Perfect for business cards, flyers, or printed materials

## User Journey

1. **User visits the website** - sees a clean interface with input field
2. **User enters URL** - pastes or types their link in the text box
3. **User clicks Generate** - submits the form
4. **Results appear** - QR code and shortened URL display instantly
5. **User can copy URL** - clicks copy button to get shortened link
6. **User can download PDF** - clicks download to get printable version

## What makes this useful?

- **Quick and Simple** - No registration or complex setup required
- **Multiple Formats** - Get both digital (shortened URL) and physical (QR code) sharing options
- **Instant Results** - Everything generates immediately
- **Printable Output** - PDF format perfect for offline use
- **Mobile Friendly** - Works on phones, tablets, and computers
- **Free to Use** - No cost or limitations

## Example Use Cases

- **Business Cards** - Add QR code to direct people to your website
- **Event Flyers** - Include QR code for easy event registration
- **Social Media** - Share shortened URLs that are easier to read
- **Email Signatures** - Include QR code for your portfolio or contact info
- **Restaurant Menus** - QR code linking to online menu or ordering system
- **Real Estate** - QR codes on property signs linking to listing details

---
