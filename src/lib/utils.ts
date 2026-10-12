import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return `रु. ${amount.toLocaleString('en-IN')}`;
}

export function formatDate(timestamp?: string | number | Date | null): string {
  if (!timestamp) return 'Just now';
  const d = new Date(timestamp);
  if (isNaN(d.getTime())) {
    if (typeof timestamp === 'string' && timestamp.trim().length > 0) {
      return timestamp;
    }
    return 'Just now';
  }
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}
