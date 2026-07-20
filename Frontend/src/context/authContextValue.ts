import { createContext } from 'react'
import { MemberProfile, RegisterPayload } from '../services/api'

export interface AuthContextValue {
  token: string | null
  profile: MemberProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (usernameOrEmail: string, password: string) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
  refreshProfile: () => Promise<void>
  saveProfile: (payload: Partial<MemberProfile>) => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
