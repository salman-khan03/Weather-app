'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Cloud, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { haptics } from '@/lib/haptics'

export default function SignUp() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [mounted, setMounted] = useState(false)
  
  // Get auth hook
  const { signUp } = useAuth()
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!mounted) return
    
    setIsLoading(true)
    setError('')
    setSuccess('')
    
    haptics.tap()

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      haptics.error()
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      haptics.error()
      setIsLoading(false)
      return
    }

    try {
      await signUp(formData.email, formData.password, formData.name)
      haptics.success()
      setSuccess('Account created successfully! Please check your email to verify your account.')
      setTimeout(() => {
        router.push('/signin')
      }, 2000)
    } catch (err: any) {
      console.error('Sign up error:', err)
      setError(err.message || 'Failed to create account. Please try again.')
      haptics.error()
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-8 page-transition">
      <div className="max-w-md w-full bounce-on-load">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white mb-4 hover:scale-105 transition-transform">
            <Cloud size={40} />
            <span className="text-3xl font-bold">WeatherApp</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-white opacity-80">Join us to track weather anywhere</p>
        </div>

        {/* Sign Up Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500 bg-opacity-20 border border-red-400 text-red-300 text-sm animate-shake">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-3 rounded-lg bg-green-500 bg-opacity-20 border border-green-400 text-green-300 text-sm">
                {success}
              </div>
            )}

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium mb-2 text-strong-contrast">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-60" size={20} />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field w-full pl-11 pr-4 py-3 bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20 focus:border-opacity-40 outline-none text-white placeholder-gray-300"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium mb-2 text-strong-contrast">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-60" size={20} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field w-full pl-11 pr-4 py-3 bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20 focus:border-opacity-40 outline-none text-white placeholder-gray-300"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium mb-2 text-strong-contrast">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-60" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field w-full pl-11 pr-11 py-3 bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20 focus:border-opacity-40 outline-none text-white placeholder-gray-300"
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

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium mb-2 text-strong-contrast">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-60" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="input-field w-full pl-11 pr-11 py-3 bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20 focus:border-opacity-40 outline-none text-white placeholder-gray-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => {
                    haptics.tap()
                    setShowConfirmPassword(!showConfirmPassword)
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="text-sm">
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" className="mt-1 rounded" required />
                <span className="opacity-80 text-strong-contrast">
                  I agree to the{' '}
                  <Link href="/about" className="text-blue-300 hover:text-blue-200">
                    Terms & Conditions
                  </Link>{' '}
                  and{' '}
                  <Link href="/about" className="text-blue-300 hover:text-blue-200">
                    Privacy Policy
                  </Link>
                </span>
              </label>
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
                  Creating Account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-white opacity-20"></div>
            <span className="text-sm opacity-60">OR</span>
            <div className="flex-1 h-px bg-white opacity-20"></div>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-sm text-strong-contrast">
            Already have an account?{' '}
            <Link href="/signin" className="text-blue-300 hover:text-blue-200 font-bold transition-colors">
              Sign In
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-white opacity-80 hover:opacity-100 text-sm transition-opacity">
            ← Back to Weather App
          </Link>
        </div>
      </div>
    </div>
  )
}
