import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { calculateDailyBalance, formatMinutes } from '../utils/timeCalculations';

export default function HistoryTab({ session }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllLogs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('work_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .order('log_date', { ascending: false });

      if (!error && data) {
        setLogs(data);
      }
      setLoading(false);
    };

    fetchAllLogs();
  }, [session.user.id]);

  const { totalBalance, favorableMinutes, owedMinutes, recentLogs } = useMemo(() => {
    let totalMinutes = 0;
    let favMin = 0;
    let oweMin = 0;
    
    const processedLogs = logs.map(log => {
      let status = 'empty';
      let balanceStr = 'Sin registro';
      let timeStr = '-';
      let balanceMinutes = 0;
      
      if (log.is_rest_day) {
        status = 'rest';
        balanceStr = 'Día Libre';
        timeStr = 'Descanso';
      } else {
        const cleanStart = log.start_time?.substring(0, 5);
        const cleanEnd = log.end_time?.substring(0, 5);
        const calc = calculateDailyBalance(cleanStart, cleanEnd, false);
        
        balanceMinutes = calc.balanceMinutes;
        totalMinutes += balanceMinutes;
        
        if (balanceMinutes > 0) favMin += balanceMinutes;
        if (balanceMinutes < 0) oweMin += balanceMinutes;
        
        timeStr = `${cleanStart || '?'} - ${cleanEnd || '?'}`;
        balanceStr = formatMinutes(calc.balanceMinutes);
        status = calc.status;
      }
      
      return {
        ...log,
        status,
        balanceStr,
        timeStr,
        dateObj: new Date(log.log_date)
      };
    });

    return { 
      totalBalance: totalMinutes,
      favorableMinutes: favMin,
      owedMinutes: oweMin,
      recentLogs: processedLogs.slice(0, 30) // Only show last 30 for performance in timeline
    };
  }, [logs]);

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 pb-24">
      {/* Global Balance Card */}
      <div className="bg-slate-900 p-6 rounded-[2rem] shadow-xl shadow-slate-200 mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">Balance Global</p>
            <p className="text-3xl font-bold relative z-10">
              {formatMinutes(totalBalance)}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-bold relative z-10 ${
            totalBalance >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
          }`}>
            {totalBalance >= 0 ? 'A favor' : 'Deuda'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-slate-700/50 pt-4 relative z-10">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Horas Extra</p>
            <p className="text-lg font-bold text-emerald-400">+{formatMinutes(favorableMinutes).replace('+', '')}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Horas que Debo</p>
            <p className="text-lg font-bold text-rose-400">-{formatMinutes(Math.abs(owedMinutes)).replace('+', '')}</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Últimos Registros</h3>
      
      {recentLogs.length === 0 ? (
        <div className="bg-white p-8 rounded-[2rem] text-center border border-slate-100">
          <p className="text-slate-400 font-medium">Aún no hay registros en tu historial.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentLogs.map((log) => (
            <div key={log.id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 capitalize mb-1">
                  {format(log.dateObj, "d 'de' MMMM, yyyy", { locale: es })}
                </p>
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${
                    log.status === 'favorable' ? 'bg-emerald-500' :
                    log.status === 'owed' ? 'bg-rose-500' :
                    log.status === 'rest' ? 'bg-blue-500' : 'bg-slate-300'
                  }`}></span>
                  <p className="text-sm font-medium text-slate-500">
                    {log.timeStr}
                  </p>
                </div>
              </div>

              <div className="text-right pl-4 border-l border-slate-100">
                <span className={`inline-block px-3 py-1 rounded-xl text-sm font-bold ${
                  log.status === 'favorable' ? 'text-emerald-600 bg-emerald-50' :
                  log.status === 'owed' ? 'text-rose-600 bg-rose-50' :
                  log.status === 'rest' ? 'text-blue-600 bg-blue-50' :
                  'text-slate-400 bg-slate-50'
                }`}>
                  {log.balanceStr}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
