import { useEffect, useMemo, useState } from 'react'
import { fetchMyProfile, loginMember, MemberProfile, registerMember, updateMyProfile } from '../services/api'
import { AuthContext, AuthContextValue } from './authContextValue'
const TOKEN_KEY = 'jkkniurs_auth_token'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [profile, setProfile] = useState<MemberProfile | null>(null)
  const [isLoading, setIsLoading] = useState(Boolean(token))

  const persistSession = (nextToken: string, nextProfile: MemberProfile) => {
    localStorage.setItem(TOKEN_KEY, nextToken)
    setToken(nextToken)
    setProfile(nextProfile)
  }

  useEffect(() => {
    if (!token) {
      setIsLoading(false)
      return
    }

    fetchMyProfile(token)
      .then(setProfile)
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
        setProfile(null)
      })
      .finally(() => setIsLoading(false))
  }, [token])

  const value = useMemo<AuthContextValue>(() => ({
    token,
    profile,
    isAuthenticated: Boolean(token && profile),
    isLoading,
    async login(usernameOrEmail, password) {
      const response = await loginMember(usernameOrEmail, password)
      persistSession(response.token, response.profile)
    },
    async register(payload) {
      const response = await registerMember(payload)
      persistSession(response.token, response.profile)
    },
    logout() {
      localStorage.removeItem(TOKEN_KEY)
      setToken(null)
      setProfile(null)
    },
    async refreshProfile() {
      if (!token) return
      setProfile(await fetchMyProfile(token))
    },
    async saveProfile(payload) {
      if (!token) throw new Error('You must be logged in to edit your profile.')
      setProfile(await updateMyProfile(token, payload))
    },
  }), [token, profile, isLoading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

