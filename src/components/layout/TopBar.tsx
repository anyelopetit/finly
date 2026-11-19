import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePrivacyStore, useCurrencyStore } from '@/store'
import { Bell, User } from 'lucide-react'

interface TopBarProps {
  showLogo?: boolean
}

export function TopBar({ showLogo = true }: TopBarProps) {
  const { activeCurrency, setActiveCurrency } = useCurrencyStore()

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
      <div className="h-16 px-margin flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          {showLogo && (
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-on-primary font-bold text-headline-sm">F</span>
            </div>
          )}
          <span className="text-headline-sm font-bold text-on-surface tracking-tight">
            Finly
          </span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Currency selector */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              setActiveCurrency(activeCurrency === 'USD' ? 'VES' : 'USD')
            }
            className="min-h-[44px] px-2 py-1 flex items-center gap-1 rounded-full bg-surface-container-low cursor-pointer"
          >
            <span
              className={`text-label-sm font-bold px-1.5 py-0.5 rounded-full transition-all ${
                activeCurrency === 'USD'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant'
              }`}
            >
              USD
            </span>
            <span
              className={`text-label-sm px-1.5 py-0.5 rounded-full transition-all ${
                activeCurrency === 'VES'
                  ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                  : 'text-on-surface-variant'
              }`}
            >
              VES
            </span>
          </motion.button>

          {/* Notifications */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            aria-label="Notificaciones"
            className="w-11 h-11 relative flex items-center justify-center rounded-full bg-surface-container-lowest text-on-surface-variant shadow-sm cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-secondary-fixed ring-2 ring-surface" />
          </motion.button>

          {/* Avatar / Profile */}
          <Link to="/perfil">
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-full bg-primary flex items-center justify-center cursor-pointer"
            >
              <User className="w-4.5 h-4.5 text-on-primary" />
            </motion.div>
          </Link>
        </div>
      </div>
    </header>
  )
}
