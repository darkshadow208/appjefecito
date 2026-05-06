import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import { LocalNotifications } from '@capacitor/local-notifications';
import logo from './assets/logosinfondo.png';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Solicitar permisos de notificación al iniciar la app (en Android)
    const requestPerms = async () => {
      try {
        // Crear canal de notificaciones para Android 8+
        await LocalNotifications.createChannel({
          id: 'reminders',
          name: 'Recordatorios Saoko Beach',
          description: 'Notificaciones para registro de horas',
          importance: 5, // 5 = High importance (makes noise and peek)
          visibility: 1, // 1 = Public
          sound: 'default',
          vibration: true,
        });

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
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-700">
          <div className="w-60 h-60 mb-4 flex items-center justify-center">
            <img 
              src={logo} 
              alt="Saoko Beach Logo" 
              className="w-full h-full object-contain animate-pulse"
            />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
            SAOKO BEACH
          </h1>
          <div className="w-12 h-1 bg-white/20 rounded-full overflow-hidden mt-4">
            <div className="h-full bg-white animate-progress-loading w-full"></div>
          </div>
        </div>
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
