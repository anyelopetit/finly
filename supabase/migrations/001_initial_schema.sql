-- ============================================================
-- FINLY — SUPABASE POSTGRESQL INITIAL SCHEMA & RLS
-- ============================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  primary_currency TEXT NOT NULL DEFAULT 'USD' CHECK (primary_currency IN ('USD', 'VES')),
  initial_balance_usd NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  initial_balance_ves NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  tracking_start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own profile"
  ON public.profiles
  FOR ALL
  USING (auth.uid() = id);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL for system categories
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  "group" TEXT NOT NULL CHECK ("group" IN ('income', 'expense')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read system categories and their own"
  ON public.categories
  FOR SELECT
  USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can manage their own custom categories"
  ON public.categories
  FOR ALL
  USING (auth.uid() = user_id);

-- 3. Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL CHECK (currency IN ('USD', 'VES')),
  category_id UUID NOT NULL REFERENCES public.categories(id),
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON public.transactions(user_id, date DESC);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own transactions"
  ON public.transactions
  FOR ALL
  USING (auth.uid() = user_id);

-- 4. Savings Goals Table
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '🎯',
  target_amount NUMERIC(14, 2) NOT NULL CHECK (target_amount > 0),
  currency TEXT NOT NULL CHECK (currency IN ('USD', 'VES')),
  deadline DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own goals"
  ON public.goals
  FOR ALL
  USING (auth.uid() = user_id);

-- 5. Goal Contributions Table
CREATE TABLE IF NOT EXISTS public.goal_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL CHECK (currency IN ('USD', 'VES')),
  note TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.goal_contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own contributions"
  ON public.goal_contributions
  FOR ALL
  USING (auth.uid() = user_id);

-- 6. Debts Table
CREATE TABLE IF NOT EXISTS public.debts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  initial_amount NUMERIC(14, 2) NOT NULL CHECK (initial_amount > 0),
  currency TEXT NOT NULL CHECK (currency IN ('USD', 'VES')),
  creditor TEXT,
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own debts"
  ON public.debts
  FOR ALL
  USING (auth.uid() = user_id);

-- 7. Debt Payments Table
CREATE TABLE IF NOT EXISTS public.debt_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  debt_id UUID NOT NULL REFERENCES public.debts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL CHECK (currency IN ('USD', 'VES')),
  note TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.debt_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own debt payments"
  ON public.debt_payments
  FOR ALL
  USING (auth.uid() = user_id);

-- 8. Seed Default Categories
INSERT INTO public.categories (name, icon, color, "group", user_id)
VALUES
  ('Salario', 'payments', '#4d6700', 'income', NULL),
  ('Independiente', 'work', '#4d6700', 'income', NULL),
  ('Negocio', 'storefront', '#4d6700', 'income', NULL),
  ('Otros ingresos', 'add_circle', '#4d6700', 'income', NULL),
  ('Alimentación', 'restaurant', '#ba1a1a', 'expense', NULL),
  ('Transporte', 'directions_car', '#7653c8', 'expense', NULL),
  ('Vivienda', 'home', '#574397', 'expense', NULL),
  ('Servicios', 'bolt', '#7653c8', 'expense', NULL),
  ('Salud', 'favorite', '#ba1a1a', 'expense', NULL),
  ('Entretenimiento', 'sports_esports', '#5d39ae', 'expense', NULL),
  ('Compras', 'shopping_bag', '#7653c8', 'expense', NULL),
  ('Educación', 'school', '#574397', 'expense', NULL),
  ('Deudas', 'account_balance', '#ba1a1a', 'expense', NULL),
  ('Cafeterías', 'local_cafe', '#7653c8', 'expense', NULL),
  ('Comida a domicilio', 'delivery_dining', '#ba1a1a', 'expense', NULL),
  ('Otros gastos', 'more_horiz', '#494452', 'expense', NULL)
ON CONFLICT DO NOTHING;
