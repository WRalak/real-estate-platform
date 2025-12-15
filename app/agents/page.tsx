// app/agents/page.tsx
'use client'

import { useState } from 'react'
import AgentCard from '@/components/AgentCard'
import SearchBar from '@/components/SearchBar'
import { Filter, MapPin, Star, Award } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

export default function AgentsPage() {
  const [filters, setFilters] = useState({
    city: '',
    rating: '',
    specialty: ''
  })

  const { data: agents, isLoading } = useQuery({
    queryKey: ['agents', filters],
    queryFn: async () => {
      const query = new URLSearchParams(filters as any).toString()
      const res = await fetch(`/api/agents?${query}`)
      return res.json()
    }
  })

  const specialties = [
    'Residential', 'Commercial', 'Luxury', 'Rental',
    'Investment', 'Land', 'Industrial', 'Agricultural'
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Find Expert Real Estate Agents</h1>
        <p className="text-gray-600 text-lg">
          Connect with verified agents and agencies across East Africa
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">City</label>
            <select
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">All Cities</option>
              <option value="Nairobi">Nairobi</option>
              <option value="Mombasa">Mombasa</option>
              <option value="Kampala">Kampala</option>
              <option value="Dar es Salaam">Dar es Salaam</option>
              <option value="Kigali">Kigali</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Minimum Rating</label>
            <select
              value={filters.rating}
              onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">Any Rating</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Specialty</label>
            <select
              value={filters.specialty}
              onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">All Specialties</option>
              {specialties.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <button className="flex items-center text-gray-600 hover:text-blue-600">
              <Filter className="h-5 w-5 mr-2" />
              More Filters
            </button>
          </div>
          <div className="text-gray-600">
            {agents?.length || 0} agents found
          </div>
        </div>
      </div>

      {/* Featured Agents */}
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <Award className="h-8 w-8 text-yellow-500 mr-3" />
          <h2 className="text-2xl font-bold">Top Rated Agents</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {agents
            ?.filter((agent: any) => agent.rating >= 4.5)
            .slice(0, 4)
            .map((agent: any) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
        </div>
      </div>

      {/* All Agents */}
      <div>
        <h2 className="text-2xl font-bold mb-6">All Agents & Agencies</h2>
        {isLoading ? (
          <div className="text-center py-12">Loading agents...</div>
        ) : agents?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent: any) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No agents found</h3>
            <p className="text-gray-600">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold">500+</div>
            <div className="text-blue-200">Verified Agents</div>
          </div>
          <div>
            <div className="text-3xl font-bold">98%</div>
            <div className="text-blue-200">Satisfaction Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold">15+</div>
            <div className="text-blue-200">Years Experience Avg.</div>
          </div>
          <div>
            <div className="text-3xl font-bold">24/7</div>
            <div className="text-blue-200">Support Available</div>
          </div>
        </div>
      </div>
    </div>
  )
}