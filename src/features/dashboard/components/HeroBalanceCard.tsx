import { motion } from 'framer-motion'
import { usePrivacyStore } from '@/store'
import { formatCurrency } from '@/lib/calculations'
import { Eye, EyeOff, ArrowLeftRight, ShieldCheck } from 'lucide-react'

interface HeroBalanceCardProps {
  balance: number
  changePercent: number
  currency: string
  exchangeRate: number
}

export function HeroBalanceCard({
  balance,
  changePercent,
  currency,
  exchangeRate,
}: HeroBalanceCardProps) {
  const { isHidden, toggle } = usePrivacyStore()
  const isPositive = changePercent >= 0
  const vesBalance = currency === 'USD' ? balance * exchangeRate : balance

  return (
    <motion.div
      layoutId="balance-card"
      className="relative overflow-hidden rounded-lg bg-inverse-surface text-inverse-on-surface p-space-lg shadow-hero flex flex-col justify-between min-h-[190px]"
    >
      {/* Animated neon wave decoration */}
      <div
        className="absolute -right-4 -bottom-6 w-36 h-28 pointer-events-none opacity-95 animate-orb-breathing"
        style={{ transformOrigin: 'right bottom', willChange: 'transform, opacity' }}
      >
        <svg className="w-full h-full" fill="none" viewBox="0 0 160 120">
          <path className="fill-secondary-fixed" d="M20 90C45 40 85 10 160 15V120H0C8 108 14 98 20 90Z" />
          <circle cx="135" cy="55" fill="#a3d700" fillOpacity="0.3" r="28" />
        </svg>
      </div>

      {/* Top glow */}
      <div className="absolute -top-16 -left-12 w-48 h-48 rounded-full bg-primary-container/20 blur-2xl pointer-events-none" />

      {/* Header row */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed animate-pulse" />
          <span className="text-label-md text-surface-container-high tracking-wide">
            Saldo disponible
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-label-sm bg-surface-container-highest/20 font-bold px-2.5 py-1 rounded-full backdrop-blur-md ${
              isPositive ? 'text-secondary-fixed' : 'text-error-container'
            }`}
          >
            {isPositive ? '+' : ''}{changePercent.toFixed(1)}% este mes
          </span>
          {/* Privacy toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggle}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
          >
            {isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>

      {/* Balance amount */}
      <div className="relative z-10 my-3">
        <div className="flex items-baseline gap-1">
          <motion.span
            layout
            className="text-display tracking-tight text-white font-bold"
          >
            {isHidden
              ? '••••••'
              : formatCurrency(balance, currency as 'USD' | 'VES')}
          </motion.span>
          <span className="text-label-md text-surface-variant font-semibold">{currency}</span>
        </div>
        {currency === 'USD' && (
          <div className="flex items-center gap-1.5 mt-1 text-surface-container-high">
            <span className="text-label-sm">
              {isHidden ? '••••••' : `≈ ${vesBalance.toLocaleString('es-VE', { minimumFractionDigits: 2 })} VES`}
            </span>
            <ArrowLeftRight className="w-3.5 h-3.5 text-surface-variant" />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5 text-surface-container-lowest/80 text-label-sm">
          <ShieldCheck className="w-4 h-4 text-secondary-fixed" />
          <span>Cuenta Principal</span>
        </div>
      </div>
    </motion.div>
  )
}
