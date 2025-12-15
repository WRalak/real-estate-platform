// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  await prisma.property.deleteMany()
  await prisma.user.deleteMany()

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@jengaestate.com',
      name: 'Admin User',
      phone: '254700000001',
      password: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE'
    }
  })

  // Create sample agents
  const agentPassword = await bcrypt.hash('agent123', 12)
  const agents = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john@premieragents.com',
        name: 'John Kamau',
        phone: '254711222333',
        password: agentPassword,
        role: 'AGENT',
        status: 'ACTIVE',
        agencyName: 'Premier Realty Kenya',
        rating: 4.8,
        totalReviews: 42,
        experienceYears: 8,
        specialties: ['Residential', 'Luxury', 'Commercial'],
        location: 'Nairobi',
        languages: ['English', 'Swahili'],
        bio: 'Specializing in luxury properties and commercial real estate across Nairobi.'
      }
    }),
    prisma.user.create({
      data: {
        email: 'sarah@harbourhomes.com',
        name: 'Sarah Akoth',
        phone: '254722333444',
        password: agentPassword,
        role: 'AGENT',
        status: 'ACTIVE',
        agencyName: 'Harbour Homes & Properties',
        rating: 4.9,
        totalReviews: 56,
        experienceYears: 12,
        specialties: ['Coastal Properties', 'Vacation Homes', 'Investment'],
        location: 'Mombasa',
        languages: ['English', 'Swahili', 'Arabic'],
        bio: 'Coastal property expert with extensive experience in Mombasa real estate market.'
      }
    })
  ])

  // Create sample landlord
  const landlordPassword = await bcrypt.hash('landlord123', 12)
  const landlord = await prisma.user.create({
    data: {
      email: 'michael@properties.co.ke',
      name: 'Michael Ochieng',
      phone: '254733444555',
      password: landlordPassword,
      role: 'LANDLORD',
      status: 'ACTIVE',
      agencyName: 'Prime Properties Ltd',
      rating: 4.7,
      totalReviews: 28,
      experienceYears: 6,
      specialties: ['Rental Properties', 'Student Housing'],
      location: 'Kampala',
      languages: ['English', 'Swahili', 'Luganda'],
      bio: 'Property owner specializing in rental properties and student accommodations.'
    }
  })

  // Create sample properties
  const properties = await Promise.all([
    prisma.property.create({
      data: {
        title: 'Modern Apartment in Westlands',
        description: 'Beautiful 3-bedroom apartment with stunning city views. Fully furnished with modern amenities including swimming pool, gym, and 24/7 security.',
        price: 45000000,
        type: 'APARTMENT',
        status: 'AVAILABLE',
        address: 'Westlands Road',
        city: 'Nairobi',
        region: 'Nairobi County',
        country: 'Kenya',
        latitude: -1.2659,
        longitude: 36.8065,
        bedrooms: 3,
        bathrooms: 3,
        area: 180,
        yearBuilt: 2020,
        features: ['Swimming Pool', 'Gym', 'Security', 'Parking'],
        amenities: ['WiFi', 'Cable TV', 'Air Conditioning', 'Water Backup'],
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w-800'
        ],
        ownerId: landlord.id,
        agentId: agents[0].id,
        aiDescription: 'Prime location in Westlands offering luxury living with modern amenities. Perfect for professionals and families seeking convenience and security.',
        aiPriceInsight: 'Competitively priced for the Westlands area. Recent sales in this building range from KES 42M to KES 48M for similar units.',
        aiTags: ['Luxury', 'Modern', 'Secure', 'Westlands', 'Swimming Pool']
      }
    }),
    prisma.property.create({
      data: {
        title: 'Ocean View Villa in Nyali',
        description: 'Stunning 5-bedroom villa with direct ocean access. Features include private beach, infinity pool, and landscaped gardens.',
        price: 120000000,
        type: 'VILLA',
        status: 'AVAILABLE',
        address: 'Nyali Beach Road',
        city: 'Mombasa',
        region: 'Coast',
        country: 'Kenya',
        latitude: -4.0435,
        longitude: 39.6682,
        bedrooms: 5,
        bathrooms: 6,
        area: 850,
        yearBuilt: 2018,
        features: ['Private Beach', 'Infinity Pool', 'Garden', 'Security', 'Garage'],
        amenities: ['WiFi', 'Solar Power', 'Water Treatment', 'Smart Home'],
        images: [
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800'
        ],
        ownerId: landlord.id,
        agentId: agents[1].id,
        aiDescription: 'Luxury beachfront property offering privacy and exclusivity. Perfect for investors or as a vacation home with rental potential.',
        aiPriceInsight: 'Premium pricing reflects oceanfront location and exclusive amenities. Similar beachfront properties in Nyali range from KES 90M to KES 150M.',
        aiTags: ['Ocean View', 'Luxury', 'Beachfront', 'Nyali', 'Investment']
      }
    })
  ])

  // Create sample user
  const userPassword = await bcrypt.hash('user123', 12)
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      name: 'Test User',
      phone: '254744555666',
      password: userPassword,
      role: 'USER',
      status: 'ACTIVE'
    }
  })

  // Create sample review
  await prisma.review.create({
    data: {
      propertyId: properties[0].id,
      userId: user.id,
      rating: 5,
      comment: 'Excellent property! The agent was very professional and helpful throughout the process.',
      aiModerated: true
    }
  })

  // Create sample booking
  await prisma.booking.create({
    data: {
      propertyId: properties[0].id,
      userId: user.id,
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      message: 'I would like to schedule a viewing for next week.',
      status: 'pending'
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log(`👤 Admin: ${admin.email} / admin123`)
  console.log(`👤 Agent 1: ${agents[0].email} / agent123`)
  console.log(`👤 Agent 2: ${agents[1].email} / agent123`)
  console.log(`👤 Landlord: ${landlord.email} / landlord123`)
  console.log(`👤 User: ${user.email} / user123`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })