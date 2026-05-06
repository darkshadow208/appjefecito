import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  LogOut, ChevronRight, Shield, Bell, HelpCircle, 
  ArrowLeft, Lock, Loader2, CheckCircle2, MessageCircle, Mail
} from 'lucide-react';
import { LocalNotifications } from '@capacitor/local-notifications';

export default function SettingsTab({ onLogout }) {
  const [currentView, setCurrentView] = useState('main'); // 'main', 'security', 'notifications', 'support'

  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (onLogout) onLogout();
  };

  return (
    <div className="pb-24">
      {/* Header Dinámico con botón de Atrás */}
      <div className="flex items-center mb-6 h-10">
        {currentView !== 'main' ? (
          <button 
            onClick={() => setCurrentView('main')}
            className="flex items-center text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            <span className="font-bold">Atrás</span>
          </button>
        ) : (
          <h2 className="text-2xl font-bold text-slate-800">Configuración</h2>
        )}
      </div>

      <div className="relative overflow-hidden">
        {/* === VISTA PRINCIPAL === */}
        {currentView === 'main' && (
          <div className="animate-in slide-in-from-left-4 fade-in duration-300">
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden mb-6">
              <button 
                onClick={() => setCurrentView('security')}
                className="w-full p-5 flex items-center justify-between border-b border-slate-50 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mr-4">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-slate-700">Seguridad y Cuenta</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </button>

              <button 
                onClick={() => setCurrentView('notifications')}
                className="w-full p-5 flex items-center justify-between border-b border-slate-50 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mr-4">
                    <Bell className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-slate-700">Notificaciones</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </button>

              <button 
                onClick={() => setCurrentView('support')}
                className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mr-4">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-slate-700">Ayuda y Soporte</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-lg py-4 rounded-[2rem] transition-transform active:scale-95 flex justify-center items-center shadow-sm border border-rose-100"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Cerrar Sesión
            </button>

            <div className="mt-8 text-center">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Saoko Beach</p>
              <p className="text-xs font-medium text-slate-400 mt-1">Versión 1.0.0</p>
            </div>
          </div>
        )}

        {/* === VISTA: SEGURIDAD === */}
        {currentView === 'security' && <SecurityView />}

        {/* === VISTA: NOTIFICACIONES === */}
        {currentView === 'notifications' && <NotificationsView />}

        {/* === VISTA: SOPORTE === */}
        {currentView === 'support' && <SupportView />}

      </div>
    </div>
  );
}

// -----------------------------------------------------
// Componentes Internos de las Vistas
// -----------------------------------------------------

