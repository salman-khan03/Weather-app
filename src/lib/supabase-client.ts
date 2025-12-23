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

// Create Supabase client with auth persistence
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

// Auth helpers
export const auth = {
  async signUp(email: string, password: string, name: string) {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    })
    
    if (error) {
      logSupabaseOperation('signUp', false, null, error)
      throw error
    }
    
    // Create user record in the users table
    if (data.user) {
      try {
        const { error: insertError } = await supabase
          .from('users')
          .insert([{
            id: data.user.id,
            email: data.user.email,
            name: name,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
        
        if (insertError && insertError.code !== '23505') { // Ignore duplicate key error
          console.warn('Could not create user record:', insertError)
        }
      } catch (err) {
        console.warn('Could not create user record:', err)
      }
    }
    
    logSupabaseOperation('signUp', true, data)
    return data
  },

  async signIn(email: string, password: string) {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      logSupabaseOperation('signIn', false, null, error)
      throw error
    }
    
    // Ensure user record exists in users table
    if (data.user) {
      try {
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('id', data.user.id)
          .single()
        
        if (!existingUser) {
          await supabase
            .from('users')
            .insert([{
              id: data.user.id,
              email: data.user.email,
              name: data.user.user_metadata?.name || email.split('@')[0],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }])
        }
      } catch (err) {
        console.warn('Could not verify user record:', err)
      }
    }
    
    logSupabaseOperation('signIn', true, data)
    return data
  },

  async signOut() {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      logSupabaseOperation('signOut', false, null, error)
      throw error
    }
    
    logSupabaseOperation('signOut', true)
  },

  async getUser() {
    if (!supabase) return null
    
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      logSupabaseOperation('getUser', false, null, error)
      return null
    }
    
    return user
  },

  async getSession() {
    if (!supabase) return null
    
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      logSupabaseOperation('getSession', false, null, error)
      return null
    }
    
    return session
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } }
    
    return supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔐 Auth state changed:', event, session?.user?.email)
      callback(event, session)
    })
  }
}
