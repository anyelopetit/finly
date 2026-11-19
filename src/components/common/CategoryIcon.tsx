import React from 'react'
import {
  Banknote,
  Bike,
  Briefcase,
  Car,
  Coffee,
  Gamepad2,
  GraduationCap,
  Heart,
  Home,
  Landmark,
  MoreHorizontal,
  PlusCircle,
  Receipt,
  ShoppingBag,
  Store,
  Tag,
  Utensils,
  Zap,
  type LucideProps,
} from 'lucide-react'

interface CategoryIconProps extends LucideProps {
  name?: string
}

export function CategoryIcon({ name, ...props }: CategoryIconProps) {
  switch (name?.toLowerCase()) {
    // Food & Dining
    case 'restaurant':
    case 'utensils':
    case 'alimentación':
      return <Utensils {...props} />
    case 'local_cafe':
    case 'coffee':
    case 'cafeterías':
      return <Coffee {...props} />
    case 'delivery_dining':
    case 'bike':
    case 'comida a domicilio':
      return <Bike {...props} />

    // Transport & Utilities
    case 'directions_car':
    case 'car':
    case 'transporte':
      return <Car {...props} />
    case 'bolt':
    case 'zap':
    case 'servicios':
      return <Zap {...props} />
    case 'home':
    case 'vivienda':
      return <Home {...props} />

    // Health & Lifestyle
    case 'favorite':
    case 'heart':
    case 'salud':
      return <Heart {...props} />
    case 'sports_esports':
    case 'gamepad':
    case 'entretenimiento':
      return <Gamepad2 {...props} />
    case 'shopping_bag':
    case 'shopping':
    case 'compras':
      return <ShoppingBag {...props} />
    case 'school':
    case 'graduation':
    case 'educación':
      return <GraduationCap {...props} />

    // Income & Finance
    case 'payments':
    case 'banknote':
    case 'salario':
      return <Banknote {...props} />
    case 'work':
    case 'briefcase':
    case 'independiente':
      return <Briefcase {...props} />
    case 'storefront':
    case 'store':
    case 'negocio':
      return <Store {...props} />
    case 'account_balance':
    case 'landmark':
    case 'deudas':
      return <Landmark {...props} />
    case 'add_circle':
    case 'plus':
    case 'otros ingresos':
      return <PlusCircle {...props} />
    case 'more_horiz':
    case 'ellipsis':
    case 'otros gastos':
      return <MoreHorizontal {...props} />

    default:
      return <Receipt {...props} />
  }
}
