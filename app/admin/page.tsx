// app/admin/page.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Users, Home, DollarSign, Shield, 
  CheckCircle, XCircle, AlertTriangle,
  Search, Filter
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

export default function AdminPanel() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('pending')
  const [searchTerm, setSearchTerm] = useState('')

  const { data: adminData, refetch } = useQuery({
    queryKey: ['admin-data', activeTab],
    queryFn: async () => {
      const res = await fetch(`/api/admin?type=${activeTab}`)
      return res.json()
    }
  })

  const handleApproveUser = async (userId: string) => {
    await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update-user-status',
        userId,
        status: 'ACTIVE'
      })
    })
    refetch()
  }

  const handleRejectUser = async (userId: string) => {
    await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update-user-status',
        userId,
        status: 'REJECTED'
      })
    })
    refetch()
  }

  const handleSuspendUser = async (userId: string) => {
    await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'suspend-user',
        userId,
        reason: 'Violation of terms'
      })
    })
    refetch()
  }

  if (!session || session.user.role !== 'ADMIN') {
    return (
      <div className="text-center py-12">
        <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-gray-600">You do not have permission to access this page.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Manage platform users and content</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center">
            <Users className="h-10 w-10 text-blue-600 mr-4" />
            <div>
              <div className="text-2xl font-bold">{adminData?.stats?.totalUsers || 0}</div>
              <div className="text-gray-600">Total Users</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center">
            <Home className="h-10 w-10 text-green-600 mr-4" />
            <div>
              <div className="text-2xl font-bold">{adminData?.stats?.totalProperties || 0}</div>
              <div className="text-gray-600">Properties</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center">
            <DollarSign className="h-10 w-10 text-purple-600 mr-4" />
            <div>
              <div className="text-2xl font-bold">{adminData?.stats?.totalPayments || 0}</div>
              <div className="text-gray-600">Payments</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center">
            <AlertTriangle className="h-10 w-10 text-orange-600 mr-4" />
            <div>
              <div className="text-2xl font-bold">{adminData?.pendingCount || 0}</div>
              <div className="text-gray-600">Pending Approvals</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md mb-8">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'pending' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Pending Approvals
              <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                {adminData?.pendingCount || 0}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'users' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              All Users
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'payments' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Payments
            </button>
            <button
              onClick={() => setActiveTab('properties')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'properties' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Properties
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Search Bar */}
          <div className="flex items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="ml-4 border border-gray-300 rounded-lg px-4 py-2 flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filter
            </button>
          </div>

          {/* Content */}
          {activeTab === 'pending' && (
            <div className="space-y-4">
              {adminData?.pendingUsers?.map((user: any) => (
                <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-gray-600 text-sm">{user.email} • {user.phone}</p>
                      <div className="flex items-center mt-2">
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-2">
                          {user.role}
                        </span>
                        <span className="text-sm text-gray-500">
                          Applied: {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApproveUser(user.id)}
                        className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 flex items-center"
                      >
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectUser(user.id)}
                        className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 flex items-center"
                      >
                        <XCircle className="h-5 w-5 mr-2" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">User</th>
                    <th className="text-left py-3">Role</th>
                    <th className="text-left py-3">Status</th>
                    <th className="text-left py-3">Joined</th>
                    <th className="text-left py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminData?.allUsers?.map((user: any) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-4">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </td>
                      <td className="py-4">
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          user.status === 'ACTIVE' 
                            ? 'bg-green-100 text-green-800'
                            : user.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        {user.status !== 'SUSPENDED' ? (
                          <button
                            onClick={() => handleSuspendUser(user.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button className="text-green-600 hover:text-green-800">
                            Activate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Transaction</th>
                    <th className="text-left py-3">User</th>
                    <th className="text-left py-3">Amount</th>
                    <th className="text-left py-3">Type</th>
                    <th className="text-left py-3">Status</th>
                    <th className="text-left py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {adminData?.recentPayments?.map((payment: any) => (
                    <tr key={payment.id} className="border-b hover:bg-gray-50">
                      <td className="py-4">
                        <div className="font-medium">#{payment.id.slice(0, 8)}</div>
                        <div className="text-sm text-gray-600">{payment.mpesaCode || payment.stripeId}</div>
                      </td>
                      <td className="py-4">
                        <div className="font-medium">{payment.user.name}</div>
                        <div className="text-sm text-gray-600">{payment.user.email}</div>
                      </td>
                      <td className="py-4 font-medium">
                        {payment.amount} {payment.currency}
                      </td>
                      <td className="py-4">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {payment.type}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          payment.status === 'COMPLETED' 
                            ? 'bg-green-100 text-green-800'
                            : payment.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-gray-600">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}