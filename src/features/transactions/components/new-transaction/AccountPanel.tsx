import { Check, X } from 'lucide-react'
import type { Account } from '@/lib/accounts'
import { cn } from '@/lib/utils'

interface AccountPanelProps {
  accounts: Account[]
  selectedId: string
  onSelect: (account: Account) => void
  onClose: () => void
}

export function AccountPanel({ accounts, selectedId, onSelect, onClose }: AccountPanelProps) {
  return (
    <div className="rounded-[20px] border border-hairline bg-white p-2 shadow-pop">
      <div className="flex items-center justify-between px-2 pb-1 pt-0.5">
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted">
          Cuenta
        </span>
        <button
          type="button"
          aria-label="Cerrar selector de cuenta"
          onClick={onClose}
          className="grid h-6 w-6 place-items-center rounded-full text-muted hover:bg-mist hover:text-ink"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="space-y-0.5">
        {accounts.map((account) => {
          const Icon = account.icon
          const selected = account.id === selectedId
          return (
            <button
              key={account.id}
              type="button"
              onClick={() => onSelect(account)}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-[12px] px-2.5 py-2 text-left transition-colors',
                selected ? 'bg-primary-fixed/30 text-primary font-semibold' : 'text-on-surface hover:bg-surface-container-low'
              )}
            >
              <span
                className={cn(
                  'grid h-7 w-7 place-items-center rounded-full',
                  selected ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'
                )}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={2} />
              </span>
              <span className="flex-1 text-[13px] font-medium">{account.name}</span>
              {selected && <Check className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
