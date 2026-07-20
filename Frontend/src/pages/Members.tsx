import { useEffect, useState } from 'react'
import { Github, Globe, Linkedin, MapPin, UserRound } from 'lucide-react'
import { fetchMemberProfiles, MemberProfile } from '../services/api'

const Members = () => {
  const [members, setMembers] = useState<MemberProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMemberProfiles().then(setMembers).catch(() => setMembers([])).finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">Member Profiles</h1>
          <p className="text-secondary-600 max-w-2xl mx-auto">Explore individual JKKNIURS member profiles, research interests, and professional links.</p>
        </div>
        {isLoading ? <p className="text-center">Loading members...</p> : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map(member => (
              <article key={member.id} className="bg-white rounded-xl shadow-lg p-6 border border-secondary-100">
                <div className="flex items-center gap-4 mb-4">
                  {member.avatar_url ? <img src={member.avatar_url} alt={member.full_name} className="w-16 h-16 rounded-full object-cover" /> : <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center"><UserRound size={30} /></div>}
                  <div>
                    <h2 className="text-xl font-bold text-secondary-900">{member.full_name}</h2>
                    <p className="text-sm text-secondary-500">{member.department || 'JKKNIURS Member'}</p>
                  </div>
                </div>
                {member.location && <p className="flex items-center gap-2 text-sm text-secondary-600 mb-3"><MapPin size={16} />{member.location}</p>}
                {member.bio && <p className="text-secondary-700 mb-4">{member.bio}</p>}
                {member.research_interests && <p className="text-sm bg-primary-50 text-primary-800 rounded-lg p-3 mb-4"><strong>Research:</strong> {member.research_interests}</p>}
                <div className="flex gap-3 text-primary-700">
                  {member.linkedin && <a href={member.linkedin} aria-label="LinkedIn" target="_blank" rel="noreferrer"><Linkedin size={20} /></a>}
                  {member.github && <a href={member.github} aria-label="GitHub" target="_blank" rel="noreferrer"><Github size={20} /></a>}
                  {member.website && <a href={member.website} aria-label="Website" target="_blank" rel="noreferrer"><Globe size={20} /></a>}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Members