function SecurityView() {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      const { error } = await supabase.auth.updateUser({ password: password });
      if (error) throw error;
      setMsg({ type: 'success', text: 'Contraseña actualizada exitosamente' });
      setPassword('');
    } catch (error) {
      setMsg({ type: 'error', text: 'Error: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-right-8 fade-in duration-300">
      <h3 className="text-xl font-bold text-slate-800 mb-4">Cambiar Contraseña</h3>
      
      {msg.text && (
        <div className={`p-4 rounded-2xl mb-6 text-sm font-medium flex items-center ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {msg.type === 'success' && <CheckCircle2 className="w-5 h-5 mr-2" />}
          {msg.text}
        </div>
      )}

      <form onSubmit={handlePasswordChange} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nueva Contraseña</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-slate-300" />
            </div>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl pl-11 pr-4 py-4 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="••••••••"
            />
          </div>
          <p className="text-xs text-slate-400 mt-2 ml-1">Debe tener al menos 6 caracteres.</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-transform active:scale-95 flex justify-center items-center shadow-xl shadow-slate-200 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Actualizar Contraseña'}
        </button>
      </form>
    </div>
  );
}

function NotificationsView() {
  const [reminders, setReminders] = useState(false);
  const [reminderTime, setReminderTime] = useState(localStorage.getItem('reminder_time') || '18:00');
  const [weeklySummary, setWeeklySummary] = useState(false);

  useEffect(() => {
    // Revisar si ya hay notificaciones programadas
    const checkSchedule = async () => {
      try {
        const pending = await LocalNotifications.getPending();
        setReminders(pending.notifications.length > 0);
      } catch (e) {
        // Ignorar si estamos en web
      }
    };
    checkSchedule();
  }, []);

  const scheduleNotification = async (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    try {
      // Cancelar previas
      await LocalNotifications.cancel({ notifications: [{ id: 1 }] });
      
      // Programar nueva
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "Saoko Beach",
            body: "¡No olvides registrar tus horas trabajadas de hoy!",
            id: 1,
            channelId: 'reminders',
            schedule: { 
              on: { hour: hours, minute: minutes },
              repeats: true,
              allowWhileIdle: true,
              exact: true
            },
          }
        ]
      });
      // Feedback visual para el usuario
      alert(`¡Listo! Recordatorio programado todos los días a las ${timeStr}`);
    } catch (e) {
      console.log('Error programando:', e);
    }
  };

  const toggleReminders = async () => {
    const newState = !reminders;
    setReminders(newState);

    try {
      if (newState) {
        await scheduleNotification(reminderTime);
      } else {
        await LocalNotifications.cancel({ notifications: [{ id: 1 }] });
      }
    } catch (e) {
      console.log('Error toggle:', e);
    }
  };

  const handleTimeChange = async (e) => {
    const newTime = e.target.value;
    setReminderTime(newTime);
    localStorage.setItem('reminder_time', newTime);
    
    if (reminders) {
      await scheduleNotification(newTime);
    }
  };

  return (
    <div className="animate-in slide-in-from-right-8 fade-in duration-300">
      <h3 className="text-xl font-bold text-slate-800 mb-4">Preferencias</h3>
      
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-2 space-y-2">
        
        <div className="p-4 flex items-center justify-between border-b border-slate-50">
          <div>
            <p className="font-bold text-slate-700">Recordatorio Diario</p>
            <p className="text-xs text-slate-400 mt-0.5">Notificación para registrar horas</p>
          </div>
          <button 
            onClick={toggleReminders}
            className={`w-12 h-6 rounded-full flex items-center transition-colors px-1 ${reminders ? 'bg-emerald-500' : 'bg-slate-200'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${reminders ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
        </div>

        {reminders && (
          <div className="p-4 bg-slate-50 rounded-2xl mx-2 mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">Hora del recordatorio</span>
            <input 
              type="time" 
              value={reminderTime}
              onChange={handleTimeChange}
              className="bg-white px-3 py-1 rounded-lg border border-slate-200 font-bold text-slate-700 outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        )}

        <div className="p-4 flex items-center justify-between">
          <div>
            <p className="font-bold text-slate-700">Resumen Semanal</p>
            <p className="text-xs text-slate-400 mt-0.5">Resumen de balance al finalizar la semana</p>
          </div>
          <button 
            onClick={() => setWeeklySummary(!weeklySummary)}
            className={`w-12 h-6 rounded-full flex items-center transition-colors px-1 ${weeklySummary ? 'bg-emerald-500' : 'bg-slate-200'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${weeklySummary ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
        </div>

      </div>
    </div>
  );
}

function SupportView() {
  const supportEmail = "soporte@saokobeach.com"; // Updated support email placeholder
  const supportPhone = "+0000000000"; // Placeholder

  return (
    <div className="animate-in slide-in-from-right-8 fade-in duration-300">
      <div className="text-center mb-8 mt-4">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="w-10 h-10 text-blue-500" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800">¿Necesitas Ayuda?</h3>
        <p className="text-slate-500 mt-2 px-4">
          Estamos aquí para resolver cualquier duda o problema técnico que tengas con la aplicación.
        </p>
      </div>

      <div className="space-y-4">
        <a 
          href={`https://wa.me/${supportPhone.replace('+', '')}`}
          target="_blank" 
          rel="noreferrer"
          className="w-full bg-[#25D366] text-white p-5 rounded-[2rem] flex items-center shadow-lg shadow-green-200 transition-transform active:scale-95"
        >
          <div className="bg-white/20 p-3 rounded-xl mr-4">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div className="text-left">
            <p className="font-bold text-lg">Escríbenos por WhatsApp</p>
            <p className="text-green-100 text-sm">Respuesta rápida</p>
          </div>
        </a>

        <a 
          href={`mailto:${supportEmail}`}
          className="w-full bg-slate-800 text-white p-5 rounded-[2rem] flex items-center shadow-lg shadow-slate-200 transition-transform active:scale-95"
        >
          <div className="bg-white/10 p-3 rounded-xl mr-4">
            <Mail className="w-6 h-6" />
          </div>
          <div className="text-left">
            <p className="font-bold text-lg">Envíanos un Correo</p>
            <p className="text-slate-300 text-sm">{supportEmail}</p>
          </div>
        </a>
      </div>
    </div>
  );
}
