import { NextRequest, NextResponse } from 'next/server'
import { getAIReading } from '@/lib/deepseek'
import { getCardById, getCards } from '@/lib/data'

// Force Node.js runtime
export const runtime = 'nodejs'

// Simple API route
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate basic fields
    if (!body.question || !body.cards || !Array.isArray(body.cards)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Load cards
    const allCards = await getCards()

    // Enrich cards
    const enrichedCards = body.cards.map((card: any) => {
      const fullCard = getCardById(allCards, card.id)
      return {
        id: card.id,
        name: fullCard?.name || 'Unknown',
        position: card.position
      }
    })

    const aiRequest = {
      question: body.question,
      cards: enrichedCards
    }

    const aiReading = await getAIReading(aiRequest)

    if (!aiReading) {
      return NextResponse.json({ error: 'AI service unavailable' }, { status: 503 })
    }

    return NextResponse.json(aiReading)
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}