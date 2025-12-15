// lib/ai-service.ts
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

interface PropertyAIInsights {
  description: string
  priceAnalysis: string
  tags: string[]
  recommendations: string[]
}

export async function generatePropertyAIInsights(property: {
  title: string
  description: string
  price: number
  location: string
  city: string
}): Promise<PropertyAIInsights> {
  try {
    const prompt = `
      As a real estate expert in East Africa, analyze this property:
      Title: ${property.title}
      Description: ${property.description}
      Price: ${property.price} KES
      Location: ${property.location}, ${property.city}
      
      Provide:
      1. An enhanced, compelling description (max 200 words)
      2. Price analysis: Is it fair market value? Compare to similar properties in ${property.city}
      3. 5 relevant tags (e.g., "Prime Location", "Family Friendly", "Modern Amenities")
      4. 3 recommendations to improve listing or pricing
      
      Format response as JSON:
      {
        "description": string,
        "priceAnalysis": string,
        "tags": string[],
        "recommendations": string[]
      }
    `

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a real estate expert specializing in East African property markets."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    })

    return JSON.parse(response.choices[0].message.content || '{}')
  } catch (error) {
    console.error('AI insights generation error:', error)
    return {
      description: property.description,
      priceAnalysis: 'AI analysis unavailable',
      tags: [],
      recommendations: []
    }
  }
}

export async function generatePropertyRecommendations(userId: string, preferences: any) {
  // AI-powered property recommendations based on user behavior
  // Implementation using OpenAI and user data
}

export async function analyzeMarketTrends(city: string) {
  // Analyze real estate market trends for specific East African city
}

export async function detectFraudulentListings(propertyData: any) {
  // AI fraud detection for property listings
}