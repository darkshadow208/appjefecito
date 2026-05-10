import { useState } from 'react';
import { Mail, UserCircle, Key, Save, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { supabase } from '../lib/supabase';

export default function ProfileTab({ session }) {
  const user = session?.user;
  const createdAt = user?.created_at ? new Date(user.created_at) : new Date();
  
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleUpdateProfile = async () => {
    if (!fullName.trim()) return;
    
    setIsUpdating(true);
    setMessage({ type: '', text: '' });

    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName }
    });

    if (error) {
      setMessage({ type: 'error', text: 'Error al actualizar el perfil' });
    } else {
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
    setIsUpdating(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 pb-24">
      {/* Avatar Header */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col items-center justify-center mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
        
        <div className="w-24 h-24 bg-gradient-to-tr from-slate-800 to-slate-900 rounded-full flex items-center justify-center shadow-xl mb-4 relative z-10">
          <span className="text-4xl text-white font-bold uppercase">
            {fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </span>
        </div>
        
        <div className="w-full max-w-xs relative z-10">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1 ml-1">Nombre Completo</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Tu nombre"
              className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
            />
            <button
              onClick={handleUpdateProfile}
              disabled={isUpdating || fullName === user?.user_metadata?.full_name}
              className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                isUpdating || fullName === user?.user_metadata?.full_name
                  ? 'bg-slate-100 text-slate-300'
                  : 'bg-slate-900 text-white shadow-lg active:scale-95'
              }`}
            >
              <Save className="w-5 h-5" />
            </button>
          </div>
          
          {message.text && (
            <div className={`mt-2 text-center text-xs font-bold animate-in fade-in slide-in-from-top-2 ${
              message.type === 'success' ? 'text-emerald-500' : 'text-rose-500'
            }`}>
              {message.type === 'success' && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
              {message.text}
            </div>
          )}
        </div>

        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold mt-4 relative z-10">
          Cuenta Activa
        </span>
      </div>

      {/* User Data List */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 flex items-center border-b border-slate-50">
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mr-4">
            <Mail className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Correo Electrónico</p>
            <p className="text-slate-700 font-semibold truncate">{user?.email}</p>
          </div>
        </div>

        <div className="p-5 flex items-center border-b border-slate-50">
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mr-4">
            <UserCircle className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">ID de Usuario</p>
            <p className="text-slate-700 font-mono text-sm truncate">{user?.id}</p>
          </div>
        </div>

        <div className="p-5 flex items-center">
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mr-4">
            <Key className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Miembro desde</p>
            <p className="text-slate-700 font-semibold capitalize">
              {format(createdAt, "MMMM d, yyyy", { locale: es })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
