import { CalendarDays, PlusCircle, User, Clock, Settings, BarChart3 } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 px-4 pb-2 pt-4 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pointer-events-none flex justify-center z-50">
      
      {/* Fondo del menú */}
      <div className="bg-slate-900 rounded-[2rem] px-2 py-2 flex items-center justify-between w-full max-w-sm shadow-2xl pointer-events-auto relative">
        
        {/* Lado Izquierdo (2 botones) */}
        <div className="flex-1 flex justify-around items-center">
          <button 
            onClick={() => setActiveTab('summary')}
            className={`flex flex-col items-center justify-center w-10 h-10 transition-colors ${activeTab === 'summary' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <CalendarDays className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center w-10 h-10 transition-colors ${activeTab === 'profile' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <User className="w-5 h-5" />
          </button>
        </div>

        {/* Centro: El botón flotante (FAB) perfectamente alineado */}
        <div className="w-16 flex-shrink-0 flex justify-center relative">
          <div className="absolute -top-10">
            <button 
              onClick={() => setActiveTab('register')}
              className={`flex items-center justify-center w-16 h-16 rounded-full shadow-xl shadow-rose-500/30 transition-transform active:scale-95 border-4 border-slate-50 ${
                activeTab === 'register' 
                  ? 'bg-rose-500 text-white scale-110' 
                  : 'bg-rose-400 text-white hover:bg-rose-500'
              }`}
            >
              <PlusCircle className="w-8 h-8" />
            </button>
          </div>
        </div>

        {/* Lado Derecho (3 botones) */}
        <div className="flex-1 flex justify-around items-center">
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center justify-center w-10 h-10 transition-colors ${activeTab === 'history' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Clock className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setActiveTab('totals')}
            className={`flex flex-col items-center justify-center w-10 h-10 transition-colors ${activeTab === 'totals' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <BarChart3 className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center justify-center w-10 h-10 transition-colors ${activeTab === 'settings' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}
