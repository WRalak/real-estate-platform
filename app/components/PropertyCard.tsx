// components/PropertyCard.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MapPin, Bed, Bath, Square, Heart, Eye } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

interface PropertyCardProps {
  property: {
    id: string
    title: string
    price: number
    type: string
    address: string
    city: string
    bedrooms: number
    bathrooms: number
    area: number
    images: string[]
    aiTags: string[]
  }
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image Slider */}
      <div className="relative h-64">
        {property.images.length > 0 ? (
          <Image
            src={property.images[imageIndex]}
            alt={property.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Home className="h-12 w-12 text-gray-400" />
          </div>
        )}
        
        {/* Image Navigation */}
        {property.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {property.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setImageIndex(index)}
                className={`w-2 h-2 rounded-full ${index === imageIndex ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white"
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>
        
        {/* AI Tags */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-1">
          {property.aiTags?.slice(0, 2).map((tag: string, index: number) => (
            <span key={index} className="bg-blue-600/90 text-white text-xs px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      {/* Property Details */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900">{property.title}</h3>
          <span className="text-lg font-bold text-blue-700">
            {formatPrice(property.price, 'KES')}
          </span>
        </div>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{property.address}, {property.city}</span>
        </div>
        
        <div className="flex items-center justify-between text-gray-700 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>{property.bedrooms} beds</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{property.bathrooms} baths</span>
            </div>
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              <span>{property.area} m²</span>
            </div>
          </div>
          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
            {property.type}
          </span>
        </div>
        
        {/* AI Description Preview */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          Prime location with modern amenities. Perfect for families and professionals.
        </p>
        
        <div className="flex justify-between items-center">
          <Link
            href={`/properties/${property.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
          <button className="flex items-center text-gray-600 hover:text-blue-600">
            <Eye className="h-4 w-4 mr-1" />
            <span className="text-sm">Virtual Tour</span>
          </button>
        </div>
      </div>
    </div>
  )
}