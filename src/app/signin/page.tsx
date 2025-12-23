'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Cloud, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { haptics } from '@/lib/haptics'

export default function SignIn() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  
  // Get auth hook
  const { signIn } = useAuth()
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!mounted) return
    
    setIsLoading(true)
    setError('')
    
    haptics.tap()

    try {
      await signIn(formData.email, formData.password)
      haptics.success()
      router.push('/')
    } catch (err: any) {
      console.error('Sign in error:', err)
      setError(err.message || 'Failed to sign in. Please check your credentials.')
      haptics.error()
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 page-transition">
      <div className="max-w-md w-full bounce-on-load">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white mb-4">
            <Cloud size={40} />
            <span className="text-3xl font-bold">WeatherApp</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white opacity-80">Sign in to your account</p>
        </div>

        {/* Sign In Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500 bg-opacity-20 border border-red-400 text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-60" size={20} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20 focus:border-opacity-40 outline-none text-white placeholder-gray-300"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-60" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-11 pr-11 py-3 bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20 focus:border-opacity-40 outline-none text-white placeholder-gray-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => {
                    haptics.tap()
                    setShowPassword(!showPassword)
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span>Remember me</span>
              </label>
              <Link href="#" className="text-blue-300 hover:text-blue-200">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="spinner inline-block w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></span>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-white opacity-20"></div>
            <span className="text-sm opacity-60">OR</span>
            <div className="flex-1 h-px bg-white opacity-20"></div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-300 hover:text-blue-200 font-bold">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-white opacity-80 hover:opacity-100 text-sm">
            ← Back to Weather App
          </Link>
        </div>
      </div>
    </div>
  )
}
