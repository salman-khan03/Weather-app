import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const db = {
  // Saved Locations CRUD
  locations: {
    create: async (location: any) => {
      const { data, error } = await supabase
        .from('saved_locations')
        .insert([location])
        .select()
      if (error) throw error
      return data
    },

    getAll: async (userId: string) => {
      const { data, error } = await supabase
        .from('saved_locations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },

    getFavorites: async (userId: string) => {
      const { data, error } = await supabase
        .from('saved_locations')
        .select('*')
        .eq('user_id', userId)
        .eq('is_favorite', true)
      if (error) throw error
      return data
    },

    update: async (id: string, updates: any) => {
      const { data, error } = await supabase
        .from('saved_locations')
        .update(updates)
        .eq('id', id)
        .select()
      if (error) throw error
      return data
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('saved_locations')
        .delete()
        .eq('id', id)
      if (error) throw error
    },

    toggleFavorite: async (id: string, isFavorite: boolean) => {
      return db.locations.update(id, { is_favorite: !isFavorite })
    },
  },

  // Weather History CRUD
  weatherHistory: {
    create: async (record: any) => {
      const { data, error } = await supabase
        .from('weather_history')
        .insert([record])
        .select()
      if (error) throw error
      return data
    },

    getByLocation: async (locationId: string, limit = 30) => {
      const { data, error } = await supabase
        .from('weather_history')
        .select('*')
        .eq('location_id', locationId)
        .order('created_at', { ascending: false })
        .limit(limit)
      if (error) throw error
      return data
    },

    getByUser: async (userId: string, limit = 100) => {
      const { data, error } = await supabase
        .from('weather_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)
      if (error) throw error
      return data
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('weather_history')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
  },

  // AI Insights CRUD
  aiInsights: {
    create: async (insight: any) => {
      const { data, error } = await supabase
        .from('ai_insights')
        .insert([insight])
        .select()
      if (error) throw error
      return data
    },

    getByLocation: async (locationId: string) => {
      const { data, error } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('location_id', locationId)
        .order('created_at', { ascending: false })
        .limit(1)
      if (error) throw error
      return data?.[0]
    },

    getByUser: async (userId: string) => {
      const { data, error } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('ai_insights')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
  },
}
