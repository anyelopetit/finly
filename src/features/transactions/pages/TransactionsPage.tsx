import { useTransactions } from '../hooks/useTransactions'
import { TransactionItem } from '../components/TransactionItem'
import { EmptyState } from '@/components/common/EmptyState'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useUIStore } from '@/store'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export default function TransactionsPage() {
  const { openAddTransaction } = useUIStore()
  const { filterType, setFilterType, search, setSearch, groupedByDate } = useTransactions()

  return (
    <div className="flex flex-col w-full pb-8 space-y-4 pt-1">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-headline-lg text-on-surface font-bold tracking-tight">
          Movimientos
        </h1>
        <Button
          variant="secondary"
          size="sm"
          onClick={openAddTransaction}
          className="shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Nuevo
        </Button>
      </div>

      {/* Search Input */}
      <Input
        placeholder="Buscar movimientos..."
        leftIcon="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-surface-container-lowest"
      />

      {/* Filter Tabs */}
      <div className="flex p-1 bg-surface-container-low rounded-full">
        {(['all', 'expense', 'income'] as const).map((tab) => {
          const labels = { all: 'Todos', expense: 'Gastos', income: 'Ingresos' }
          const isSelected = filterType === tab
          return (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`flex-1 py-1.5 rounded-full text-label-md font-bold transition-all ${
                isSelected
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant'
              }`}
            >
              {labels[tab]}
            </button>
          )
        })}
      </div>

      {/* Transactions List */}
      {groupedByDate.length === 0 ? (
        <EmptyState
          icon="search_off"
          title="No hay movimientos"
          description={
            search
              ? 'No encontramos movimientos que coincidan con tu búsqueda.'
              : 'Aún no tienes movimientos registrados en este filtro.'
          }
          actionLabel="Registrar movimiento"
          onAction={openAddTransaction}
        />
      ) : (
        <div className="space-y-4">
          {groupedByDate.map(([dateKey, items], groupIdx) => {
            const dateObj = parseISO(dateKey)
            const dateFormatted = format(dateObj, "EEEE, d 'de' MMMM", { locale: es })
            return (
              <div
                key={dateKey}
                className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm space-y-2"
              >
                <h3 className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wider capitalize">
                  {dateFormatted}
                </h3>
                <div className="space-y-1">
                  {items.map((t, idx) => (
                    <TransactionItem
                      key={t.id}
                      transaction={t}
                      index={groupIdx * 3 + idx}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
