import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUIStore } from '@/store'
import {
  Home,
  ArrowLeftRight,
  PiggyBank,
  PieChart,
  Plus,
  type LucideIcon,
} from 'lucide-react'

interface NavItem {
  path: string
  label: string
  icon: LucideIcon
}

const NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'Inicio', icon: Home },
  { path: '/movimientos', label: 'Movimientos', icon: ArrowLeftRight },
  // FAB center — rendered separately
  { path: '/metas', label: 'Metas', icon: PiggyBank },
  { path: '/analisis', label: 'Análisis', icon: PieChart },
]

export function BottomNav() {
  const { openAddTransaction } = useUIStore()

  return (
    <div className="fixed bottom-0 w-full z-50 pointer-events-none pb-safe">
      <div className="px-margin pb-3 flex justify-center">
        <div className="relative w-full max-w-md bg-surface-container-lowest/90 backdrop-blur-xl rounded-full shadow-nav pointer-events-auto px-1 py-2">
          <nav className="flex items-center justify-around relative">
            {/* Left 2 items */}
            {NAV_ITEMS.slice(0, 2).map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex flex-col items-center justify-center min-w-[48px] min-h-[44px] transition-colors ${
                      isActive ? 'text-primary' : 'text-on-surface-variant'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <motion.div
                        animate={{ scale: isActive ? 1.1 : 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      >
                        <Icon
                          className="w-5 h-5"
                          strokeWidth={isActive ? 2.5 : 2}
                        />
                      </motion.div>
                      <span className={`text-label-sm mt-0.5 ${isActive ? 'font-semibold' : ''}`}>
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              )
            })}

            {/* FAB Center — Shared Element: layoutId="fab-add-button" */}
            <div className="relative -top-5 flex flex-col items-center justify-center shrink-0">
              <motion.button
                layoutId="fab-add-button"
                onClick={openAddTransaction}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                aria-label="Registrar nuevo movimiento"
                className="w-14 h-14 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shadow-fab cursor-pointer"
                style={{
                  animation: 'subtle-float 3.8s ease-in-out infinite',
                  willChange: 'transform',
                }}
              >
                <Plus className="w-7 h-7 stroke-[2.7]" />
              </motion.button>
            </div>

            {/* Right 2 items */}
            {NAV_ITEMS.slice(2).map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex flex-col items-center justify-center min-w-[48px] min-h-[44px] transition-colors ${
                      isActive ? 'text-primary' : 'text-on-surface-variant'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <motion.div
                        animate={{ scale: isActive ? 1.1 : 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      >
                        <Icon
                          className="w-5 h-5"
                          strokeWidth={isActive ? 2.5 : 2}
                        />
                      </motion.div>
                      <span className={`text-label-sm mt-0.5 ${isActive ? 'font-semibold' : ''}`}>
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}
