// components/SearchBar.tsx
'use client'

import { useState } from 'react'
import { Search, Filter, MapPin, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SearchBar() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    type: '',
    city: '',
    minPrice: '',
    maxPrice: ''
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const query = new URLSearchParams({
      search: searchQuery,
      ...filters
    }).toString()
    router.push(`/properties?${query}`)
  }

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="bg-white rounded-xl shadow-lg p-2">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          {/* Main Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search properties, locations, or agents..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Property Type */}
          <div className="md:w-48">
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          {/* City */}
          <div className="md:w-48">
            <select
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Cities</option>
              <option value="nairobi">Nairobi</option>
              <option value="mombasa">Mombasa</option>
              <option value="kampala">Kampala</option>
              <option value="dar-es-salaam">Dar es Salaam</option>
              <option value="kigali">Kigali</option>
            </select>
          </div>

          {/* Search Button */}
          <div>
            <button
              type="submit"
              className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 flex items-center justify-center"
            >
              <Search className="h-5 w-5 mr-2" />
              Search
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <Filter className="h-5 w-5 mr-2" />
            Advanced Filters
          </button>
          <div className="text-sm text-gray-600">
            Try: "Nairobi apartments" or "4 bedroom houses"
          </div>
        </div>
      </div>
    </form>
  )
}