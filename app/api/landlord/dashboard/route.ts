// app/api/landlord/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['LANDLORD', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const [properties, bookings, payments, messages] = await Promise.all([
      prisma.property.findMany({
        where: { ownerId: session.user.id },
        include: {
          bookings: {
            where: { status: 'confirmed' },
            include: { user: true }
          }
        }
      }),
      prisma.booking.findMany({
        where: {
          property: { ownerId: session.user.id },
          status: 'pending'
        },
        include: {
          property: true,
          user: true
        }
      }),
      prisma.payment.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.message.findMany({
        where: { receiverId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ])

    const totalProperties = properties.length
    const totalTenants = properties.reduce((acc, prop) => acc + prop.bookings.length, 0)
    const monthlyRevenue = payments
      .filter(p => p.status === 'COMPLETED')
      .reduce((acc, p) => acc + Number(p.amount), 0)
    const occupancyRate = totalProperties > 0 
      ? (totalTenants / totalProperties * 100).toFixed(0) + '%'
      : '0%'

    return NextResponse.json({
      totalProperties,
      totalTenants,
      monthlyRevenue,
      occupancyRate,
      properties: properties.map(p => ({
        id: p.id,
        name: p.title,
        location: `${p.city}, ${p.region}`,
        type: p.type,
        tenant: p.bookings[0]?.user?.name || 'Vacant',
        rent: p.price,
        status: p.bookings.length > 0 ? 'occupied' : 'vacant'
      })),
      pendingBookings: bookings,
      recentPayments: payments.slice(0, 5),
      recentMessages: messages
    })
  } catch (error) {
    console.error('Landlord dashboard error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch landlord data' },
      { status: 500 }
    )
  }
}