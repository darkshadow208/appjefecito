import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import LogEntryForm from './LogEntryForm';
import MonthlyTable from './MonthlyTable';
import BottomNav from './BottomNav';
import ProfileTab from './ProfileTab';
import HistoryTab from './HistoryTab';
import SettingsTab from './SettingsTab';
import MonthlyTotalsTab from './MonthlyTotalsTab';
import { format } from 'date-fns';
import { startOfMonth, endOfMonth } from 'date-fns';
import logo from '../assets/logosinfondo.png';

export default function Dashboard({ session, onLogout }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeTab, setActiveTab] = useState('summary'); // 'summary', 'register', 'profile', 'history', 'totals', 'settings'
  const [editingData, setEditingData] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    const start = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
    const end = format(endOfMonth(currentMonth), 'yyyy-MM-dd');

    const { data, error } = await supabase
      .from('work_logs')
      .select('*')
      .eq('user_id', session.user.id)
      .gte('log_date', start)
      .lte('log_date', end)
      .order('log_date', { ascending: true });

    if (!error && data) {
      setLogs(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [currentMonth, session.user.id]);

  const handleLogAdded = (newLog) => {
    // Siempre refrescamos para evitar problemas de zona horaria al comparar fechas
    fetchLogs();
    setEditingData(null); // Limpiar datos de edición tras guardar
  };

  const handleEdit = (log) => {
    setEditingData(log);
    setActiveTab('register');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-safe">
      {/* Mobile Top Header */}
      {activeTab !== 'profile' && activeTab !== 'history' && activeTab !== 'totals' && activeTab !== 'settings' && (
        <header className="px-6 pt-10 pb-6 bg-slate-50 relative z-10 flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xl">👋</span>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                ¡Hola, {session.user.user_metadata?.full_name?.split(' ')[0] || 'Jefe'}!
              </p>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {activeTab === 'summary' ? 'Tu Resumen' : 'Registrar'}
            </h1>
          </div>
          <div className="w-20 h-20 -mt-2">
            <img src={logo} alt="Logo" className="w-full h-full object-contain drop-shadow-md" />
          </div>
        </header>
      )}
      
      {/* Spacer for tabs that hide the header to avoid jumping content under notch */}
      {(activeTab === 'profile' || activeTab === 'history' || activeTab === 'totals' || activeTab === 'settings') && (
        <div className="pt-10 px-6"></div>
      )}

      {/* Main Content Area */}
      <div className="px-6">
        {activeTab === 'register' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <LogEntryForm 
              session={session} 
              onLogAdded={handleLogAdded} 
              initialData={editingData}
              onCancelEdit={() => {
                setEditingData(null);
                setActiveTab('summary');
              }}
            />
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <MonthlyTable 
              logs={logs} 
              currentMonth={currentMonth} 
              setCurrentMonth={setCurrentMonth}
              loading={loading}
              onEdit={handleEdit}
            />
          </div>
        )}

        {activeTab === 'profile' && <ProfileTab session={session} />}
        
        {activeTab === 'history' && <HistoryTab session={session} />}
        
        {activeTab === 'totals' && <MonthlyTotalsTab session={session} />}
        
        {activeTab === 'settings' && <SettingsTab onLogout={onLogout} />}
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
