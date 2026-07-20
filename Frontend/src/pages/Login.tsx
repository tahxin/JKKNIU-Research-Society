import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Lock, Mail, UserRound } from 'lucide-react'
import { useAuth } from '../context/useAuth'

const Login = () => {
  const { isAuthenticated, login, register } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '', student_id: '', department: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  if (isAuthenticated) return <Navigate to="/profile" replace />

  const updateField = (field: keyof typeof form, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (mode === 'login') {
        await login(form.email || form.username, form.password)
      } else {
        await register(form)
      }
      navigate('/profile')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-block bg-primary-100 p-4 rounded-lg mb-4">
            <Lock className="text-primary-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Member Portal</h1>
          <p className="text-secondary-600">Sign in or create your JKKNIURS member profile.</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-6 rounded-lg bg-secondary-100 p-1">
          {(['login', 'register'] as const).map(item => (
            <button key={item} type="button" onClick={() => setMode(item)} className={`rounded-md py-2 text-sm font-semibold capitalize ${mode === item ? 'bg-white text-primary-700 shadow' : 'text-secondary-600'}`}>
              {item === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <Input icon={<UserRound size={20} />} label="Full Name" value={form.full_name} onChange={value => updateField('full_name', value)} required />
              <Input label="Username" value={form.username} onChange={value => updateField('username', value)} required />
            </>
          )}
          <Input icon={<Mail size={20} />} type="email" label="Email Address" value={form.email} onChange={value => updateField('email', value)} required />
          <Input icon={<Lock size={20} />} type="password" label="Password" value={form.password} onChange={value => updateField('password', value)} required />
          {mode === 'register' && (
            <>
              <Input label="Student ID (optional)" value={form.student_id} onChange={value => updateField('student_id', value)} />
              <Input label="Department (optional)" value={form.department} onChange={value => updateField('department', value)} />
            </>
          )}
          <button type="submit" disabled={isLoading} className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}

interface InputProps {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
  icon?: React.ReactNode
}

const Input = ({ label, value, onChange, type = 'text', required, icon }: InputProps) => (
  <div>
    <label className="block text-sm font-semibold text-secondary-900 mb-2">{label}</label>
    <div className="relative">
      {icon && <span className="absolute left-3 top-3.5 text-secondary-400">{icon}</span>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required} className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600`} />
    </div>
  </div>
)

export default Login
