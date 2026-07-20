import { Navigate } from 'react-router-dom'
import { Save, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { MemberProfile } from '../services/api'
import { useAuth } from '../context/useAuth'

const editableFields: Array<keyof Pick<MemberProfile, 'full_name' | 'student_id' | 'department' | 'research_interests' | 'bio' | 'phone' | 'location' | 'linkedin' | 'github' | 'website'>> = [
  'full_name', 'student_id', 'department', 'research_interests', 'bio', 'phone', 'location', 'linkedin', 'github', 'website'
]

const Profile = () => {
  const { profile, isAuthenticated, isLoading, saveProfile, logout } = useAuth()
  const [draft, setDraft] = useState<Partial<MemberProfile>>({})
  const [message, setMessage] = useState('')

  useEffect(() => { if (profile) setDraft(profile) }, [profile])

  if (!isLoading && !isAuthenticated) return <Navigate to="/login" replace />
  if (!profile) return <div className="min-h-screen pt-28 text-center">Loading profile...</div>

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await saveProfile(draft)
    setMessage('Profile updated successfully.')
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-24 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-primary-700 p-8 text-white flex items-center gap-4">
          <div className="bg-white/15 p-4 rounded-full"><UserRound size={36} /></div>
          <div>
            <h1 className="text-3xl font-bold">{profile.full_name}</h1>
            <p className="text-primary-100">{profile.email} · @{profile.username}</p>
          </div>
          <button onClick={logout} className="ml-auto bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg">Logout</button>
        </div>
        <form onSubmit={submit} className="p-8 grid md:grid-cols-2 gap-5">
          {editableFields.map(field => (
            <label key={field} className={field === 'bio' || field === 'research_interests' ? 'md:col-span-2' : ''}>
              <span className="block text-sm font-semibold text-secondary-900 mb-2 capitalize">{field.replace('_', ' ')}</span>
              {field === 'bio' || field === 'research_interests' ? (
                <textarea rows={4} value={String(draft[field] || '')} onChange={e => setDraft(prev => ({ ...prev, [field]: e.target.value }))} className="w-full border border-secondary-300 rounded-lg p-3 focus:outline-none focus:border-primary-600" />
              ) : (
                <input value={String(draft[field] || '')} onChange={e => setDraft(prev => ({ ...prev, [field]: e.target.value }))} className="w-full border border-secondary-300 rounded-lg p-3 focus:outline-none focus:border-primary-600" />
              )}
            </label>
          ))}
          {message && <p className="md:col-span-2 text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">{message}</p>}
          <button className="md:col-span-2 btn-primary flex items-center justify-center gap-2"><Save size={18} /> Save Profile</button>
        </form>
      </div>
    </div>
  )
}

export default Profile
