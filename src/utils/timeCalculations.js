import { parse, differenceInMinutes } from 'date-fns';

const DAILY_REQUIRED_HOURS = 8;
const DAILY_REQUIRED_MINUTES = DAILY_REQUIRED_HOURS * 60;

export function calculateDailyBalance(startTimeStr, endTimeStr, isRestDay) {
  if (isRestDay) {
    return { workedMinutes: 0, balanceMinutes: 0, status: 'rest' };
  }

  if (!startTimeStr || !endTimeStr) {
    return { workedMinutes: 0, balanceMinutes: 0, status: 'incomplete' };
  }

  // Parse time assuming format HH:mm, handle cases where Supabase returns HH:mm:ss
  const cleanStart = startTimeStr.substring(0, 5);
  const cleanEnd = endTimeStr.substring(0, 5);

  const start = parse(cleanStart, 'HH:mm', new Date());
  let end = parse(cleanEnd, 'HH:mm', new Date());

  // Handle overnight shifts (e.g. 22:00 to 06:00)
  if (end < start) {
    end = new Date(end.getTime() + 24 * 60 * 60 * 1000);
  }

  const workedMinutes = differenceInMinutes(end, start);
  const balanceMinutes = workedMinutes - DAILY_REQUIRED_MINUTES;

  return {
    workedMinutes,
    balanceMinutes,
    status: balanceMinutes > 0 ? 'favorable' : balanceMinutes < 0 ? 'owed' : 'exact'
  };
}

export function formatMinutes(minutes) {
  const absMinutes = Math.abs(minutes);
  const hours = Math.floor(absMinutes / 60);
  const mins = absMinutes % 60;
  
  const sign = minutes > 0 ? '+' : minutes < 0 ? '-' : '';
  const paddedMins = mins.toString().padStart(2, '0');
  
  return `${sign}${hours}h ${paddedMins}m`;
}
