import { thaiMonths } from "@shared/schema";

export function parseThaiBirthday(dateStr: string): Date | null {
  if (!dateStr) return null;
  
  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  let year = parseInt(parts[2], 10);
  
  if (year > 2500) {
    year = year - 543;
  }
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  
  return new Date(year, month, day);
}

export function formatThaiDate(dateStr: string): string {
  const date = parseThaiBirthday(dateStr);
  if (!date) return dateStr;
  
  const day = date.getDate();
  const month = thaiMonths[date.getMonth()];
  const year = date.getFullYear() + 543;
  
  return `${day} ${month} ${year}`;
}

export function formatShortThaiDate(dateStr: string): string {
  const date = parseThaiBirthday(dateStr);
  if (!date) return dateStr;
  
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = (date.getFullYear() + 543).toString().slice(-2);
  
  return `${day}/${month}/${year}`;
}

export function getBirthMonth(dateStr: string): number {
  const date = parseThaiBirthday(dateStr);
  if (!date) return -1;
  return date.getMonth();
}

export function getDaysUntilBirthday(dateStr: string): number {
  const birthDate = parseThaiBirthday(dateStr);
  if (!birthDate) return Infinity;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const thisYearBirthday = new Date(
    today.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate()
  );
  
  if (thisYearBirthday < today) {
    thisYearBirthday.setFullYear(today.getFullYear() + 1);
  }
  
  const diffTime = thisYearBirthday.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

export function isUpcomingBirthday(dateStr: string, withinDays: number = 30): boolean {
  const days = getDaysUntilBirthday(dateStr);
  return days >= 0 && days <= withinDays;
}

export function isBirthdayToday(dateStr: string): boolean {
  return getDaysUntilBirthday(dateStr) === 0;
}

export function getAge(dateStr: string): number {
  const birthDate = parseThaiBirthday(dateStr);
  if (!birthDate) return 0;
  
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}
