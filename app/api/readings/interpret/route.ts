import { NextRequest, NextResponse } from 'next/server'
import { getAIReading, AIReadingRequest, canMakeAIRequest } from '@/lib/deepseek'
import { getCardById, getCards } from '@/lib/data'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    if (!canMakeAIRequest()) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment.' },
        { status: 429 }
      )
    }

    const body: AIReadingRequest = await request.json()

    // Validate required fields
    if (!body.question || !body.cards || !Array.isArray(body.cards)) {
      return NextResponse.json(
        { error: 'Missing required fields: question and cards' },
        { status: 400 }
      )
    }

    // Load all cards data
    const allCards = await getCards()

    // Validate cards exist and get full card data
    const enrichedCards = body.cards.map((card) => {
      const fullCard = getCardById(allCards, card.id)
      if (!fullCard) {
        throw new Error(`Card with id ${card.id} not found`)
      }
      return {
        id: card.id,
        name: fullCard.name,
        position: card.position,
        reversed: card.reversed,
        facing: card.facing
      }
    })

    const aiRequest: AIReadingRequest = {
      ...body,
      cards: enrichedCards
    }

    const aiReading = await getAIReading(aiRequest)

    if (!aiReading) {
      return NextResponse.json(
        { error: 'AI interpretation unavailable. Please add your DEEPSEEK_API_KEY to the .env file to enable AI-powered readings.' },
        { status: 503 }
      )
    }

    return NextResponse.json(aiReading)
  } catch (error) {
    console.error('AI interpretation error:', error)

    // Handle safety violations
    if (error instanceof Error && error.message.includes('Cannot provide readings')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate AI interpretation' },
      { status: 500 }
    )
  }
}

