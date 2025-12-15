// types/index.ts
import { UserRole, AccountStatus } from '@prisma/client'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  status: AccountStatus
  image?: string
}

export interface Property {
  id: string
  title: string
  description: string
  price: number
  type: string
  status: string
  address: string
  city: string
  region: string
  bedrooms: number
  bathrooms: number
  area: number
  images: string[]
  latitude: number
  longitude: number
  createdAt: Date
  updatedAt: Date
  ownerId: string
  agentId?: string
}

export interface Agent {
  id: string
  name: string
  email: string
  phone: string
  agencyName?: string
  rating: number
  totalReviews: number
  experienceYears: number
  specialties: string[]
  location: string
  image?: string
}

export interface Booking {
  id: string
  propertyId: string
  userId: string
  date: Date
  status: string
  message?: string
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  propertyId?: string
  createdAt: Date
}

export interface Payment {
  id: string
  userId: string
  amount: number
  currency: string
  status: string
  type: string
  mpesaCode?: string
  stripeId?: string
  createdAt: Date
}

// NextAuth type extensions
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: UserRole
      status: AccountStatus
    }
  }

  interface User {
    role: UserRole
    status: AccountStatus
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole
    status: AccountStatus
  }
}