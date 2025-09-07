# Custom Domain Link Shortener Deployment Guide

This guide will help you deploy your QR Generator with custom link shortening using your `qubex.it` domain for **FREE**.

## Overview

Your link shortener will work like this:
- Original URL: `https://example.com/very/long/url`
- Shortened URL: `https://qubex.it/AbC123X`
- When someone visits `qubex.it/AbC123X`, they get redirected to the original URL

## Step 1: Deploy to Vercel (Free)

### 1.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 1.2 Login to Vercel
```bash
vercel login
```

### 1.3 Deploy Your Project
```bash
# From your project directory
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your personal account
- **Link to existing project?** → No
- **Project name?** → `qubex-shortener` (or any name you prefer)
- **Directory?** → `./` (current directory)
- **Override settings?** → No

### 1.4 Set Up Vercel KV Database (Free)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Go to **Storage** tab
4. Click **Create Database**
5. Select **KV** (Key-Value store)
6. Name it `qubex-links`
7. Click **Create**

The KV database will automatically be linked to your project.

## Step 2: Configure Your Domain (GoDaddy)

### 2.1 Get Your Vercel Domain
After deployment, Vercel will give you a domain like: `qubex-shortener.vercel.app`

### 2.2 Configure DNS in GoDaddy

1. Login to your GoDaddy account
2. Go to **My Products** → **DNS**
3. Find your `qubex.it` domain and click **DNS**

### 2.3 Add DNS Records

Add these records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | @ | qubex-shortener.vercel.app | 1 Hour |
| CNAME | www | qubex-shortener.vercel.app | 1 Hour |

**Note:** Replace `qubex-shortener.vercel.app` with your actual Vercel domain.

### 2.4 Add Domain to Vercel

1. In your Vercel dashboard, go to your project
2. Click **Settings** → **Domains**
3. Add `qubex.it` and `www.qubex.it`
4. Vercel will verify the DNS configuration

## Step 3: Environment Setup

### 3.1 Install Dependencies
```bash
npm install
```

### 3.2 Test Locally
```bash
npm run dev
```

Visit `http://localhost:3000` and test the QR generator.

## Step 4: Verify Deployment

### 4.1 Test URL Shortening
1. Go to your deployed site: `https://qubex.it`
2. Enter a URL and generate a QR code
3. You should get a shortened URL like: `https://qubex.it/AbC123X`

### 4.2 Test Redirection
1. Visit the shortened URL
2. You should be redirected to the original URL

## Step 5: Custom Configuration (Optional)

### 5.1 Customize Short Code Length
Edit `api/shorten.js`, line 5:
```javascript
function generateShortCode(length = 7) { // Change 7 to your preferred length
```

### 5.2 Add Analytics (Optional)
You can add Google Analytics or other tracking to monitor link clicks.

## Troubleshooting

### DNS Not Working
- DNS changes can take up to 48 hours to propagate
- Use [whatsmydns.net](https://whatsmydns.net) to check propagation
- Ensure CNAME records point to your Vercel domain

### API Errors
- Check Vercel function logs in your dashboard
- Ensure KV database is properly connected
- Verify environment variables are set

### CORS Issues
- The API includes CORS headers for cross-origin requests
- If issues persist, check browser console for specific errors

## Cost Breakdown (All FREE!)

| Service | Free Tier Limits |
|---------|------------------|
| Vercel Hosting | 100GB bandwidth/month |
| Vercel KV Database | 30,000 requests/month |
| Domain (qubex.it) | Already owned |
| **Total Monthly Cost** | **$0** |

## Security Features

- URL validation to prevent malicious links
- Rate limiting through Vercel's built-in protections
- Secure random short code generation
- HTTPS encryption for all requests

## Maintenance

- Monitor usage in Vercel dashboard
- KV database automatically handles cleanup
- No server maintenance required (serverless)

## Next Steps

1. **Custom Analytics**: Add click tracking
2. **Bulk Shortening**: API endpoint for multiple URLs
3. **Custom Aliases**: Allow users to choose custom short codes
4. **Expiration**: Add TTL for links
5. **Admin Panel**: Manage and view all shortened links

## Support

If you encounter issues:
1. Check Vercel function logs
2. Verify DNS configuration
3. Test API endpoints directly
4. Check browser console for errors

Your custom link shortener is now ready! 🎉
