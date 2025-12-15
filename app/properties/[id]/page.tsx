// app/properties/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { 
  MapPin, Bed, Bath, Square, Car, Users, 
  Wifi, Coffee, Dumbbell, Heart, Share2, 
  MessageCircle, Phone, Calendar
} from 'lucide-react'
import MapComponent from '@/components/MapComponent'
import { useQuery } from '@tanstack/react-query'
import { formatPrice } from '@/lib/utils'
import AIAssistant from '@/components/AIAssistant'

export default function PropertyDetailPage() {
  const params = useParams()
  const [activeImage, setActiveImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', params.id],
    queryFn: async () => {
      const res = await fetch(`/api/properties/${params.id}`)
      return res.json()
    }
  })

  const { data: similarProperties } = useQuery({
    queryKey: ['similar-properties', params.id],
    queryFn: async () => {
      const res = await fetch(`/api/properties/similar?id=${params.id}`)
      return res.json()
    }
  })

  if (isLoading) {
    return <div className="text-center py-12">Loading property details...</div>
  }

  if (!property) {
    return <div className="text-center py-12">Property not found</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-6">
        <a href="/" className="hover:text-blue-600">Home</a> &gt;
        <a href="/properties" className="hover:text-blue-600 mx-1">Properties</a> &gt;
        <span className="text-gray-900 ml-1">{property.city}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images & Details */}
        <div className="lg:col-span-2">
          {/* Main Image */}
          <div className="relative h-96 rounded-xl overflow-hidden mb-4">
            <Image
              src={property.images[activeImage] || '/placeholder.jpg'}
              alt={property.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="bg-white/80 p-2 rounded-full hover:bg-white"
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </button>
              <button className="bg-white/80 p-2 rounded-full hover:bg-white">
                <Share2 className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-2 mb-8">
            {property.images.map((img: string, index: number) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`relative h-24 rounded-lg overflow-hidden ${
                  activeImage === index ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <Image
                  src={img}
                  alt={`${property.title} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{property.address}, {property.city}, {property.region}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-700">
                  {formatPrice(property.price, 'KES')}
                </div>
                <div className="text-gray-600">{property.type}</div>
              </div>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <Bed className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="font-semibold">{property.bedrooms} Bedrooms</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <Bath className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="font-semibold">{property.bathrooms} Bathrooms</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <Square className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="font-semibold">{property.area} m²</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <Car className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="font-semibold">2 Parking</div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
              
              {/* AI Generated Insights */}
              {property.aiDescription && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">AI Insights</h3>
                  <p className="text-blue-700">{property.aiDescription}</p>
                </div>
              )}
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities?.map((amenity: string, index: number) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Location</h2>
              <div className="h-96 rounded-xl overflow-hidden">
                <MapComponent 
                  latitude={property.latitude}
                  longitude={property.longitude}
                  markers={[{
                    lat: property.latitude,
                    lng: property.longitude,
                    title: property.title
                  }]}
                />
              </div>
              <div className="mt-4 text-gray-600">
                <p><strong>Neighborhood:</strong> Prime residential area with 24/7 security</p>
                <p><strong>Distance to CBD:</strong> 15 minutes</p>
                <p><strong>Nearby:</strong> Schools, Shopping Malls, Hospitals</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Contact & Actions */}
        <div className="space-y-6">
          {/* Contact Box */}
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
            {property.agent && (
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                    <Image
                      src={property.agent.image || '/default-avatar.jpg'}
                      alt={property.agent.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{property.agent.name}</h3>
                    <p className="text-gray-600 text-sm">{property.agent.agencyName}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-yellow-500">★★★★☆</span>
                      <span className="text-gray-600 text-sm ml-2">({property.agent.totalReviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => setShowContactForm(true)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Send Message
              </button>
              <button className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 flex items-center justify-center">
                <Phone className="h-5 w-5 mr-2" />
                Call Agent
              </button>
              <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 flex items-center justify-center">
                <Calendar className="h-5 w-5 mr-2" />
                Schedule Viewing
              </button>
            </div>

            {/* AI Assistant for Property */}
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-semibold mb-3">AI Property Assistant</h4>
              <AIAssistant 
                context={`Property: ${property.title}, Price: ${property.price}, Location: ${property.city}`}
              />
            </div>
          </div>

          {/* Price Insights */}
          {property.aiPriceInsight && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold mb-3">AI Price Analysis</h3>
              <p className="text-gray-700 text-sm">{property.aiPriceInsight}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}