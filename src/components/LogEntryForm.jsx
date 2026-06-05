import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { Loader2, CheckCircle2, X } from 'lucide-react';

export default function LogEntryForm({ session, onLogAdded, initialData, onCancelEdit }) {
  const [loading, setLoading] = useState(false);
  const [logDate, setLogDate] = useState(initialData?.log_date || format(new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState(initialData?.start_time?.substring(0, 5) || '08:00');
  const [endTime, setEndTime] = useState(initialData?.end_time?.substring(0, 5) || '17:00');
  const [chiringuito, setChiringuito] = useState(initialData?.chiringuito || 'Saoko');
  const [tipAmount, setTipAmount] = useState(initialData?.tip_amount != null ? initialData.tip_amount.toString() : '0');
  const [isRestDay, setIsRestDay] = useState(initialData?.is_rest_day || false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (initialData) {
      setLogDate(initialData.log_date);
      setStartTime(initialData.start_time?.substring(0, 5) || '08:00');
      setEndTime(initialData.end_time?.substring(0, 5) || '17:00');
      setChiringuito(initialData.chiringuito || 'Saoko');
      setTipAmount(initialData.tip_amount != null ? initialData.tip_amount.toString() : '0');
      setIsRestDay(initialData.is_rest_day || false);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      const { data, error } = await supabase
        .from('work_logs')
        .upsert(
          {
            user_id: session.user.id,
            log_date: logDate,
            start_time: isRestDay ? null : startTime,
            end_time: isRestDay ? null : endTime,
            is_rest_day: isRestDay,
            chiringuito: isRestDay ? null : chiringuito,
            tip_amount: Number(tipAmount) || 0,
          },
          { onConflict: 'user_id, log_date' }
        )
        .select();

      if (error) throw error;
      
      setMsg({ type: 'success', text: '¡Guardado correctamente!' });
      if (onLogAdded) onLogAdded(data[0]);
      
    } catch (error) {
      setMsg({ type: 'error', text: 'Error: ' + error.message });
    } finally {
      setLoading(false);
      setTimeout(() => setMsg({ type: '', text: '' }), 3000);
    }
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-slate-800">
          {initialData ? 'Editar registro' : 'Nuevo registro'}
        </h2>
        {initialData && (
          <button 
            onClick={onCancelEdit}
            className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {msg.text && (
        <div className={`p-4 rounded-2xl mb-6 text-sm font-medium flex items-center ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {msg.type === 'success' && <CheckCircle2 className="w-5 h-5 mr-2" />}
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Fecha Card */}
        <div className="bg-slate-50 p-5 rounded-2xl">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Día a registrar</label>
          <input
            type="date"
            required
            value={logDate}
            onChange={(e) => setLogDate(e.target.value)}
            className="w-full bg-transparent text-slate-800 text-lg font-semibold focus:outline-none"
          />
        </div>

        {/* Tipo de día (Descanso) */}
        <div 
          onClick={() => {
            setIsRestDay(!isRestDay);
            if (!isRestDay) { setStartTime(''); setEndTime(''); }
          }}
          className={`p-5 rounded-2xl cursor-pointer transition-colors border-2 flex items-center space-x-3 ${
            isRestDay ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-transparent border-slate-100 text-slate-500 hover:border-slate-200'
          }`}
        >
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isRestDay ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}`}>
            {isRestDay && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
          </div>
          <span className="font-semibold">Tomé día de descanso</span>
        </div>

        {/* Horarios */}
        <div className={`transition-all duration-300 overflow-hidden ${isRestDay ? 'h-0 opacity-0' : 'h-auto opacity-100'}`}>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-orange-50 p-5 rounded-2xl">
              <label className="block text-xs font-bold text-orange-400 uppercase tracking-wider mb-2">Entrada</label>
              <input
                type="time"
                required={!isRestDay}
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-transparent text-orange-900 text-xl font-bold focus:outline-none"
              />
            </div>
            <div className="bg-purple-50 p-5 rounded-2xl">
              <label className="block text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Salida</label>
              <input
                type="time"
                required={!isRestDay}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-transparent text-purple-900 text-xl font-bold focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Chiringuito</label>
            <select
              value={chiringuito}
              onChange={(e) => setChiringuito(e.target.value)}
              disabled={isRestDay}
              className="w-full bg-transparent text-slate-800 text-lg font-semibold focus:outline-none"
            >
              <option value="Saoko">Saoko</option>
              <option value="Kalima">Kalima</option>
            </select>
            {isRestDay && <p className="mt-2 text-xs text-slate-400">No aplica en días de descanso.</p>}
          </div>
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bote / Propina</label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={tipAmount}
              onChange={(e) => setTipAmount(e.target.value)}
              className="w-full bg-transparent text-slate-800 text-lg font-semibold focus:outline-none"
            />
            <p className="mt-2 text-xs text-slate-400">Si no hubo propina, deja 0.</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg py-4 rounded-2xl transition-transform active:scale-95 flex justify-center items-center shadow-xl shadow-slate-200 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Guardar Horario'}
        </button>
      </form>
    </div>
  );
}
