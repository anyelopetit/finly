# Finly — Understand your money. Improve your future.

MVP moderno, minimalista y fluido de gestión de finanzas personales diseñado inicialmente para el mercado de Venezuela (USD y VES), construido con una arquitectura modular orientada a funcionalidades (**Feature-Based Architecture**).

---

## 🏛️ Arquitectura del Proyecto (Feature-Based)

El proyecto está organizado verticalmente por dominios de negocio dentro de `src/features/`. Cada funcionalidad es un módulo autónomo con su propia estructura interna:

```
src/
├── components/           # Componentes transversales compartidos
│   ├── common/           # EmptyState, InsightCard, etc.
│   ├── layout/           # AppShell, BottomNav, TopBar
│   └── ui/               # Primitivas de diseño (Button, Card, Input, ProgressBar)
│
├── features/             # Módulos de funcionalidad (Vertical Slices)
│   ├── dashboard/
│   │   ├── components/   # HeroBalanceCard, SpendingBars, FinancialSummaryPills
│   │   ├── hooks/        # useDashboard
│   │   ├── pages/        # DashboardPage
│   │   └── index.ts      # Public API del módulo
│   │
│   ├── transactions/
│   │   ├── components/   # AddTransactionModal, TransactionItem, ReceiptCard
│   │   ├── hooks/        # useTransactions
│   │   ├── pages/        # TransactionsPage, TransactionDetailPage
│   │   └── index.ts      # Public API del módulo
│   │
│   ├── savings/
│   │   ├── components/   # GoalCard, DebtCard, NewGoalModal, NewDebtModal, ContributeModal, PayDebtModal
│   │   ├── hooks/        # useSavings
│   │   ├── pages/        # SavingsPage, GoalDetailPage
│   │   └── index.ts      # Public API del módulo
│   │
│   ├── analytics/
│   │   ├── components/   # CategoryPieChart, MonthlyComparisonBarChart, AnalyticsSummaryCards
│   │   ├── hooks/        # useAnalytics
│   │   ├── pages/        # AnalyticsPage
│   │   └── index.ts      # Public API del módulo
│   │
│   ├── onboarding/
│   │   ├── components/   # OnboardingStep1, OnboardingStep2, OnboardingStep3
│   │   ├── pages/        # OnboardingPage
│   │   └── index.ts      # Public API del módulo
│   │
│   └── profile/
│       ├── components/   # ProfileForm, PreferencesSection, DemoDataSection
│       ├── pages/        # ProfilePage
│       └── index.ts      # Public API del módulo
│
├── lib/                  # Motor de cálculos financieros, utilidades y configuración
├── store/                # Estados globales Zustand y persistencia LocalStorage
└── types/                # Definiciones y modelos TypeScript de dominio
```

### Ventajas de esta estructura
- **Alta Cohesión**: Todo lo que necesita una funcionalidad (pantallas, modales, hooks de lógica, sub-componentes) vive junto en su propia carpeta.
- **Bajo Acoplamiento**: Los demás módulos y el enrutador solo importan la API pública expuesta a través de cada `index.ts`.
- **Escalabilidad y Mantenimiento**: Añadir una nueva funcionalidad o modificar una existente no afecta al resto del sistema.

---

## ✨ Características Principales

1. **Interfaz Minimalista y Fluida**:
   - Paleta de diseño basada en tonos Lavanda (`#7653C8`, `#5D39AE`), Acento Limón Neón (`#BEF532`) y superficies limpias (`#F8F9FF`).
   - **Shared Element Transitions**: Animaciones suaves con `framer-motion` donde los elementos fluyen continuamente entre pantallas (ej. el botón flotante Limón se expande directamente al formulario de registro, y las tarjetas de movimientos se abren en recibos detallados).

2. **Doble Moneda Nativa (USD y VES)**:
   - Registro en Dólares ($) o Bolívares (Bs.).
   - Conversión de referencia instantánea en el balance principal con tasa editable.

3. **Modo Local-First con Datos Demo**:
   - Incluye datos demo pre-cargados de ejemplo ("Ana") con movimientos, metas de ahorro y deudas.
   - Persistencia completa con `localStorage` para pruebas sin depender de conexión a servidores.
   - Opción para reiniciar los datos demo o limpiar todo desde la pantalla de Perfil.

4. **Metas y Deudas**:
   - Creación de metas con emojis y cálculo de ahorro mensual sugerido.
   - Seguimiento visual de amortización y pagos a deudas.

5. **Análisis y Estadísticas**:
   - Gráfico de dona de gastos por categoría interactivo con porcentajes.
   - Ritmo de ingresos vs gastos en barras mensuales.
   - Tasa de ahorro mensual calculada automáticamente.

6. **Modo Privacidad**:
   - Botón de ojo para enmascarar cifras en lugares públicos (`••••••`).

---

## 🚀 Cómo Ejecutar en Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

---

## ☁️ Despliegue en Cloudflare Pages ($0 / Mes)

Para desplegar en un subdominio gratuito `https://finly-mvp.pages.dev`:

1. Sube este repositorio a **GitHub**.
2. Entra en el panel de **Cloudflare Dashboard** → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Selecciona tu repositorio y usa la siguiente configuración de build:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. ¡Listo! Cloudflare Pages te proporcionará un subdominio HTTPS gratuito de alto rendimiento.

---

## 🗄️ Conexión con Supabase (Opcional)

Cuando desees conectar la base de datos completa de Supabase:

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Ve al **SQL Editor** de Supabase y ejecuta el archivo:
   `supabase/migrations/001_initial_schema.sql`
3. Agrega tus credenciales en `.env.local` (o en las variables de entorno de Cloudflare Pages):
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key
   ```
