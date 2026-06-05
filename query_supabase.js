import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zzcqjpgvknzcrjxsqish.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6Y3FqcGd2a256Y3JqeHNxaXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NzkyMTAsImV4cCI6MjA5MzI1NTIxMH0.rI__znQ1KMYmEYQlVwZ-M2Vmht5_O95QDz6vdYBDBbU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data, error } = await supabase
    .from('work_logs')
    .upsert({
      user_id: '00000000-0000-0000-0000-000000000000', // dummy UUID
      log_date: '2026-06-01',
      start_time: '08:00:00',
      end_time: '17:00:00',
      is_rest_day: false,
      bote: 10.5,
      chiringuito: 'Saoko'
    })
    .select();

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Result:', data);
  }
}

run();
