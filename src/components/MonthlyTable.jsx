import { useMemo } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { calculateDailyBalance, formatMinutes } from '../utils/timeCalculations';
import { Edit2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function MonthlyTable({ logs, currentMonth, setCurrentMonth, loading, onEdit }) {
  const daysInMonth = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const monthData = useMemo(() => {
    let totalBalanceMinutes = 0;
    let favorableMinutes = 0;
    let owedMinutes = 0;
    
    const rows = daysInMonth.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const log = logs.find(l => l.log_date === dateStr);
      
      let status = 'empty';
      let balanceStr = 'Sin registro';
      let timeStr = '-';
      
      if (log) {
        if (log.is_rest_day) {
          status = 'rest';
          balanceStr = 'Día Libre';
          timeStr = 'Descanso';
        } else {
          // Send only the first 5 chars HH:mm
          const cleanStart = log.start_time?.substring(0, 5);
          const cleanEnd = log.end_time?.substring(0, 5);
          const calc = calculateDailyBalance(cleanStart, cleanEnd, false);
          
          totalBalanceMinutes += calc.balanceMinutes;
          if (calc.balanceMinutes > 0) favorableMinutes += calc.balanceMinutes;
          if (calc.balanceMinutes < 0) owedMinutes += calc.balanceMinutes;
          
          timeStr = `${cleanStart || '?'} - ${cleanEnd || '?'}`;
          balanceStr = formatMinutes(calc.balanceMinutes);
          status = calc.status;
        }
      }
      
      return {
        date: day,
        dateStr,
        timeStr,
        balanceStr,
        status,
        log
      };
    });
    
    return { rows, totalBalanceMinutes, favorableMinutes, owedMinutes };
  }, [daysInMonth, logs]);

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="pb-8">
      {/* Month Navigator Header */}
      <div className="flex items-center justify-between mb-6 px-1">
        <button 
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 bg-white rounded-full shadow-sm border border-slate-100 text-slate-600 hover:bg-slate-50 active:scale-90 transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        
        <h2 className="text-xl font-extrabold text-slate-800 capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </h2>

        <button 
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 bg-white rounded-full shadow-sm border border-slate-100 text-slate-600 hover:bg-slate-50 active:scale-90 transition-all"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Total Card */}
      <div className="bg-slate-900 p-6 rounded-[2rem] shadow-xl shadow-slate-200 mb-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">Balance Mensual</p>
            <p className="text-3xl font-bold">
              {formatMinutes(monthData.totalBalanceMinutes)}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-bold relative z-10 ${
            monthData.totalBalanceMinutes >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
          }`}>
            {monthData.totalBalanceMinutes >= 0 ? 'A favor' : 'Deuda'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-slate-700/50 pt-4 relative z-10">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Horas Extra</p>
            <p className="text-lg font-bold text-emerald-400">+{formatMinutes(monthData.favorableMinutes).replace('+', '')}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Horas que Debo</p>
            <p className="text-lg font-bold text-rose-400">-{formatMinutes(Math.abs(monthData.owedMinutes)).replace('+', '')}</p>
          </div>
        </div>
      </div>
      
      {/* Daily Cards List */}
      <div className="space-y-4">
        {monthData.rows.map((row) => (
          <button 
            key={row.dateStr} 
            onClick={() => row.log && onEdit(row.log)}
            disabled={!row.log}
            className={`w-full text-left bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between transition-all ${
              row.log ? 'hover:border-slate-300 active:scale-[0.98] cursor-pointer' : 'opacity-80 grayscale-[0.5]'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-xl flex flex-col justify-center items-center font-bold ${
                row.status === 'favorable' ? 'bg-emerald-50 text-emerald-600' :
                row.status === 'owed' ? 'bg-rose-50 text-rose-600' :
                row.status === 'rest' ? 'bg-blue-50 text-blue-600' :
                'bg-slate-50 text-slate-400'
              }`}>
                <span className="text-xs uppercase">{format(row.date, 'eee', { locale: es })}</span>
                <span className="text-lg leading-none">{format(row.date, 'dd')}</span>
              </div>
              
              <div className="relative">
                <p className="font-bold text-slate-800">
                  {row.status === 'empty' ? 'Falta registrar' : row.timeStr}
                </p>
                <div className="flex items-center space-x-1">
                  <p className="text-xs font-medium text-slate-400">
                    {row.status === 'rest' ? 'Recuperación' : row.status === 'empty' ? 'Desconocido' : 'Horario Laboral'}
                  </p>
                  {row.log && <Edit2 className="w-3 h-3 text-slate-300" />}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                row.status === 'favorable' ? 'text-emerald-600 bg-emerald-50' :
                row.status === 'owed' ? 'text-rose-600 bg-rose-50' :
                row.status === 'rest' ? 'text-blue-600 bg-blue-50' :
                'text-slate-400 bg-slate-50'
              }`}>
                {row.balanceStr}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
