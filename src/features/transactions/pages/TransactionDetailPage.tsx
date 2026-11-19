import { useParams, useNavigate } from 'react-router-dom'
import { useTransactions } from '../hooks/useTransactions'
import { ReceiptCard } from '../components/ReceiptCard'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Trash2, Receipt } from 'lucide-react'

export default function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { transactions, deleteTransaction } = useTransactions()

  const transaction = transactions.find((t) => t.id === id)

  if (!transaction) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <Receipt className="w-12 h-12 text-on-surface-variant" />
        <h2 className="text-headline-sm font-bold text-on-surface">Movimiento no encontrado</h2>
        <Button onClick={() => navigate('/movimientos')} variant="primary">
          Volver a movimientos
        </Button>
      </div>
    )
  }

  const handleDelete = () => {
    if (window.confirm('¿Seguro que deseas eliminar este movimiento?')) {
      deleteTransaction(transaction.id)
      navigate('/movimientos')
    }
  }

  return (
    <div className="flex flex-col w-full max-w-md mx-auto pb-8 space-y-6 pt-2">
      {/* Top back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-on-surface hover:bg-surface-container active:scale-95 transition-all shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-label-lg font-bold text-on-surface">Detalle de Movimiento</h1>
        <div className="w-10" />
      </div>

      {/* Main Receipt Card with layoutId */}
      <ReceiptCard transaction={transaction} />

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          fullWidth
          onClick={handleDelete}
          className="text-error border-error/20 hover:bg-error-container/20"
        >
          <Trash2 className="w-4.5 h-4.5 mr-1" />
          Eliminar
        </Button>
        <Button
          variant="secondary"
          fullWidth
          onClick={() => navigate('/movimientos')}
          className="font-bold shadow-fab"
        >
          Aceptar
        </Button>
      </div>
    </div>
  )
}
