import { type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'

interface AppShellProps {
  children: ReactNode
  hideNav?: boolean
}

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

const pageTransition = {
  duration: 0.28,
  ease: [0.4, 0, 0.2, 1],
}

export function AppShell({ children, hideNav = false }: AppShellProps) {
  const location = useLocation()

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {!hideNav && <TopBar />}

      <main
        className="flex flex-col relative w-full px-margin pb-28 bg-surface min-h-screen"
        style={{ paddingTop: hideNav ? '0' : '4rem' }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="flex flex-col w-full pb-4"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {!hideNav && <BottomNav />}
    </div>
  )
}
