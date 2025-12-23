import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Check if Supabase is configured
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== '' && 
  supabaseAnonKey !== ''
)

export const supabase: SupabaseClient | null = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null

// Helper to log Supabase operations
export function logSupabaseOperation(operation: string, success: boolean, data?: any, error?: any) {
  if (success) {
    console.log(`✅ Supabase ${operation} SUCCESS:`, data)
  } else {
    console.error(`❌ Supabase ${operation} FAILED:`, error)
  }
}

// Helper to ensure supabase is available
function getSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error('Supabase not configured. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.')
  }
  return supabase
}

export const db = {
  // Users CRUD
  users: {
    create: async (user: any) => {
      const client = getSupabase()
      const { data, error } = await client
        .from('users')
        .insert([user])
        .select()
      if (error) {
        logSupabaseOperation('users.create', false, null, error)
        throw error
      }
      logSupabaseOperation('users.create', true, data?.[0])
      return data?.[0]
    },

    findById: async (id: string) => {
      const client = getSupabase()
      const { data, error } = await client
        .from('users')
        .select('*')
        .eq('id', id)
        .single()
      if (error && error.code !== 'PGRST116') {
        logSupabaseOperation('users.findById', false, null, error)
        throw error
      }
      logSupabaseOperation('users.findById', true, data)
      return { data, error }
    },

    getByEmail: async (email: string) => {
      const client = getSupabase()
      const { data, error } = await client
        .from('users')
        .select('*')
        .eq('email', email)
        .single()
      if (error && error.code !== 'PGRST116') {
        logSupabaseOperation('users.getByEmail', false, null, error)
        throw error
      }
      logSupabaseOperation('users.getByEmail', true, data)
      return data
    },

    update: async (id: string, updates: any) => {
      const client = getSupabase()
      const { data, error } = await client
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
      if (error) {
        logSupabaseOperation('users.update', false, null, error)
        throw error
      }
      logSupabaseOperation('users.update', true, data?.[0])
      return data?.[0]
    },

    upsert: async (user: any) => {
      const client = getSupabase()
      const { data, error } = await client
        .from('users')
        .upsert([user], { onConflict: 'id' })
        .select()
      if (error) {
        logSupabaseOperation('users.upsert', false, null, error)
        throw error
      }
      logSupabaseOperation('users.upsert', true, data?.[0])
      return data?.[0]
    },
  },

  // Saved Locations CRUD
  locations: {
    create: async (location: any) => {
      const client = getSupabase()
      const { data, error } = await client
        .from('saved_locations')
        .insert([location])
        .select()
      if (error) {
        logSupabaseOperation('locations.create', false, null, error)
        throw error
      }
      logSupabaseOperation('locations.create', true, data?.[0])
      return data?.[0]
    },

    getAll: async (userId: string) => {
      const client = getSupabase()
      const { data, error } = await client
        .from('saved_locations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (error) {
        logSupabaseOperation('locations.getAll', false, null, error)
        throw error
      }
      logSupabaseOperation('locations.getAll', true, data)
      return data
    },

    getFavorites: async (userId: string) => {
      const client = getSupabase()
      const { data, error } = await client
        .from('saved_locations')
        .select('*')
        .eq('user_id', userId)
        .eq('is_favorite', true)
      if (error) {
        logSupabaseOperation('locations.getFavorites', false, null, error)
        throw error
      }
      logSupabaseOperation('locations.getFavorites', true, data)
      return data
    },

    update: async (id: string, updates: any) => {
      const client = getSupabase()
      const { data, error } = await client
        .from('saved_locations')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
      if (error) {
        logSupabaseOperation('locations.update', false, null, error)
        throw error
      }
      logSupabaseOperation('locations.update', true, data?.[0])
      return data?.[0]
    },

    delete: async (id: string) => {
      const client = getSupabase()
      const { error } = await client
        .from('saved_locations')
        .delete()
        .eq('id', id)
      if (error) {
        logSupabaseOperation('locations.delete', false, null, error)
        throw error
      }
      logSupabaseOperation('locations.delete', true)
    },

    toggleFavorite: async (id: string, isFavorite: boolean) => {
      return db.locations.update(id, { is_favorite: !isFavorite })
    },
  },

  // Weather History CRUD
  weatherHistory: {
    create: async (record: any) => {
      const client = getSupabase()
      const { data, error } = await client
        .from('weather_history')
        .insert([record])
        .select()
      if (error) {
        logSupabaseOperation('weatherHistory.create', false, null, error)
        throw error
      }
      logSupabaseOperation('weatherHistory.create', true, data?.[0])
      return data?.[0]
    },

    getByUser: async (userId: string, limit = 100) => {
      const client = getSupabase()
      const { data, error } = await client
        .from('weather_history')
        .select('*')
        .eq('user_id', userId)
        .order('searched_at', { ascending: false })
        .limit(limit)
      if (error) {
        logSupabaseOperation('weatherHistory.getByUser', false, null, error)
        throw error
      }
      logSupabaseOperation('weatherHistory.getByUser', true, data)
      return data
    },

    getByLocation: async (locationId: string, limit = 100) => {
      const client = getSupabase()
      const { data, error } = await client
        .from('weather_history')
        .select('*')
        .eq('location_id', locationId)
        .order('searched_at', { ascending: false })
        .limit(limit)
      if (error) {
        logSupabaseOperation('weatherHistory.getByLocation', false, null, error)
        throw error
      }
      logSupabaseOperation('weatherHistory.getByLocation', true, data)
      return data
    },

    delete: async (id: string) => {
      const client = getSupabase()
      const { error } = await client
        .from('weather_history')
        .delete()
        .eq('id', id)
      if (error) {
        logSupabaseOperation('weatherHistory.delete', false, null, error)
        throw error
      }
      logSupabaseOperation('weatherHistory.delete', true)
    },
  },

  // AI Insights CRUD
  aiInsights: {
    create: async (insight: any) => {
      const client = getSupabase()
      const { data, error } = await client
        .from('ai_insights')
        .insert([insight])
        .select()
      if (error) {
        logSupabaseOperation('aiInsights.create', false, null, error)
        throw error
      }
      logSupabaseOperation('aiInsights.create', true, data?.[0])
      return data?.[0]
    },

    getByUser: async (userId: string, limit = 50) => {
      const client = getSupabase()
      const { data, error } = await client
        .from('ai_insights')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)
      if (error) {
        logSupabaseOperation('aiInsights.getByUser', false, null, error)
        throw error
      }
      logSupabaseOperation('aiInsights.getByUser', true, data)
      return data
    },

    delete: async (id: string) => {
      const client = getSupabase()
      const { error } = await client
        .from('ai_insights')
        .delete()
        .eq('id', id)
      if (error) {
        logSupabaseOperation('aiInsights.delete', false, null, error)
        throw error
      }
      logSupabaseOperation('aiInsights.delete', true)
    },
  },

  // Testimonials CRUD
  testimonials: {
    create: async (testimonial: any) => {
      const client = getSupabase()
      const { data, error } = await client
        .from('testimonials')
        .insert([testimonial])
        .select()
      if (error) {
        logSupabaseOperation('testimonials.create', false, null, error)
        throw error
      }
      logSupabaseOperation('testimonials.create', true, data?.[0])
      return data?.[0]
    },

    getApproved: async () => {
      const client = getSupabase()
      const { data, error } = await client
        .from('testimonials')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
      if (error) {
        logSupabaseOperation('testimonials.getApproved', false, null, error)
        throw error
      }
      logSupabaseOperation('testimonials.getApproved', true, data)
      return data
    },

    getFeatured: async () => {
      const client = getSupabase()
      const { data, error } = await client
        .from('testimonials')
        .select('*')
        .eq('is_approved', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
      if (error) {
        logSupabaseOperation('testimonials.getFeatured', false, null, error)
        throw error
      }
      logSupabaseOperation('testimonials.getFeatured', true, data)
      return data
    },

    getByUser: async (userId: string) => {
      const client = getSupabase()
      const { data, error } = await client
        .from('testimonials')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (error) {
        logSupabaseOperation('testimonials.getByUser', false, null, error)
        throw error
      }
      logSupabaseOperation('testimonials.getByUser', true, data)
      return data
    },

    getById: async (id: string) => {
      const client = getSupabase()
      const { data, error } = await client
        .from('testimonials')
        .select('*')
        .eq('id', id)
        .single()
      if (error) {
        logSupabaseOperation('testimonials.getById', false, null, error)
        throw error
      }
      logSupabaseOperation('testimonials.getById', true, data)
      return data
    },

    update: async (id: string, updates: any) => {
      const client = getSupabase()
      const { data, error } = await client
        .from('testimonials')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
      if (error) {
        logSupabaseOperation('testimonials.update', false, null, error)
        throw error
      }
      logSupabaseOperation('testimonials.update', true, data?.[0])
      return data?.[0]
    },

    delete: async (id: string) => {
      const client = getSupabase()
      const { error } = await client
        .from('testimonials')
        .delete()
        .eq('id', id)
      if (error) {
        logSupabaseOperation('testimonials.delete', false, null, error)
        throw error
      }
      logSupabaseOperation('testimonials.delete', true)
    },
  },

  // Reviews CRUD
  reviews: {
    create: async (review: any) => {
      const client = getSupabase()
      const { data, error } = await client
        .from('reviews')
        .insert([review])
        .select()
      if (error) {
        logSupabaseOperation('reviews.create', false, null, error)
        throw error
      }
      logSupabaseOperation('reviews.create', true, data?.[0])
      return data?.[0]
    },

    getAll: async () => {
      if (!supabase) return []
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) {
        logSupabaseOperation('reviews.getAll', false, null, error)
        return []
      }
      logSupabaseOperation('reviews.getAll', true, data)
      return data || []
    },

    getByUser: async (userId: string) => {
      if (!supabase) return []
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (error) {
        logSupabaseOperation('reviews.getByUser', false, null, error)
        return []
      }
      logSupabaseOperation('reviews.getByUser', true, data)
      return data || []
    },

    update: async (id: string, updates: any) => {
      const client = getSupabase()
      const { data, error } = await client
        .from('reviews')
        .update(updates)
        .eq('id', id)
        .select()
      if (error) {
        logSupabaseOperation('reviews.update', false, null, error)
        throw error
      }
      logSupabaseOperation('reviews.update', true, data?.[0])
      return data?.[0]
    },

    delete: async (id: string) => {
      const client = getSupabase()
      const { error } = await client
        .from('reviews')
        .delete()
        .eq('id', id)
      if (error) {
        logSupabaseOperation('reviews.delete', false, null, error)
        throw error
      }
      logSupabaseOperation('reviews.delete', true)
    },
  },
}
