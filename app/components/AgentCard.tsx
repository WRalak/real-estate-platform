// components/AgentCard.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MapPin, Star, Phone, MessageCircle, Award } from 'lucide-react'
import Link from 'next/link'

interface AgentCardProps {
  agent: {
    id: string
    name: string
    agencyName: string
    image: string
    rating: number
    totalReviews: number
    location: string
    specialties: string[]
    experienceYears: number
    languages: string[]
  }
}

export default function AgentCard({ agent }: AgentCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Agent Header */}
      <div className="p-6">
        <div className="flex items-start">
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200">
            {agent.image ? (
              <Image
                src={agent.image}
                alt={agent.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {agent.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          
          <div className="ml-4 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">{agent.name}</h3>
                <p className="text-gray-600">{agent.agencyName}</p>
              </div>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="text-gray-400 hover:text-red-500"
              >
                <Star className={`h-6 w-6 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>
            
            {/* Rating */}
            <div className="flex items-center mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(agent.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-700 font-medium">{agent.rating.toFixed(1)}</span>
              <span className="ml-2 text-gray-500">({agent.totalReviews} reviews)</span>
            </div>
            
            {/* Location */}
            <div className="flex items-center mt-2 text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{agent.location}</span>
            </div>
          </div>
        </div>
        
        {/* Experience */}
        <div className="mt-4 flex items-center justify-between">
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
            {agent.experienceYears}+ years experience
          </div>
          {agent.experienceYears > 10 && (
            <div className="flex items-center text-yellow-600">
              <Award className="h-4 w-4 mr-1" />
              <span className="text-sm">Top Agent</span>
            </div>
          )}
        </div>
        
        {/* Specialties */}
        <div className="mt-4">
          <div className="text-sm text-gray-600 mb-2">Specialties:</div>
          <div className="flex flex-wrap gap-2">
            {agent.specialties?.slice(0, 3).map((specialty: string, index: number) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
        
        {/* Languages */}
        {agent.languages?.length > 0 && (
          <div className="mt-4">
            <div className="text-sm text-gray-600 mb-2">Languages:</div>
            <div className="flex flex-wrap gap-2">
              {agent.languages.map((lang: string, index: number) => (
                <span
                  key={index}
                  className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Actions */}
      <div className="border-t p-6">
        <div className="grid grid-cols-2 gap-3">
          <Link
            href={`/agents/${agent.id}`}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-center"
          >
            View Profile
          </Link>
          <div className="grid grid-cols-2 gap-2">
            <button className="border border-blue-600 text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 flex items-center justify-center">
              <Phone className="h-4 w-4" />
            </button>
            <button className="border border-green-600 text-green-600 py-2 px-3 rounded-lg hover:bg-green-50 flex items-center justify-center">
              <MessageCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}