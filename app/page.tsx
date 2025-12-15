// app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import PropertyCard from './components/PropertyCard'
import AgentCard from './components/AgentCard'
import SearchBar from './components/SearchBar'
import AIAssistant from './components/AIAssistant'
import { useQuery } from '@tanstack/react-query'
import { MapPin, Home, Users, Shield } from 'lucide-react'

export default function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState([])
  const [topAgents, setTopAgents] = useState([])

  const { data: properties } = useQuery({
    queryKey: ['featured-properties'],
    queryFn: async () => {
      const res = await fetch('/api/properties?featured=true&limit=6')
      return res.json()
    }
  })

  const { data: agents } = useQuery({
    queryKey: ['top-agents'],
    queryFn: async () => {
      const res = await fetch('/api/agents?top=true&limit=4')
      return res.json()
    }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section with AI Assistant */}
      <div className="mb-12">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Find Your Dream Home in East Africa
              </h1>
              <p className="text-xl mb-6 opacity-90">
                AI-powered property search with smart recommendations, virtual tours, and local expertise
              </p>
              <SearchBar />
            </div>
            <div className="md:w-1/2">
              <AIAssistant />
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <MapPin className="h-12 w-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Smart Location Search</h3>
          <p className="text-gray-600">
            Find properties using AI-powered location intelligence specific to East African cities
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <Home className="h-12 w-12 text-green-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Virtual Tours</h3>
          <p className="text-gray-600">
            360° virtual tours and AI-generated floor plans for remote viewing
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <Users className="h-12 w-12 text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Verified Agents</h3>
          <p className="text-gray-600">
            Connect with trusted, licensed real estate professionals across East Africa
          </p>
        </div>
      </div>

      {/* Featured Properties */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Featured Properties</h2>
          <a href="/properties" className="text-blue-600 hover:text-blue-800">
            View all →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties?.map((property: any) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      {/* Top Agents */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Top Agents & Agencies</h2>
          <a href="/agents" className="text-blue-600 hover:text-blue-800">
            View all →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {agents?.map((agent: any) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>

      {/* Stats */}
      <div className="bg-gray-100 rounded-2xl p-8 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600">2,500+</div>
            <div className="text-gray-600">Properties Listed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">350+</div>
            <div className="text-gray-600">Verified Agents</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600">98%</div>
            <div className="text-gray-600">Customer Satisfaction</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600">15+</div>
            <div className="text-gray-600">East African Cities</div>
          </div>
        </div>
      </div>
    </div>
  )
}