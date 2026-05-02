import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import { LocalNotifications } from '@capacitor/local-notifications';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Solicitar permisos de notificación al iniciar la app (en Android)
    const requestPerms = async () => {
      try {
        const perms = await LocalNotifications.checkPermissions();
        if (perms.display !== 'granted') {
          await LocalNotifications.requestPermissions();
        }
      } catch (e) {
        console.log('No disponible en web o error de permisos');
      }
    };
    requestPerms();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-200/50 flex justify-center">
      {/* Mobile container wrapper for desktop viewing */}
      <div className="w-full max-w-[480px] bg-slate-50 min-h-screen relative shadow-2xl overflow-hidden">
        {!session ? (
          <Auth onLogin={setSession} />
        ) : (
          <Dashboard session={session} onLogout={() => setSession(null)} />
        )}
      </div>
    </div>
  );
}

export default App;
