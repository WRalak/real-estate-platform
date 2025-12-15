// components/PaymentModal.tsx
'use client'

import { useState } from 'react'
import { X, CreditCard, Smartphone, DollarSign } from 'lucide-react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  amount?: number
  propertyId?: string
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  amount = 5000,
  propertyId 
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card'>('mpesa')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async () => {
    setIsProcessing(true)
    try {
      if (paymentMethod === 'mpesa') {
        // M-Pesa payment logic
        const response = await fetch('/api/payments/mpesa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount,
            phoneNumber,
            propertyId
          })
        })
        
        const data = await response.json()
        if (data.success) {
          alert('Payment initiated! Check your phone for STK Push')
          onClose()
        }
      } else {
        // Card payment logic
        const response = await fetch('/api/payments/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount })
        })
        
        const data = await response.json()
        // Handle Stripe redirect or confirmation
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">Make Payment</h2>
            <p className="text-gray-600">Complete your transaction</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Payment Details */}
        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-3xl font-bold text-blue-600">KES {amount.toLocaleString()}</p>
              </div>
              <DollarSign className="h-10 w-10 text-green-600" />
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <h3 className="font-semibold mb-4">Select Payment Method</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMethod('mpesa')}
                className={`p-4 border rounded-lg flex items-center justify-center ${
                  paymentMethod === 'mpesa'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Smartphone className="h-6 w-6 mr-3 text-green-600" />
                <span className="font-medium">M-Pesa</span>
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-4 border rounded-lg flex items-center justify-center ${
                  paymentMethod === 'card'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <CreditCard className="h-6 w-6 mr-3 text-blue-600" />
                <span className="font-medium">Card</span>
              </button>
            </div>
          </div>

          {/* M-Pesa Form */}
          {paymentMethod === 'mpesa' && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                M-Pesa Phone Number
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  +254
                </span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="7XX XXX XXX"
                  className="pl-16 w-full border rounded-lg px-4 py-3"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                You will receive an STK Push notification on your phone
              </p>
            </div>
          )}

          {/* Card Form */}
          {paymentMethod === 'card' && (
            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full border rounded-lg px-4 py-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    CVC
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full border rounded-lg px-4 py-3"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Terms */}
          <div className="mb-6">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 mr-2"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the payment terms and authorize this transaction
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={isProcessing || (paymentMethod === 'mpesa' && !phoneNumber)}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </span>
              ) : (
                `Pay KES ${amount.toLocaleString()}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}