'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import { User, Mail, MapPin, Heart, Bell, Thermometer, AlertTriangle, Save, X } from 'lucide-react'
import { haptics } from '@/lib/haptics'

interface UserProfile {
  id: string
  email: string
  name: string
  avatar_url?: string
  bio?: string
  location?: string
  allergies: string[]
  allergy_severity: 'mild' | 'moderate' | 'severe'
  temperature_preference: 'celsius' | 'fahrenheit'
  notification_preferences: {
    email: boolean
    allergy_alerts: boolean
    weather_updates: boolean
  }
  created_at: string
  updated_at: string
}

const ALLERGY_OPTIONS = [
  { value: 'pollen', label: '🌼 Pollen', description: 'Tree, grass, and flower pollen' },
  { value: 'grass', label: '🌾 Grass', description: 'Grass pollen allergies' },
  { value: 'tree_pollen', label: '🌳 Tree Pollen', description: 'Tree pollen allergies' },
  { value: 'ragweed', label: '🌿 Ragweed', description: 'Ragweed pollen' },
  { value: 'mold', label: '🍄 Mold', description: 'Mold and fungus spores' },
  { value: 'dust', label: '💨 Dust', description: 'Dust and dust mites' },
  { value: 'pollution', label: '🏭 Pollution', description: 'Air pollution sensitivity' },
  { value: 'humidity', label: '💧 Humidity', description: 'High humidity sensitivity' },
]

