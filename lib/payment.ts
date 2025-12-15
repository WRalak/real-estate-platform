// lib/payment.ts
import Stripe from 'stripe'
import axios from 'axios'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

interface PaymentData {
  amount: number
  currency: string
  userId: string
  type: 'subscription' | 'property_posting' | 'featured_listing'
  metadata?: Record<string, any>
}

export async function createStripePayment(paymentData: PaymentData) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: paymentData.amount * 100, // Convert to cents
      currency: paymentData.currency.toLowerCase(),
      metadata: {
        userId: paymentData.userId,
        type: paymentData.type,
        ...paymentData.metadata
      }
    })

    return {
      clientSecret: paymentIntent.client_secret,
      paymentId: paymentIntent.id
    }
  } catch (error) {
    console.error('Stripe payment error:', error)
    throw error
  }
}

export async function createMpesaPayment(paymentData: PaymentData) {
  try {
    // Get M-Pesa auth token
    const authResponse = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        auth: {
          username: process.env.MPESA_CONSUMER_KEY!,
          password: process.env.MPESA_CONSUMER_SECRET!
        }
      }
    )

    const token = authResponse.data.access_token

    // Initiate M-Pesa STK Push
    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: Buffer.from(
          `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)}`
        ).toString('base64'),
        Timestamp: new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14),
        TransactionType: 'CustomerPayBillOnline',
        Amount: paymentData.amount,
        PartyA: '2547XXXXXXXX', // User's phone number from metadata
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: '2547XXXXXXXX',
        CallBackURL: `${process.env.NEXTAUTH_URL}/api/payments/mpesa-callback`,
        AccountReference: `REALESTATE-${paymentData.type}`,
        TransactionDesc: 'Real Estate Platform Payment'
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    return {
      checkoutRequestID: response.data.CheckoutRequestID,
      responseCode: response.data.ResponseCode
    }
  } catch (error) {
    console.error('M-Pesa payment error:', error)
    throw error
  }
}

export async function verifyPayment(paymentId: string, provider: 'stripe' | 'mpesa') {
  if (provider === 'stripe') {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId)
    return paymentIntent.status === 'succeeded'
  }

  // M-Pesa verification logic
  // ...
}