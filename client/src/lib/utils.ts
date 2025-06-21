import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: string | number, currency: string = "USD"): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(numAmount);
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getStatusBadgeClass(status: string): string {
  switch (status.toUpperCase()) {
    case "AUTHORIZED":
      return "status-badge status-authorized";
    case "REFUNDED":
      return "status-badge status-refunded";
    case "REVERSED":
      return "status-badge status-reversed";
    default:
      return "status-badge";
  }
}

export function getTypeBadgeClass(type: string): string {
  switch (type.toUpperCase()) {
    case "PURCHASE":
      return "status-badge type-purchase";
    case "REFUND":
      return "status-badge type-refund";
    default:
      return "status-badge";
  }
}
