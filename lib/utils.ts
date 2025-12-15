// lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency: string = 'KES'): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(d)
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

export function getEastAfricanCities() {
  return [
    { name: 'Nairobi', country: 'Kenya', coordinates: { lat: -1.286389, lng: 36.817223 } },
    { name: 'Mombasa', country: 'Kenya', coordinates: { lat: -4.0435, lng: 39.6682 } },
    { name: 'Kampala', country: 'Uganda', coordinates: { lat: 0.3136, lng: 32.5811 } },
    { name: 'Dar es Salaam', country: 'Tanzania', coordinates: { lat: -6.7924, lng: 39.2083 } },
    { name: 'Kigali', country: 'Rwanda', coordinates: { lat: -1.9441, lng: 30.0619 } },
    { name: 'Arusha', country: 'Tanzania', coordinates: { lat: -3.3869, lng: 36.6822 } },
    { name: 'Nakuru', country: 'Kenya', coordinates: { lat: -0.3031, lng: 36.0800 } },
    { name: 'Kisumu', country: 'Kenya', coordinates: { lat: -0.1022, lng: 34.7617 } },
    { name: 'Addis Ababa', country: 'Ethiopia', coordinates: { lat: 9.0320, lng: 38.7469 } },
    { name: 'Jinja', country: 'Uganda', coordinates: { lat: 0.4403, lng: 33.2028 } }
  ]
}