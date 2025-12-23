// User Management - Generate and store proper UUIDs
export function getUserId(): string {
  let userId = localStorage.getItem('weatherapp_user_id')
  
  if (!userId) {
    // Generate a valid UUID v4
    userId = generateUUID()
    localStorage.setItem('weatherapp_user_id', userId)
    console.log('Generated new user ID:', userId)
  }
  
  return userId
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export function getUser() {
  const userData = localStorage.getItem('weatherapp_user')
  const userId = getUserId()
  
  if (userData) {
    const user = JSON.parse(userData)
    return {
      ...user,
      id: userId // Ensure we always have a valid UUID
    }
  }
  
  return {
    id: userId,
    email: `user_${userId.substring(0, 8)}@weatherapp.local`,
    name: 'Guest User'
  }
}
