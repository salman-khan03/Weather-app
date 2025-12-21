# WeatherAI - AI-Powered Weather App

A modern, full-stack weather application built with React, TypeScript, Tailwind CSS, and integrated with Claude AI for intelligent weather insights. Features include saved locations, weather history, and CRUD operations powered by Supabase.

## Features

- 🌤️ **Real-time Weather Data** - Get accurate weather forecasts using OpenWeather API
- 🤖 **AI-Powered Insights** - Claude AI generates personalized weather insights and recommendations
- 💾 **Saved Locations** - Save and manage multiple locations with favorite markers
- 📊 **Weather History** - Track weather history for your saved locations
- 📱 **Responsive Design** - Beautiful, mobile-friendly UI with Tailwind CSS
- 🔄 **CRUD Operations** - Full database integration with Supabase
- ⚡ **Fast & Modern** - Built with Next.js 14 for optimal performance

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Next.js 14
- **State Management**: Zustand
- **API Integration**: Axios
- **Database**: Supabase (PostgreSQL)
- **AI**: Claude API (Anthropic)
- **Weather Data**: OpenWeather API
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenWeather API key
- Anthropic API key (for Claude AI)
- Google Places API key (optional, for location autocomplete)

## Environment Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd Weather-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file based on `.env.example`:
```bash
cp .env.example .env.local
```

4. Fill in your environment variables:
```
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_anthropic_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)

2. In the Supabase SQL Editor, run the contents of `database.sql` to create tables and indexes:
   - `saved_locations` - Store user's saved weather locations
   - `weather_history` - Track historical weather data
   - `ai_insights` - Store AI-generated insights

3. Copy your Supabase URL and anon key to `.env.local`

## API Keys Setup

### OpenWeather API
1. Sign up at [openweathermap.org](https://openweathermap.org)
2. Generate an API key
3. Add to `NEXT_PUBLIC_OPENWEATHER_API_KEY`

### Claude AI (Anthropic)
1. Create account at [console.anthropic.com](https://console.anthropic.com)
2. Generate an API key
3. Add to `ANTHROPIC_API_KEY` (kept secure on server side)

### Google Places API (Optional)
1. Enable Maps and Places APIs in Google Cloud Console
2. Generate API key
3. Add to `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY`

## Running the App

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

## Project Structure

```
Weather-app/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── locations/    # Location CRUD endpoints
│   │   │   ├── history/      # Weather history endpoints
│   │   │   └── weather/      # Weather and AI insight endpoints
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Main page
│   │   └── globals.css       # Global styles
│   ├── components/           # React components
│   │   ├── Header.tsx
│   │   ├── CurrentWeather.tsx
│   │   ├── WeatherDetails.tsx
│   │   ├── ForecastCard.tsx
│   │   ├── SearchBar.tsx
│   │   ├── SavedLocations.tsx
│   │   └── AIInsight.tsx
│   ├── lib/
│   │   ├── api.ts           # Weather API client
│   │   ├── supabase.ts      # Database operations
│   │   └── ai.ts            # AI service (Claude)
│   ├── store/
│   │   └── weatherStore.ts  # Zustand state management
│   └── types/
│       └── index.ts         # TypeScript type definitions
├── database.sql             # Database schema
├── package.json
├── tailwind.config.ts
├── next.config.js
└── tsconfig.json
```

## Key Features Implementation

### 1. Weather Display
- Current weather with real-time data
- 5-day forecast
- 24-hour hourly forecast
- Weather alerts

### 2. Location Management (CRUD)
- Save multiple locations
- Mark favorites
- Edit location details
- Delete locations
- Quick location switching

### 3. AI Insights
- Claude-generated weather analysis
- Smart activity recommendations
- Personalized suggestions based on conditions
- Weather trend analysis

### 4. Database Integration
- Persistent data storage with Supabase
- Weather history tracking
- User preferences
- Audit trail of AI insights

### 5. Responsive Design
- Mobile-first approach
- Gradient UI with glassmorphism
- Touch-friendly interfaces
- Optimized for all screen sizes

## API Endpoints

### Locations
- `GET /api/locations` - Get all saved locations
- `POST /api/locations` - Create new location
- `GET /api/locations/[id]` - Get specific location
- `PUT /api/locations/[id]` - Update location
- `DELETE /api/locations/[id]` - Delete location

### Weather History
- `GET /api/history` - Get weather history
- `POST /api/history` - Record weather

### AI Insights
- `POST /api/weather/insight` - Generate AI insight

## Deployment to Vercel

1. Push code to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Import project to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set environment variables in Vercel dashboard
   - Deploy

3. Set environment variables in Vercel:
   - `NEXT_PUBLIC_OPENWEATHER_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ANTHROPIC_API_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel domain)

## Usage

1. **Get Weather**: The app automatically fetches weather for your current location
2. **Search**: Use the search bar to find different cities
3. **Save Location**: Click on locations to save them for quick access
4. **AI Insights**: Click "Generate AI Insight" for smart recommendations
5. **View History**: Check past weather records in your saved locations
6. **Manage**: Edit or delete saved locations with one click

## Performance Optimizations

- Next.js Image optimization
- Code splitting and lazy loading
- Efficient state management with Zustand
- Database indexes for fast queries
- Caching strategies for API calls

## Security Considerations

- API keys kept in environment variables
- Supabase Row-Level Security (RLS) can be enabled
- HTTPS enforced on Vercel
- Input validation on API routes
- No sensitive data in client-side code

## Troubleshooting

### Weather API not working
- Verify OpenWeather API key is valid
- Check API usage limits
- Ensure coordinates are correct

### Database connection issues
- Verify Supabase credentials in `.env.local`
- Check database tables exist (run database.sql)
- Ensure RLS policies allow access if enabled

### AI insights not generating
- Check Anthropic API key is valid
- Verify API usage quota
- Check error logs in browser console

## Future Enhancements

- User authentication and profiles
- Weather alerts and notifications
- Integration with smart home devices
- Multiple language support
- Dark/light theme toggle
- Export weather reports
- Community weather observations
- Advanced weather analytics

## Contributing

Contributions are welcome! Please follow the existing code style and submit pull requests.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please open an issue on GitHub or contact the development team.

---

Built with ❤️ using React, TypeScript, and AI