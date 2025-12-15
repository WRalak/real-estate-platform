// app/properties/page.tsx
'use client'

import { useState } from 'react'
import PropertyCard from '@/components/PropertyCard'
import SearchBar from '@/components/SearchBar'
import { Filter, Grid, List, Map } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

export default function PropertiesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    sortBy: 'newest'
  })

  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      const query = new URLSearchParams(filters as any).toString()
      const res = await fetch(`/api/properties?${query}`)
      return res.json()
    }
  })

  const cities = [
    'Nairobi', 'Mombasa', 'Kampala', 'Dar es Salaam',
    'Kigali', 'Arusha', 'Nakuru', 'Kisumu', 'Jinja'
  ]

  const propertyTypes = [
    'House', 'Apartment', 'Land', 'Commercial',
    'Villa', 'Townhouse', 'Office', 'Warehouse'
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Browse Properties</h1>
        <p className="text-gray-600 text-lg">
          Discover your perfect home or investment opportunity across East Africa
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">City</label>
            <select
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Property Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">All Types</option>
              {propertyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Bedrooms</label>
            <select
              value={filters.bedrooms}
              onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Price Range</label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex border rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
              >
                <List className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600">
                <Map className="h-5 w-5" />
              </button>
            </div>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="border rounded-lg px-4 py-2"
            >
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="featured">Featured</option>
            </select>
          </div>
          <div className="text-gray-600">
            {properties?.length || 0} properties found
          </div>
        </div>
      </div>

      {/* Properties Grid/List */}
      {isLoading ? (
        <div className="text-center py-12">Loading properties...</div>
      ) : properties?.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property: any) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {properties.map((property: any) => (
              <div key={property.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex">
                  <div className="w-64 h-48 bg-gray-200 rounded-lg mr-6"></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{property.title}</h3>
                        <p className="text-gray-600 mb-2">{property.address}, {property.city}</p>
                        <div className="flex items-center space-x-4 text-gray-700">
                          <span>{property.bedrooms} beds</span>
                          <span>{property.bathrooms} baths</span>
                          <span>{property.area} m²</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-700">
                          KES {property.price.toLocaleString()}
                        </div>
                        <span className="bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded">
                          {property.type}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{property.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        {property.aiTags?.slice(0, 3).map((tag: string, index: number) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <a
                        href={`/properties/${property.id}`}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No properties found</h3>
          <p className="text-gray-600">Try adjusting your search filters</p>
        </div>
      )}

      {/* Pagination */}
      {properties?.length > 0 && (
        <div className="mt-12 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
            <button className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">
              2
            </button>
            <button className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">
              3
            </button>
            <span className="px-4 py-2 text-gray-600">...</span>
            <button className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">
              10
            </button>
            <button className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  )
}