-- Create saved_locations table
CREATE TABLE IF NOT EXISTS saved_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  country TEXT,
  lat DECIMAL(10, 8) NOT NULL,
  lon DECIMAL(11, 8) NOT NULL,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, lat, lon)
);

-- Create weather_history table
CREATE TABLE IF NOT EXISTS weather_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  location_id UUID REFERENCES saved_locations(id) ON DELETE CASCADE,
  temperature DECIMAL(5, 2) NOT NULL,
  condition TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ai_insights table
CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  location_id UUID REFERENCES saved_locations(id) ON DELETE CASCADE,
  insight TEXT NOT NULL,
  suggestions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_saved_locations_user_id ON saved_locations(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_locations_is_favorite ON saved_locations(is_favorite);
CREATE INDEX IF NOT EXISTS idx_weather_history_user_id ON weather_history(user_id);
CREATE INDEX IF NOT EXISTS idx_weather_history_location_id ON weather_history(location_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_user_id ON ai_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_location_id ON ai_insights(location_id);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE saved_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

-- Create policies (optional - adjust based on your auth setup)
-- CREATE POLICY "Users can view their own saved locations"
--   ON saved_locations FOR SELECT
--   USING (auth.uid()::text = user_id);

-- CREATE POLICY "Users can insert their own saved locations"
--   ON saved_locations FOR INSERT
--   WITH CHECK (auth.uid()::text = user_id);

-- CREATE POLICY "Users can update their own saved locations"
--   ON saved_locations FOR UPDATE
--   USING (auth.uid()::text = user_id);

-- CREATE POLICY "Users can delete their own saved locations"
--   ON saved_locations FOR DELETE
--   USING (auth.uid()::text = user_id);
