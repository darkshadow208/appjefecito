import { createClient } from '@supabase/supabase-js';

// Nota: He puesto las llaves directamente aquí para que el APK funcione al compilarse en la nube (GitHub)
// ya que el archivo .env.local no se sube a GitHub por seguridad.
const supabaseUrl = 'https://zzcqjpgvknzcrjxsqish.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6Y3FqcGd2a256Y3JqeHNxaXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NzkyMTAsImV4cCI6MjA5MzI1NTIxMH0.rI__znQ1KMYmEYQlVwZ-M2Vmht5_O95QDz6vdYBDBbU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
