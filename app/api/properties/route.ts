// app/api/properties/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { generatePropertyAIInsights } from '@/lib/ai-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const type = searchParams.get('type')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const bedrooms = searchParams.get('bedrooms')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {
      status: 'AVAILABLE'
    }

    if (city) where.city = city
    if (type) where.type = type
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }
    if (bedrooms) where.bedrooms = parseInt(bedrooms)
    if (featured === 'true') where.featured = true

    const properties = await prisma.property.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
            agencyName: true
          }
        },
        agent: {
          select: {
            id: true,
            name: true,
            image: true,
            agencyName: true
          }
        }
      },
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(properties)
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['AGENT', 'LANDLORD', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Generate AI insights for the property
    const aiInsights = await generatePropertyAIInsights({
      title: body.title,
      description: body.description,
      price: body.price,
      location: body.address,
      city: body.city
    })

    const property = await prisma.property.create({
      data: {
        ...body,
        ownerId: session.user.id,
        aiDescription: aiInsights.description,
        aiPriceInsight: aiInsights.priceAnalysis,
        aiTags: aiInsights.tags,
        latitude: body.latitude || 0,
        longitude: body.longitude || 0
      }
    })

    // Log property view for analytics
    await prisma.propertyView.create({
      data: {
        propertyId: property.id,
        userId: session.user.id
      }
    })

    return NextResponse.json(property)
  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    )
  }
}