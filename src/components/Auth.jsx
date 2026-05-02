import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, ArrowRight } from 'lucide-react';

export default function Auth({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        
        // Si no hay error y se registró
        if (data?.session) {
          onLogin(data.session);
        } else {
          // If email confirmation is disabled, session might be null depending on config,
          // but usually signUp automatically logs in if email confirmation is disabled.
          // Fallback message just in case:
          alert('Cuenta creada exitosamente. Puedes iniciar sesión ahora.');
          setIsSignUp(false);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data?.session) {
          onLogin(data.session);
        }
      }
    } catch (error) {
      if (error.message.includes('Invalid login credentials')) {
        setErrorMsg('Credenciales incorrectas');
      } else {
        setErrorMsg(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50">
      
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-slate-900 rounded-[2rem] mx-auto mb-6 shadow-2xl shadow-slate-300 flex items-center justify-center rotate-3 hover:rotate-0 transition-transform">
            <span className="text-4xl">⏱️</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">App Jefecito</h1>
          <p className="text-slate-500 font-medium">
            {isSignUp ? 'Empieza a controlar tus horas' : 'Bienvenido de vuelta'}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl mb-6 text-sm font-bold text-center border border-rose-100">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="bg-white p-2 rounded-3xl shadow-sm border border-slate-100 flex flex-col space-y-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all placeholder:text-slate-400"
              placeholder="tu@correo.com"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all placeholder:text-slate-400"
              placeholder="Contraseña"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg py-4 rounded-3xl transition-transform active:scale-95 flex justify-center items-center shadow-xl shadow-slate-200 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <>
                {isSignUp ? 'Crear Cuenta' : 'Entrar'}
                <ArrowRight className="w-5 h-5 ml-2 opacity-80" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg('');
            }}
            className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            {isSignUp ? 'Ya tengo cuenta. Iniciar sesión' : '¿No tienes cuenta? Crear una'}
          </button>
        </div>
      </div>
    </div>
  );
}
