# Google Analytics 4 Setup Guide

## Step 1: Get Your GA4 Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property or select an existing one
3. Go to **Admin** → **Data Streams** → Select your web stream
4. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

## Step 2: Add to Environment Variables

Create a `.env` file in the root directory:

```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

## Step 3: Restart Development Server

After adding the environment variable, restart your development server:

```bash
npm run dev
```

## What's Being Tracked?

The analytics integration automatically tracks:

- **Page Views**: Initial page load and section views
- **Button Clicks**: All CTA buttons (Download Resume, View My Work, Contact Me)
- **Downloads**: Resume downloads
- **Section Views**: When users scroll to different sections
- **Form Submissions**: Contact form submissions (success/error)

## Testing

1. Open your browser's Developer Tools
2. Go to the Network tab
3. Filter by "gtag" or "collect"
4. Interact with your site - you should see analytics requests being sent

## Privacy Note

This implementation respects user privacy and only tracks interactions. No personal data is collected.

