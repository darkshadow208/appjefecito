import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { format, parseISO, addMonths, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { calculateDailyBalance, formatMinutes } from '../utils/timeCalculations';
import { BarChart3, ChevronLeft, ChevronRight, Clock, Calendar } from 'lucide-react';

export default function MonthlyTotalsTab({ session }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  const selectedMonthData = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    
    let totalMinutes = 0;
    let daysCount = 0;
    
    const monthLogs = logs.filter(log => {
      const logDate = parseISO(log.log_date);
      return isWithinInterval(logDate, { start, end });
    });

    monthLogs.forEach(log => {
      if (log.is_rest_day) return;
      
      const cleanStart = log.start_time?.substring(0, 5);
      const cleanEnd = log.end_time?.substring(0, 5);
      const { workedMinutes } = calculateDailyBalance(cleanStart, cleanEnd, false);
      
      totalMinutes += workedMinutes;
      daysCount += 1;
    });

    return {
      totalMinutes,
      daysCount,
      monthName: format(currentMonth, 'MMMM yyyy', { locale: es })
    };
  }, [logs, currentMonth]);

  const historicalStats = useMemo(() => {
    let total = 0;
    const monthsSet = new Set();
    
    logs.forEach(log => {
      if (log.is_rest_day) return;
      const cleanStart = log.start_time?.substring(0, 5);
      const cleanEnd = log.end_time?.substring(0, 5);
      const { workedMinutes } = calculateDailyBalance(cleanStart, cleanEnd, false);
      total += workedMinutes;
      monthsSet.add(format(parseISO(log.log_date), 'yyyy-MM'));
    });

    return {
      total,
      avg: monthsSet.size > 0 ? total / monthsSet.size : 0
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
      {/* Month Navigator */}
      <div className="flex items-center justify-between mb-6 px-1">
        <button 
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-600 hover:bg-slate-50 active:scale-90 transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="text-center">
          <h2 className="text-xl font-extrabold text-slate-800 capitalize">
            {selectedMonthData.monthName}
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Consulta de Totales</p>
        </div>

        <button 
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-600 hover:bg-slate-50 active:scale-90 transition-all"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Main Total Card for Selected Month */}
      <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200 mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -ml-10 -mb-10"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs mb-2">Total Horas Trabajadas</p>
          <h3 className="text-5xl font-black tracking-tighter mb-2">
            {formatMinutes(selectedMonthData.totalMinutes).replace('+', '')}
          </h3>
          <div className="flex items-center space-x-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/5">
            <Calendar className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-sm font-bold text-slate-200">
              {selectedMonthData.daysCount} días registrados
            </span>
          </div>
        </div>
      </div>

      {/* Historical Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-3">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Promedio Mensual</p>
          <p className="text-lg font-black text-slate-800">
            {formatMinutes(historicalStats.avg).replace('+', '')}
          </p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Histórico</p>
          <p className="text-lg font-black text-slate-800">
            {formatMinutes(historicalStats.total).replace('+', '')}
          </p>
        </div>
      </div>

      {/* Additional Info / Tip */}
      <div className="mt-8 p-6 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
        <p className="text-xs text-slate-400 text-center font-medium leading-relaxed">
          Este total representa la suma de todas las horas registradas en el mes de <span className="font-bold text-slate-600 capitalize">{format(currentMonth, 'MMMM', { locale: es })}</span>, sin aplicar descuentos por horas requeridas.
        </p>
      </div>
    </div>
  );
}
