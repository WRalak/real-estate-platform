// app/(dashboard)/user/page.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { 
  User, Heart, MessageSquare, Bell, 
  Settings, Calendar, Home, Star
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

export default function UserDashboard() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('properties')

  const { data: userData } = useQuery({
    queryKey: ['user-dashboard'],
    queryFn: async () => {
      const res = await fetch('/api/user/dashboard')
      return res.json()
    }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* User Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-6 md:mb-0">
            <div className="relative w-24 h-24 rounded-full bg-white/20 p-1">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <User className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <div className="ml-6">
              <h1 className="text-3xl font-bold">{session?.user?.name}</h1>
              <p className="text-blue-100">{session?.user?.email}</p>
              <div className="flex items-center mt-2">
                <Star className="h-5 w-5 text-yellow-300 fill-yellow-300" />
                <span className="ml-1">Member since 2024</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-4">
            <button className="bg-white/20 hover:bg-white/30 p-3 rounded-xl">
              <Settings className="h-6 w-6" />
            </button>
            <button className="bg-white/20 hover:bg-white/30 p-3 rounded-xl">
              <Bell className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('properties')}
                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'properties' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
              >
                <Home className="h-5 w-5 mr-3" />
                <span>My Properties</span>
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'favorites' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
              >
                <Heart className="h-5 w-5 mr-3" />
                <span>Favorites</span>
                <span className="ml-auto bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  {userData?.favoritesCount || 0}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'messages' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
              >
                <MessageSquare className="h-5 w-5 mr-3" />
                <span>Messages</span>
                <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                  {userData?.unreadMessages || 0}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('viewings')}
                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'viewings' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
              >
                <Calendar className="h-5 w-5 mr-3" />
                <span>Scheduled Viewings</span>
              </button>
            </nav>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-md p-6 mt-6">
            <h3 className="font-semibold mb-4">Your Activity</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Properties Viewed</span>
                <span className="font-semibold">{userData?.propertiesViewed || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Agents Contacted</span>
                <span className="font-semibold">{userData?.agentsContacted || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Favorites</span>
                <span className="font-semibold">{userData?.favoritesCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Searches</span>
                <span className="font-semibold">{userData?.activeSearches || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'properties' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Properties You Viewed</h2>
              {userData?.recentProperties?.length > 0 ? (
                <div className="space-y-4">
                  {userData.recentProperties.map((property: any) => (
                    <div key={property.id} className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg mr-4"></div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{property.title}</h3>
                        <p className="text-gray-600 text-sm">{property.location}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-blue-600 font-bold">{property.price}</span>
                          <span className="ml-4 text-sm text-gray-500">Viewed {property.viewedAt}</span>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800">
                        View Again
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No properties viewed yet</h3>
                  <p className="text-gray-600 mb-6">Start browsing properties to see them here</p>
                  <a href="/properties" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                    Browse Properties
                  </a>
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Your Favorites</h2>
              {/* Favorite properties list */}
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Messages</h2>
              {/* Messages list */}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}