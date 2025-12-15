// components/Navbar.tsx
'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Menu, X, User, Home, Shield } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-blue-800">Jenga Estate</span>
            </Link>
            
            <div className="hidden md:flex ml-10 space-x-8">
              <Link href="/properties" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                Properties
              </Link>
              <Link href="/agents" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                Agents
              </Link>
              {session?.user?.role === 'AGENT' && (
                <Link href="/dashboard/agent" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                  Dashboard
                </Link>
              )}
              {session?.user?.role === 'ADMIN' && (
                <Link href="/dashboard/admin" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                  <Shield className="inline mr-1 h-4 w-4" />
                  Admin
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {session?.user ? (
              <>
                <Link href="/dashboard/user" className="flex items-center text-gray-700 hover:text-blue-600">
                  <User className="h-5 w-5 mr-1" />
                  {session.user.name}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                  Sign In
                </Link>
                <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Get Started
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/properties" className="block px-3 py-2 text-gray-700">
                Properties
              </Link>
              <Link href="/agents" className="block px-3 py-2 text-gray-700">
                Agents
              </Link>
              {session?.user?.role === 'AGENT' && (
                <Link href="/dashboard/agent" className="block px-3 py-2 text-gray-700">
                  Dashboard
                </Link>
              )}
              {session?.user && (
                <Link href="/dashboard/user" className="block px-3 py-2 text-gray-700">
                  Profile
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}