// app/api/user/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const [recentProperties, favorites, messages, bookings] = await Promise.all([
      prisma.propertyView.findMany({
        where: { userId: session.user.id },
        include: {
          property: {
            select: {
              id: true,
              title: true,
              price: true,
              city: true,
              images: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      prisma.favorite.findMany({
        where: { userId: session.user.id },
        include: {
          property: {
            select: {
              id: true,
              title: true,
              price: true,
              city: true,
              images: true
            }
          }
        }
      }),
      prisma.message.findMany({
        where: { 
          OR: [
            { senderId: session.user.id },
            { receiverId: session.user.id }
          ]
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),
      prisma.booking.findMany({
        where: { userId: session.user.id },
        include: {
          property: {
            select: {
              id: true,
              title: true,
              images: true
            }
          }
        },
        orderBy: { date: 'asc' }
      })
    ])

    return NextResponse.json({
      recentProperties,
      favoritesCount: favorites.length,
      unreadMessages: messages.filter(m => !m.read).length,
      upcomingBookings: bookings,
      propertiesViewed: recentProperties.length,
      agentsContacted: new Set(messages.map(m => m.receiverId)).size,
      activeSearches: 0 // Can implement search history tracking
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}