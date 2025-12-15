// app/api/agents/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const rating = searchParams.get('rating')
    const specialty = searchParams.get('specialty')
    const top = searchParams.get('top')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {
      status: 'ACTIVE',
      role: 'AGENT'
    }

    if (city) where.location = city
    if (rating) where.rating = { gte: parseFloat(rating) }
    if (specialty) where.specialties = { has: specialty }
    if (top === 'true') where.rating = { gte: 4.5 }

    const agents = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        agencyName: true,
        rating: true,
        totalReviews: true,
        experienceYears: true,
        specialties: true,
        location: true,
        languages: true,
        bio: true
      },
      take: limit,
      orderBy: top === 'true' 
        ? { rating: 'desc' }
        : { totalReviews: 'desc' }
    })

    return NextResponse.json(agents)
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['AGENT', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Update agent profile
    const agent = await prisma.user.update({
      where: { id: session.user.id },
      data: body
    })

    return NextResponse.json(agent)
  } catch (error) {
    console.error('Error updating agent:', error)
    return NextResponse.json(
      { error: 'Failed to update agent profile' },
      { status: 500 }
    )
  }
}