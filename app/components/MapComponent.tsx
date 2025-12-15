// components/MapComponent.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

interface MapComponentProps {
  latitude: number
  longitude: number
  markers?: Array<{
    lat: number
    lng: number
    title: string
    color?: string
  }>
  zoom?: number
  height?: string
  interactive?: boolean
}

export default function MapComponent({
  latitude,
  longitude,
  markers = [],
  zoom = 15,
  height = '400px',
  interactive = true
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly'
    })

    loader.load().then(() => {
      if (!mapRef.current) return

      const mapInstance = new google.maps.Map(mapRef.current, {
        center: { lat: latitude, lng: longitude },
        zoom,
        disableDefaultUI: !interactive,
        zoomControl: interactive,
        streetViewControl: interactive,
        mapTypeControl: interactive,
        fullscreenControl: interactive,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      })

      setMap(mapInstance)

      // Add main marker
      new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: mapInstance,
        title: 'Property Location',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#3B82F6',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2
        }
      })

      // Add additional markers
      markers.forEach(marker => {
        new google.maps.Marker({
          position: { lat: marker.lat, lng: marker.lng },
          map: mapInstance,
          title: marker.title,
          icon: marker.color ? {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: marker.color,
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2
          } : undefined
        })
      })

      // Add circle for radius
      new google.maps.Circle({
        strokeColor: '#3B82F6',
        strokeOpacity: 0.3,
        strokeWeight: 2,
        fillColor: '#3B82F6',
        fillOpacity: 0.1,
        map: mapInstance,
        center: { lat: latitude, lng: longitude },
        radius: 500 // 500 meters
      })
    }).catch(err => {
      console.error('Google Maps loading error:', err)
      setError('Failed to load map')
    })
  }, [latitude, longitude, zoom, interactive, markers])

  return (
    <div className="relative">
      {error ? (
        <div className="w-full bg-gray-200 flex items-center justify-center" style={{ height }}>
          <p className="text-gray-500">{error}</p>
        </div>
      ) : (
        <>
          <div ref={mapRef} style={{ height, width: '100%' }} />
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-3">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
              <span className="text-sm">Property Location</span>
            </div>
            <div className="flex items-center mt-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
              <span className="text-sm">Nearby Properties</span>
            </div>
            <div className="flex items-center mt-2">
              <div className="w-6 h-6 border-2 border-blue-600 rounded-full mr-2"></div>
              <span className="text-sm">500m Radius</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}