// app/dashboard/agent/page.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { 
  PlusCircle, BarChart3, MessageSquare, 
  DollarSign, Users, Home, 
  MapPin, Upload, Settings
} from 'lucide-react'
import PropertyCard from '@/components/PropertyCard'
import { useQuery } from '@tanstack/react-query'
import PaymentModal from '@/components/PaymentModal'

export default function AgentDashboard() {
  const { data: session } = useSession()
  const [showAddProperty, setShowAddProperty] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const { data: agentProperties, refetch } = useQuery({
    queryKey: ['agent-properties'],
    queryFn: async () => {
      const res = await fetch('/api/properties/agent')
      return res.json()
    }
  })

  const { data: stats } = useQuery({
    queryKey: ['agent-stats'],
    queryFn: async () => {
      const res = await fetch('/api/agents/stats')
      return res.json()
    }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dashboard Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Agent Dashboard</h1>
            <p className="text-gray-600">Welcome back, {session?.user?.name}</p>
          </div>
          <button
            onClick={() => setShowAddProperty(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add New Property
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center">
            <Home className="h-10 w-10 text-blue-600 mr-4" />
            <div>
              <div className="text-2xl font-bold">{stats?.totalProperties || 0}</div>
              <div className="text-gray-600">Properties</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center">
            <Users className="h-10 w-10 text-green-600 mr-4" />
            <div>
              <div className="text-2xl font-bold">{stats?.totalViews || 0}</div>
              <div className="text-gray-600">Property Views</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center">
            <MessageSquare className="h-10 w-10 text-purple-600 mr-4" />
            <div>
              <div className="text-2xl font-bold">{stats?.totalMessages || 0}</div>
              <div className="text-gray-600">Messages</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center">
            <BarChart3 className="h-10 w-10 text-orange-600 mr-4" />
            <div>
              <div className="text-2xl font-bold">{stats?.responseRate || '0%'}</div>
              <div className="text-gray-600">Response Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => setShowAddProperty(true)}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <Upload className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="font-medium">Add Property</div>
          </button>
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
            <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="font-medium">Payment Status</div>
          </button>
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
            <MapPin className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="font-medium">Area Insights</div>
          </button>
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
            <Settings className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <div className="font-medium">Settings</div>
          </button>
        </div>
      </div>

      {/* Properties List */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Properties</h2>
          <select className="border rounded-lg px-4 py-2">
            <option>All Properties</option>
            <option>Available</option>
            <option>Rented</option>
            <option>Sold</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agentProperties?.map((property: any) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>

      {/* Add Property Modal */}
      {showAddProperty && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Add New Property</h2>
            <form onSubmit={(e) => {
              e.preventDefault()
              // Handle form submission
              setShowAddProperty(false)
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Property Title</label>
                  <input type="text" className="w-full border rounded-lg px-4 py-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Price (KES)</label>
                  <input type="number" className="w-full border rounded-lg px-4 py-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Property Type</label>
                  <select className="w-full border rounded-lg px-4 py-2">
                    <option>House</option>
                    <option>Apartment</option>
                    <option>Land</option>
                    <option>Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bedrooms</label>
                  <input type="number" className="w-full border rounded-lg px-4 py-2" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <input type="text" className="w-full border rounded-lg px-4 py-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <select className="w-full border rounded-lg px-4 py-2">
                    <option>Nairobi</option>
                    <option>Mombasa</option>
                    <option>Kampala</option>
                    <option>Dar es Salaam</option>
                    <option>Kigali</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Area (m²)</label>
                  <input type="number" className="w-full border rounded-lg px-4 py-2" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea className="w-full border rounded-lg px-4 py-2 h-32"></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Upload Images</label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Drag & drop images or click to browse</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddProperty(false)}
                  className="px-6 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <PaymentModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
      />
    </div>
  )
}