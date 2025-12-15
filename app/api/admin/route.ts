// app/api/admin/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (type === 'pending-users') {
      const pendingUsers = await prisma.user.findMany({
        where: {
          status: 'PENDING',
          role: {
            in: ['AGENT', 'LANDLORD']
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      return NextResponse.json(pendingUsers)
    }

    if (type === 'stats') {
      const [
        totalUsers,
        totalAgents,
        totalProperties,
        totalPayments,
        recentPayments,
        recentProperties
      ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: 'AGENT' } }),
        prisma.property.count(),
        prisma.payment.count(),
        prisma.payment.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { user: true }
        }),
        prisma.property.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { owner: true }
        })
      ])

      return NextResponse.json({
        totalUsers,
        totalAgents,
        totalProperties,
        totalPayments,
        recentPayments,
        recentProperties
      })
    }

    return NextResponse.json({ error: 'Invalid request type' })
  } catch (error) {
    console.error('Admin error:', error)
    return NextResponse.json(
      { error: 'Failed to process admin request' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, userId, status, reason } = body

    if (action === 'update-user-status') {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { status }
      })

      // Create notification for the user
      await prisma.notification.create({
        data: {
          userId,
          title: 'Account Status Updated',
          message: `Your account has been ${status.toLowerCase()}. ${reason || ''}`,
          type: 'system'
        }
      })

      return NextResponse.json(user)
    }

    if (action === 'suspend-user') {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { status: 'SUSPENDED' }
      })

      // Suspend all user's active properties
      await prisma.property.updateMany({
        where: { ownerId: userId, status: 'AVAILABLE' },
        data: { status: 'PENDING' }
      })

      await prisma.notification.create({
        data: {
          userId,
          title: 'Account Suspended',
          message: `Your account has been suspended. Reason: ${reason}`,
          type: 'system'
        }
      })

      return NextResponse.json(user)
    }

    return NextResponse.json({ error: 'Invalid action' })
  } catch (error) {
    console.error('Admin action error:', error)
    return NextResponse.json(
      { error: 'Failed to process admin action' },
      { status: 500 }
    )
  }
}