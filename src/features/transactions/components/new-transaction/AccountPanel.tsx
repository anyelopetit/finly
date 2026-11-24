import { Check, X, Plus } from 'lucide-react'
import type { Account } from '@/types'
import { getAccountIconComponent } from '@/lib/accounts'
import { cn } from '@/lib/utils'

interface AccountPanelProps {
  accounts: Account[]
  selectedId: string
  onSelect: (account: Account) => void
  onClose: () => void
  onOpenManageAccounts?: () => void
}

export function AccountPanel({
  accounts,
  selectedId,
  onSelect,
  onClose,
  onOpenManageAccounts,
}: AccountPanelProps) {
  return (
    <div className="rounded-[20px] border border-hairline bg-white p-2 shadow-pop">
      <div className="flex items-center justify-between px-2 pb-1.5 pt-0.5">
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted">
          Seleccionar Cuenta
        </span>
        <button
          type="button"
          aria-label="Cerrar selector de cuenta"
          onClick={onClose}
          className="grid h-6 w-6 place-items-center rounded-full text-muted hover:bg-mist hover:text-ink transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="space-y-1 max-h-60 overflow-y-auto pr-0.5">
        {accounts.map((account) => {
          const IconComp = getAccountIconComponent(account.icon)
          const selected = account.id === selectedId

          return (
            <button
              key={account.id}
              type="button"
              onClick={() => onSelect(account)}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-[12px] px-2.5 py-2 text-left transition-colors',
                selected
                  ? 'bg-primary-fixed/30 text-primary font-semibold'
                  : 'text-on-surface hover:bg-surface-container-low'
              )}
            >
              <span
                className="grid h-7 w-7 place-items-center rounded-full text-white shadow-xs flex-shrink-0"
                style={{ backgroundColor: account.color || '#5D39AE' }}
              >
                <IconComp className="h-3.5 w-3.5" strokeWidth={2} />
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-medium truncate">{account.name}</span>
                  <span
                    className={cn(
                      'text-[9px] font-bold uppercase px-1 py-0.2 rounded',
                      account.currency === 'USD'
                        ? 'bg-secondary-fixed/50 text-secondary-fixed-variant'
                        : 'bg-primary-fixed/50 text-primary'
                    )}
                  >
                    {account.currency}
                  </span>
                </div>
                <span className="text-[11px] text-on-surface-variant truncate block">
                  {account.provider}
                </span>
              </div>

              {selected && <Check className="h-4 w-4 text-primary flex-shrink-0" strokeWidth={2.5} />}
            </button>
          )
        })}
      </div>

      {onOpenManageAccounts && (
        <div className="pt-2 mt-1 border-t border-hairline">
          <button
            type="button"
            onClick={onOpenManageAccounts}
            className="flex w-full items-center justify-center gap-1.5 rounded-[12px] py-1.5 text-center text-xs font-bold text-primary hover:bg-primary-fixed/20 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Agregar o gestionar cuentas</span>
          </button>
        </div>
      )}
    </div>
  )
}
