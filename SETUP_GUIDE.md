# WeatherAI Setup Guide

This guide will walk you through setting up the WeatherAI application from scratch.

## Step 1: Prerequisites

Before starting, ensure you have:
- Node.js 18 or higher installed
- npm or yarn package manager
- Git installed on your machine
- A code editor (VS Code recommended)

Check your Node.js version:
```bash
node --version
npm --version
```

## Step 2: Clone and Install

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Weather-app
```

2. Install dependencies:
```bash
npm install
```

## Step 3: API Keys Setup

### OpenWeather API Key

1. Go to [https://openweathermap.org/api](https://openweathermap.org/api)
2. Click "Sign Up" and create a free account
3. After email verification, go to your API keys page
4. Copy your API key (you'll use it in Step 6)
5. Note: Free tier includes current weather and forecast

### Google Gemini AI API Key

1. Go to [Google AI Studio](https://aistudio.google.com)
2. Click "Get API Key" button
3. Create a new API key or select existing one
4. Copy and save it securely (you'll use it in Step 6)
5. The free tier includes generous usage limits for testing

### Google Places API Key (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable "Maps JavaScript API" and "Places API"
4. Create an API key credential
5. Restrict it to HTTP referrers with your domain

## Step 4: Supabase Setup

### Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Click "New Project"
4. Fill in project details:
   - Name: "Weather App" (or your choice)
   - Password: Create a strong password
   - Region: Choose closest to your location
5. Wait for project creation (2-3 minutes)

### Get Connection Details

1. Once created, go to Settings → API
2. Copy these values:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Create Database Tables

1. In Supabase dashboard, click "SQL Editor"
2. Click "New Query"
3. Copy and paste the entire contents of `database.sql` from the project root
4. Click "Run" to execute the SQL
5. You should see 3 tables created:
   - saved_locations
   - weather_history
   - ai_insights

## Step 5: Environment Configuration

1. In the project root, create a new file called `.env.local`:
```bash
touch .env.local
```

2. Copy the contents from `.env.example`:
```bash
cat .env.example > .env.local
```

3. Edit `.env.local` with your favorite editor and fill in all the values:

```
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key_here
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_api_key_here (optional)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 6: Development Server

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and go to:
```
http://localhost:3000
```

3. You should see the WeatherAI app loading

## Step 7: Test the Features

### Test Geolocation
1. The app will ask for location permission
2. Click "Allow" to get weather for your current location
3. If you don't allow, you can search for a city instead

### Test Search
1. Type a city name in the search bar
2. Select a city from the suggestions
3. Weather data should load immediately

### Test Save Location
1. Once weather loads, click the heart icon in the saved locations panel
2. Click "Add" to add the location manually (if needed)
3. Verify the location appears in your saved list

### Test AI Insights
1. Click "Generate AI Insight" button
2. Wait for Google Gemini AI to generate insights
3. You should see weather analysis and suggestions

### Test Responsive Design
1. Press F12 to open developer tools
2. Toggle device toolbar (mobile view)
3. Test on different screen sizes

## Step 8: Production Build

When ready to deploy:

```bash
npm run build
npm start
```

This creates an optimized production build.

## Deployment to Vercel

### Method 1: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow prompts and set environment variables when asked

### Method 2: Using GitHub Integration

1. Push your code to GitHub:
```bash
git add .
git commit -m "Initial WeatherAI app"
git push origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Set environment variables in project settings
6. Click "Deploy"

### Set Environment Variables in Vercel

In your Vercel project settings:

1. Go to Settings → Environment Variables
2. Add each variable from `.env.local`:
   - `NEXT_PUBLIC_OPENWEATHER_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel domain)

3. Redeploy after adding variables

## Troubleshooting

### Issue: "Cannot find module 'next'"
**Solution**: Run `npm install` again

### Issue: Environment variables not loading
**Solution**:
- Restart dev server after creating `.env.local`
- Ensure file name is exactly `.env.local`
- Check for typos in variable names

### Issue: Weather API returning 401 error
**Solution**:
- Verify OpenWeather API key is correct
- Check API key is valid (sign in to OpenWeather dashboard)
- Ensure API key hasn't expired

### Issue: Database connection error
**Solution**:
- Verify Supabase URL and Anon Key in `.env.local`
- Check internet connection
- Ensure Supabase project is active

### Issue: AI insights not generating
**Solution**:
- Verify Google Gemini API key is correct
- Ensure Gemini API is enabled in your Google Cloud project
- Look at browser console for error messages
- Check you have quota remaining in Google AI Studio

### Issue: Geolocation not working
**Solution**:
- Check if browser permission is granted
- Some browsers require HTTPS for geolocation
- Try on different browser
- Use search to manually find location

## Next Steps

1. **Customize**: Modify colors in `tailwind.config.ts`
2. **Add Features**: Build on existing components
3. **Optimize**: Add caching and PWA features
4. **Monetize**: Add premium features or ads
5. **Scale**: Consider adding user authentication

## Getting Help

- Check console.log() in browser (F12)
- Review error messages in terminal
- Consult the README.md for architecture details
- Check individual component comments for implementation details

## Security Notes

1. **Never** commit `.env.local` to git
2. **Always** use environment variables for secrets
3. Keep API keys in `.gitignore`
4. Rotate API keys periodically
5. Monitor API usage for unexpected spikes

---

Congratulations! You should now have a fully functional WeatherAI application running locally. Happy weather forecasting! 🌦️
