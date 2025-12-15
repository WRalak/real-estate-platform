// app/(dashboard)/landlord/page.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { 
  PlusCircle, DollarSign, FileText, 
  BarChart3, Home, Users, MessageSquare
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

export default function LandlordDashboard() {
  const { data: session } = useSession()
  const [showAddProperty, setShowAddProperty] = useState(false)

  const { data: landlordData } = useQuery({
    queryKey: ['landlord-dashboard'],
    queryFn: async () => {
      const res = await fetch('/api/landlord/dashboard')
      return res.json()
    }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Landlord Dashboard</h1>
        <p className="text-gray-600">Manage your properties and tenants</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center">
            <Home className="h-10 w-10 text-blue-600 mr-4" />
            <div>
              <div className="text-2xl font-bold">{landlordData?.totalProperties || 0}</div>
              <div className="text-gray-600">Properties</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center">
            <Users className="h-10 w-10 text-green-600 mr-4" />
            <div>
              <div className="text-2xl font-bold">{landlordData?.totalTenants || 0}</div>
              <div className="text-gray-600">Active Tenants</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center">
            <DollarSign className="h-10 w-10 text-purple-600 mr-4" />
            <div>
              <div className="text-2xl font-bold">{landlordData?.monthlyRevenue || 0}</div>
              <div className="text-gray-600">Monthly Revenue</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center">
            <BarChart3 className="h-10 w-10 text-orange-600 mr-4" />
            <div>
              <div className="text-2xl font-bold">{landlordData?.occupancyRate || '0%'}</div>
              <div className="text-gray-600">Occupancy Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <button 
          onClick={() => setShowAddProperty(true)}
          className="bg-blue-600 text-white p-6 rounded-xl hover:bg-blue-700"
        >
          <PlusCircle className="h-8 w-8 mx-auto mb-3" />
          <div className="text-center font-medium">Add Property</div>
        </button>
        <button className="bg-green-600 text-white p-6 rounded-xl hover:bg-green-700">
          <DollarSign className="h-8 w-8 mx-auto mb-3" />
          <div className="text-center font-medium">Collect Rent</div>
        </button>
        <button className="bg-purple-600 text-white p-6 rounded-xl hover:bg-purple-700">
          <FileText className="h-8 w-8 mx-auto mb-3" />
          <div className="text-center font-medium">Lease Agreements</div>
        </button>
        <button className="bg-orange-600 text-white p-6 rounded-xl hover:bg-orange-700">
          <MessageSquare className="h-8 w-8 mx-auto mb-3" />
          <div className="text-center font-medium">Tenant Messages</div>
        </button>
      </div>

      {/* Properties List */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Properties</h2>
          <select className="border rounded-lg px-4 py-2">
            <option>All Properties</option>
            <option>Occupied</option>
            <option>Vacant</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Property</th>
                <th className="text-left py-3">Location</th>
                <th className="text-left py-3">Tenant</th>
                <th className="text-left py-3">Rent</th>
                <th className="text-left py-3">Status</th>
                <th className="text-left py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {landlordData?.properties?.map((property: any) => (
                <tr key={property.id} className="border-b hover:bg-gray-50">
                  <td className="py-4">
                    <div className="font-medium">{property.name}</div>
                    <div className="text-sm text-gray-600">{property.type}</div>
                  </td>
                  <td className="py-4">{property.location}</td>
                  <td className="py-4">
                    {property.tenant || 'Vacant'}
                  </td>
                  <td className="py-4 font-medium">{property.rent}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      property.status === 'occupied' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <button className="text-blue-600 hover:text-blue-800 mr-3">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}