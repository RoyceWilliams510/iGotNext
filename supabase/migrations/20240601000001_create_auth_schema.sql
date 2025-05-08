-- Create profiles table that extends the auth.users data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  skill_level TEXT CHECK (skill_level IN ('Beginner', 'Intermediate', 'Advanced')),
  preferred_position TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create games table
CREATE TABLE IF NOT EXISTS public.games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  creator_id UUID REFERENCES public.profiles(id) NOT NULL,
  court_name TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  player_limit INTEGER NOT NULL,
  player_count INTEGER DEFAULT 0,
  skill_level TEXT CHECK (skill_level IN ('Beginner', 'Intermediate', 'Advanced')),
  game_type TEXT CHECK (game_type IN ('Casual', 'Competitive')),
  court_type TEXT CHECK (court_type IN ('Indoor', 'Outdoor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create game_players junction table
CREATE TABLE IF NOT EXISTS public.game_players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE,
  player_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(game_id, player_id)
);

-- Create courts table
CREATE TABLE IF NOT EXISTS public.courts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  amenities TEXT[],
  surface_type TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create court_ratings table
CREATE TABLE IF NOT EXISTS public.court_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  court_id UUID REFERENCES public.courts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(court_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.court_ratings ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Profiles policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Games policies
DROP POLICY IF EXISTS "Games are viewable by everyone" ON public.games;
CREATE POLICY "Games are viewable by everyone" 
ON public.games FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can insert own games" ON public.games;
CREATE POLICY "Users can insert own games" 
ON public.games FOR INSERT 
WITH CHECK (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Users can update own games" ON public.games;
CREATE POLICY "Users can update own games" 
ON public.games FOR UPDATE 
USING (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Users can delete own games" ON public.games;
CREATE POLICY "Users can delete own games" 
ON public.games FOR DELETE 
USING (auth.uid() = creator_id);

-- Game players policies
DROP POLICY IF EXISTS "Game players are viewable by everyone" ON public.game_players;
CREATE POLICY "Game players are viewable by everyone" 
ON public.game_players FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can join games" ON public.game_players;
CREATE POLICY "Users can join games" 
ON public.game_players FOR INSERT 
WITH CHECK (auth.uid() = player_id);

DROP POLICY IF EXISTS "Users can leave games" ON public.game_players;
CREATE POLICY "Users can leave games" 
ON public.game_players FOR DELETE 
USING (auth.uid() = player_id);

-- Courts policies
DROP POLICY IF EXISTS "Courts are viewable by everyone" ON public.courts;
CREATE POLICY "Courts are viewable by everyone" 
ON public.courts FOR SELECT 
USING (true);

-- Court ratings policies
DROP POLICY IF EXISTS "Court ratings are viewable by everyone" ON public.court_ratings;
CREATE POLICY "Court ratings are viewable by everyone" 
ON public.court_ratings FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can insert own ratings" ON public.court_ratings;
CREATE POLICY "Users can insert own ratings" 
ON public.court_ratings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own ratings" ON public.court_ratings;
CREATE POLICY "Users can update own ratings" 
ON public.court_ratings FOR UPDATE 
USING (auth.uid() = user_id);

-- Enable realtime subscriptions
alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.games;
alter publication supabase_realtime add table public.game_players;
alter publication supabase_realtime add table public.courts;
alter publication supabase_realtime add table public.court_ratings;

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to update player count when players join/leave games
CREATE OR REPLACE FUNCTION public.update_game_player_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE public.games
    SET player_count = player_count + 1
    WHERE id = NEW.game_id;
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE public.games
    SET player_count = player_count - 1
    WHERE id = OLD.game_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for player count updates
DROP TRIGGER IF EXISTS on_game_player_added ON public.game_players;
CREATE TRIGGER on_game_player_added
  AFTER INSERT ON public.game_players
  FOR EACH ROW EXECUTE PROCEDURE public.update_game_player_count();

DROP TRIGGER IF EXISTS on_game_player_removed ON public.game_players;
CREATE TRIGGER on_game_player_removed
  AFTER DELETE ON public.game_players
  FOR EACH ROW EXECUTE PROCEDURE public.update_game_player_count();
