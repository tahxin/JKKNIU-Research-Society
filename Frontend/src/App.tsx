import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import ResearchAreas from './pages/ResearchAreas'
import Events from './pages/Events'
import EventDetails from './pages/EventDetails'
import EventRegistration from './pages/EventRegistration'
import Publications from './pages/Publications'
import News from './pages/News'
import AdvisoryBoard from './pages/AdvisoryBoard'
import Team from './pages/Team'
import Membership from './pages/Membership'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Members from './pages/Members'
import Recruitment from './pages/Recruitment'
import YoungResearcherForm from './components/YoungResearcherForm'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/research-areas" element={<ResearchAreas />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:slug" element={<EventDetails />} />
          <Route path="/events/:slug/register" element={<EventRegistration />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/news" element={<News />} />
          <Route path="/advisory-board" element={<AdvisoryBoard />} />
          <Route path="/team" element={<Team />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/members" element={<Members />} />
          <Route path="/recruitment" element={<Recruitment />} />
          <Route path="/events/recruitment" element={<Recruitment />} />
          <Route path="/events/recruitemets/special" element={
            <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 py-12 px-4">
              <YoungResearcherForm />
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App