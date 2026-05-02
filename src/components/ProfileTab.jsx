import { Mail, UserCircle, Key } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function ProfileTab({ session }) {
  const user = session?.user;
  const createdAt = user?.created_at ? new Date(user.created_at) : new Date();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 pb-24">
      {/* Avatar Header */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col items-center justify-center mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
        
        <div className="w-24 h-24 bg-gradient-to-tr from-slate-800 to-slate-900 rounded-full flex items-center justify-center shadow-xl mb-4 relative z-10">
          <span className="text-4xl text-white font-bold uppercase">
            {user?.email?.charAt(0) || 'U'}
          </span>
        </div>
        <h2 className="text-xl font-bold text-slate-800 relative z-10 truncate max-w-full">
          Mi Perfil
        </h2>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold mt-2 relative z-10">
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
