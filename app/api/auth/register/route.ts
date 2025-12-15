// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, phone, role } = body

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role,
        // Set status based on role
        status: role === 'USER' ? 'ACTIVE' : 'PENDING'
      }
    })

    // Create welcome notification
    if (role !== 'USER') {
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: 'Account Pending Approval',
          message: 'Your account is pending admin approval. You will be notified once approved.',
          type: 'system'
        }
      })
    }

    return NextResponse.json(
      { 
        message: 'User created successfully',
        userId: user.id 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}