export default function ProfilePage() {
  const router = useRouter()
  const { user, session, isAuthenticated, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    allergies: [] as string[],
    allergy_severity: 'moderate' as 'mild' | 'moderate' | 'severe',
    temperature_preference: 'celsius' as 'celsius' | 'fahrenheit',
    notification_preferences: {
      email: true,
      allergy_alerts: true,
      weather_updates: false,
    }
  })

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/signin')
      return
    }

    if (isAuthenticated && user) {
      fetchProfile()
    }
  }, [user, isAuthenticated, authLoading, router])

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      const token = session?.access_token
      
      if (!token) {
        throw new Error('No authentication token')
      }
      
      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }

      const data = await response.json()
      setProfile(data.profile)
      setFormData({
        name: data.profile.name || '',
        bio: data.profile.bio || '',
        location: data.profile.location || '',
        allergies: data.profile.allergies || [],
        allergy_severity: data.profile.allergy_severity || 'moderate',
        temperature_preference: data.profile.temperature_preference || 'celsius',
        notification_preferences: data.profile.notification_preferences || {
          email: true,
          allergy_alerts: true,
          weather_updates: false,
        }
      })
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError('Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError('')
      setSuccess('')
      
      haptics.tap()

      const token = session?.access_token
      
      if (!token) {
        throw new Error('No authentication token')
      }

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const data = await response.json()
      setProfile(data.profile)
      setIsEditing(false)
      setSuccess('Profile updated successfully!')
      haptics.success()
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error updating profile:', err)
      setError('Failed to update profile')
      haptics.error()
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        allergies: profile.allergies || [],
        allergy_severity: profile.allergy_severity || 'moderate',
        temperature_preference: profile.temperature_preference || 'celsius',
        notification_preferences: profile.notification_preferences || {
          email: true,
          allergy_alerts: true,
          weather_updates: false,
        }
      })
    }
    setIsEditing(false)
    setError('')
    haptics.tap()
  }

  const toggleAllergy = (allergyValue: string) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergyValue)
        ? prev.allergies.filter(a => a !== allergyValue)
        : [...prev.allergies, allergyValue]
    }))
    haptics.tap()
  }

  if (authLoading || isLoading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-20">
            <div className="spinner text-4xl">⏳</div>
          </div>
        </div>
      </main>
    )
  }

  if (!profile) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="card">
            <p className="text-center text-red-300">Failed to load profile</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-strong-contrast mb-2">Profile Settings</h1>
          <p className="text-glass text-lg">Manage your account and preferences</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 rounded-lg bg-green-500 bg-opacity-20 border border-green-400 text-green-300 animate-fade-in">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500 bg-opacity-20 border border-red-400 text-red-300">
            {error}
          </div>
        )}

        {/* Profile Card */}
        <div className="card space-y-6">
          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            {!isEditing ? (
              <button
                onClick={() => {
                  setIsEditing(true)
                  haptics.tap()
                }}
                className="btn-primary px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-all"
              >
                ✏️ Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-6 py-2 bg-gray-500 hover:bg-gray-600 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <X size={18} />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn-primary px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <Save size={18} />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            )}
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-strong-contrast flex items-center gap-2">
              <User size={24} />
              Basic Information
            </h2>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-strong-contrast">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20 focus:border-opacity-40 outline-none text-white"
                  placeholder="Your name"
                />
              ) : (
                <p className="text-lg text-strong-contrast">{profile.name}</p>
              )}
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium mb-2 text-strong-contrast flex items-center gap-2">
                <Mail size={16} />
                Email Address
              </label>
              <p className="text-lg text-glass">{profile.email}</p>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium mb-2 text-strong-contrast">Bio</label>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-3 bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20 focus:border-opacity-40 outline-none text-white resize-none"
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              ) : (
                <p className="text-glass">{profile.bio || 'No bio added'}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-2 text-strong-contrast flex items-center gap-2">
                <MapPin size={16} />
                Location
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20 focus:border-opacity-40 outline-none text-white"
                  placeholder="City, Country"
                />
              ) : (
                <p className="text-glass">{profile.location || 'No location set'}</p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white border-opacity-20"></div>

          {/* Allergy Preferences */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-strong-contrast flex items-center gap-2">
              <Heart size={24} />
              Allergy Information
            </h2>

            <p className="text-glass text-sm">
              Help us provide personalized allergy alerts based on weather conditions
            </p>

            {/* Allergies */}
            <div>
              <label className="block text-sm font-medium mb-3 text-strong-contrast">
                Select Your Allergies
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ALLERGY_OPTIONS.map((allergy) => (
                  <button
                    key={allergy.value}
                    onClick={() => isEditing && toggleAllergy(allergy.value)}
                    disabled={!isEditing}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.allergies.includes(allergy.value)
                        ? 'border-blue-400 bg-blue-500 bg-opacity-20'
                        : 'border-white border-opacity-20 bg-white bg-opacity-5'
                    } ${isEditing ? 'hover:border-opacity-40 cursor-pointer' : 'cursor-default'}`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={formData.allergies.includes(allergy.value)}
                        onChange={() => {}}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-semibold text-strong-contrast">{allergy.label}</p>
                        <p className="text-sm text-glass">{allergy.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Allergy Severity */}
            {formData.allergies.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-3 text-strong-contrast flex items-center gap-2">
                  <AlertTriangle size={16} />
                  Allergy Severity
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['mild', 'moderate', 'severe'].map((severity) => (
                    <button
                      key={severity}
                      onClick={() => isEditing && setFormData({ ...formData, allergy_severity: severity as any })}
                      disabled={!isEditing}
                      className={`p-3 rounded-lg border-2 capitalize transition-all ${
                        formData.allergy_severity === severity
                          ? 'border-blue-400 bg-blue-500 bg-opacity-20'
                          : 'border-white border-opacity-20 bg-white bg-opacity-5'
                      } ${isEditing ? 'hover:border-opacity-40 cursor-pointer' : 'cursor-default'}`}
                    >
                      {severity}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-white border-opacity-20"></div>

          {/* Preferences */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-strong-contrast flex items-center gap-2">
              <Thermometer size={24} />
              Preferences
            </h2>

            {/* Temperature Unit */}
            <div>
              <label className="block text-sm font-medium mb-3 text-strong-contrast">
                Temperature Unit
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['celsius', 'fahrenheit'].map((unit) => (
                  <button
                    key={unit}
                    onClick={() => isEditing && setFormData({ ...formData, temperature_preference: unit as any })}
                    disabled={!isEditing}
                    className={`p-3 rounded-lg border-2 capitalize transition-all ${
                      formData.temperature_preference === unit
                        ? 'border-blue-400 bg-blue-500 bg-opacity-20'
                        : 'border-white border-opacity-20 bg-white bg-opacity-5'
                    } ${isEditing ? 'hover:border-opacity-40 cursor-pointer' : 'cursor-default'}`}
                  >
                    {unit === 'celsius' ? '°C Celsius' : '°F Fahrenheit'}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div>
              <label className="block text-sm font-medium mb-3 text-strong-contrast flex items-center gap-2">
                <Bell size={16} />
                Notification Preferences
              </label>
              <div className="space-y-3">
                {[
                  { key: 'email', label: 'Email Notifications', description: 'Receive updates via email' },
                  { key: 'allergy_alerts', label: 'Allergy Alerts', description: 'Get notified about allergy risks' },
                  { key: 'weather_updates', label: 'Weather Updates', description: 'Daily weather summaries' },
                ].map((pref) => (
                  <label
                    key={pref.key}
                    className={`flex items-center justify-between p-4 rounded-lg border border-white border-opacity-20 bg-white bg-opacity-5 ${
                      isEditing ? 'cursor-pointer hover:bg-opacity-10' : 'cursor-default'
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-strong-contrast">{pref.label}</p>
                      <p className="text-sm text-glass">{pref.description}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.notification_preferences[pref.key as keyof typeof formData.notification_preferences]}
                      onChange={(e) => isEditing && setFormData({
                        ...formData,
                        notification_preferences: {
                          ...formData.notification_preferences,
                          [pref.key]: e.target.checked
                        }
                      })}
                      disabled={!isEditing}
                      className="w-5 h-5"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="pt-6 border-t border-white border-opacity-20">
            <p className="text-sm text-glass">
              Member since {new Date(profile.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

