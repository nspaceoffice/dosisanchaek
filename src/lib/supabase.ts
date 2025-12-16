import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project');

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Types
export interface User {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
}

export interface CommunityPost {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  title: string;
  content: string;
  images: string[];
  status: 'pending' | 'approved' | 'rejected';
  author?: {
    email: string;
    name?: string;
  };
}

// Auth functions
export async function signUp(email: string, password: string, name: string) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  if (!supabase) return { error: null };
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getUser() {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Community Post functions
export async function createPost(title: string, content: string, images: string[]) {
  if (!supabase) throw new Error('Supabase not configured');
  const user = await getUser();
  if (!user) throw new Error('로그인이 필요합니다.');

  const { data, error } = await supabase
    .from('community_posts')
    .insert({
      user_id: user.id,
      title,
      content,
      images,
      status: 'pending',
    })
    .select()
    .single();

  return { data, error };
}

export async function getMyPosts() {
  if (!supabase) return { data: [], error: null };
  const user = await getUser();
  if (!user) return { data: [], error: null };

  const { data, error } = await supabase
    .from('community_posts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return { data, error };
}

export async function getApprovedPosts() {
  if (!supabase) return { data: [], error: null };
  const { data, error } = await supabase
    .from('community_posts')
    .select(`
      *,
      author:profiles(email, name)
    `)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  return { data, error };
}

// Image upload
export async function uploadImage(file: File) {
  if (!supabase) throw new Error('Supabase not configured');
  const user = await getUser();
  if (!user) throw new Error('로그인이 필요합니다.');

  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('community-images')
    .upload(fileName, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('community-images')
    .getPublicUrl(fileName);

  return publicUrl;
}
