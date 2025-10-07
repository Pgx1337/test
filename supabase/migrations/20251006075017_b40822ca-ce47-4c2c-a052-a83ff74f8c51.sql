-- Create profiles table for user data
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  username text,
  avatar_url text,
  balance decimal(10, 2) NOT NULL DEFAULT 1000.00,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, balance)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)), 1000.00);
  RETURN new;
END;
$$;

-- Trigger for auto-creating profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for profile updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create bonuses table
CREATE TABLE public.bonuses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  bonus_type text NOT NULL,
  amount decimal(10, 2) NOT NULL,
  claimed boolean NOT NULL DEFAULT false,
  expires_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for bonuses
ALTER TABLE public.bonuses ENABLE ROW LEVEL SECURITY;

-- Bonuses policies
CREATE POLICY "Users can view their own bonuses"
ON public.bonuses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own bonuses"
ON public.bonuses FOR UPDATE
USING (auth.uid() = user_id);

-- Create game_history table
CREATE TABLE public.game_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  game_name text NOT NULL,
  bet_amount decimal(10, 2) NOT NULL,
  win_amount decimal(10, 2) NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for game_history
ALTER TABLE public.game_history ENABLE ROW LEVEL SECURITY;

-- Game history policies
CREATE POLICY "Users can view their own game history"
ON public.game_history FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own game history"
ON public.game_history FOR INSERT
WITH CHECK (auth.uid() = user_id);