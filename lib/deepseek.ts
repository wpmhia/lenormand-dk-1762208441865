import { Card, ReadingCard } from './types'

// DeepSeek API configuration
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'

// Check if DeepSeek is available
export function isDeepSeekAvailable(): boolean {
  return !!process.env.DEEPSEEK_API_KEY
}

// Simple AI Reading request interface
export interface AIReadingRequest {
  question: string
  cards: Array<{
    id: number
    name: string
    position: number
  }>
}

// Simple AI Reading response interface
export interface AIReadingResponse {
  reading: string
}

// Main function to get AI reading - ultra simple static response for testing
export async function getAIReading(request: AIReadingRequest): Promise<AIReadingResponse | null> {
  // Return a static response to test if the page works
  return {
    reading: "The cards suggest a period of reflection and new opportunities. Trust your intuition as you navigate this path."
  }

  // Uncomment below when ready to test real AI
  /*
  if (!isDeepSeekAvailable()) {
    return null
  }

  try {
    const cardsText = request.cards.map(card => card.name).join(', ')
    const prompt = `Question: ${request.question}\nCards: ${cardsText}\n\nProvide a brief Lenormand reading.`

    const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return null
    }

    return {
      reading: content.trim()
    }
  } catch (error) {
    return null
  }
  */
}