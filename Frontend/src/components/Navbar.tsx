import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { Menu, X } from 'lucide-react'

type NavbarTheme = 'dark' | 'light' | 'transparent'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<NavbarTheme>('transparent')
  const location = useLocation()
  const { isAuthenticated, profile } = useAuth()

  // Check if we're on a page (not home)
  const isOnSubPage = location.pathname !== '/'

  // Detect scroll position and current section
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 100)

      // If at top of page (hero section), keep transparent (only on home page)
      if (scrollY < 100 && !isOnSubPage) {
        setCurrentTheme('transparent')
        return
      }

      // Find which section is currently in view
      const sections = document.querySelectorAll('section[data-navbar-theme]')
      let foundTheme: NavbarTheme = 'dark' // default when scrolled

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        // Check if section is at the top of viewport
        if (rect.top <= 80 && rect.bottom > 80) {
          const theme = section.getAttribute('data-navbar-theme') as NavbarTheme
          foundTheme = theme || 'dark'
        }
      })

      setCurrentTheme(foundTheme)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isOnSubPage])

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    // { name: 'Research Areas', href: '/research-areas' },
    { name: 'Events', href: '/events' },
    { name: 'Publications', href: '/publications' },
    { name: 'News', href: '/news' },
    { name: 'Advisory Board', href: '/advisory-board' },
    { name: 'Our Team', href: '/team' },
    { name: 'Members', href: '/members' },
    // { name: 'Membership', href: '/membership' },
    { name: 'Contact', href: '/contact' },
  ]

  const isActive = (href: string) => location.pathname === href

  // Check if any nav item is active (for full navbar color)
  const hasActiveItem = navigation.some(item => isActive(item.href))

  // Dynamic styles based on theme
  const getNavbarStyles = () => {
    // If on sub page or scrolled, show solid background
    if (isOnSubPage || isScrolled) {
      // Use blue background when a nav item is active
      if (hasActiveItem && isScrolled) {
        return 'bg-primary-700/95 backdrop-blur-md shadow-lg'
      }

      switch (currentTheme) {
        case 'light':
          return 'bg-white/95 backdrop-blur-md shadow-lg'
        case 'dark':
          return 'bg-primary-800/95 backdrop-blur-md shadow-lg'
        default:
          return 'bg-primary-800/95 backdrop-blur-md shadow-lg'
      }
    }
    return 'bg-transparent'
  }

  const getTextColor = () => {
    if (!isScrolled && !isOnSubPage) return 'text-white'
    return currentTheme === 'light' ? 'text-secondary-900' : 'text-white'
  }

  const getActiveColor = () => {
    // Active item gets highlighted background
    if (!isScrolled && !isOnSubPage) {
      return 'text-white bg-primary-600/80 rounded-full px-4'
    }
    return currentTheme === 'light'
      ? 'text-white bg-primary-600 rounded-full px-4'
      : 'text-white bg-white/20 rounded-full px-4'
  }

  const getHoverColor = () => {
    if (!isScrolled && !isOnSubPage) return 'hover:text-primary-300 hover:bg-white/10 rounded-full'
    return currentTheme === 'light'
      ? 'hover:text-primary-600 hover:bg-primary-50 rounded-full'
      : 'hover:text-white hover:bg-white/10 rounded-full'
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getNavbarStyles()}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between transition-all duration-300 ${isScrolled || isOnSubPage ? 'h-16' : 'h-20'}`}>
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <img
                src="/media/jkkniurs-logo.png"
                alt="JKKNIURS Logo"
                className={`transition-all duration-300 ${isScrolled || isOnSubPage ? 'h-10' : 'h-12'}`}
              />
              <span className={`text-xl font-bold transition-colors duration-300 ${getTextColor()} ${!isScrolled && !isOnSubPage ? 'drop-shadow-lg' : ''}`}>
                JKKNIURS
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${isActive(item.href)
                  ? getActiveColor()
                  : `${getTextColor()} ${getHoverColor()}`
                  } px-3 lg:px-4 py-2 text-sm lg:text-base font-medium transition-all duration-200 whitespace-nowrap ${!isScrolled && !isOnSubPage ? 'drop-shadow-md' : ''}`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to={isAuthenticated ? "/profile" : "/login"}
              className="ml-4 px-6 py-2 rounded-full font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-all duration-300 hover:scale-105 shadow-md"
            >
              {isAuthenticated ? (profile?.full_name?.split(' ')[0] || 'Profile') : 'Login'}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${getTextColor()} hover:bg-white/10 p-2 rounded-lg transition-colors duration-300`}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 backdrop-blur-md bg-primary-800/95">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${isActive(item.href)
                  ? 'text-white bg-primary-600 rounded-lg'
                  : 'text-white/90 hover:text-white hover:bg-white/10 rounded-lg'
                  } block px-4 py-3 text-base font-medium transition-colors duration-200`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to={isAuthenticated ? "/profile" : "/login"}
              className="block text-center mt-4 px-6 py-3 rounded-full font-semibold text-white bg-primary-600 hover:bg-primary-700"
              onClick={() => setIsOpen(false)}
            >
              {isAuthenticated ? 'Profile' : 'Login'}
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar