import { NextRequest, NextResponse } from 'next/server'
import { getAIReading, AIReadingRequest, canMakeAIRequest } from '@/lib/deepseek'
import { getCardById, getCards } from '@/lib/data'

export async function POST(request: NextRequest) {
  try {
    console.log('=== AI Interpretation Request Started ===')
    console.log('Environment check:', {
      hasApiKey: !!process.env.DEEPSEEK_API_KEY,
      apiKeyLength: process.env.DEEPSEEK_API_KEY?.length || 0,
      baseUrl: process.env.DEEPSEEK_BASE_URL || 'DEFAULT'
    })

    // Rate limiting check
    if (!canMakeAIRequest()) {
      console.log('Rate limited')
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment.' },
        { status: 429 }
      )
    }

    const body: AIReadingRequest = await request.json()
    console.log('Request body:', { question: body.question, cardCount: body.cards?.length, layoutType: body.layoutType })

    // Validate required fields
    if (!body.question || !body.cards || !Array.isArray(body.cards)) {
      console.log('Validation failed: missing fields')
      return NextResponse.json(
        { error: 'Missing required fields: question and cards' },
        { status: 400 }
      )
    }

    // Load all cards data
    const allCards = await getCards()
    console.log('Cards loaded:', allCards.length)

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
    console.log('Cards enriched:', enrichedCards.length)

    const aiRequest: AIReadingRequest = {
      ...body,
      cards: enrichedCards
    }

    console.log('Calling getAIReading...')
    const aiReading = await getAIReading(aiRequest)
    console.log('AI reading result:', aiReading ? 'SUCCESS' : 'NULL')

    if (!aiReading) {
      console.log('AI reading returned null')
      return NextResponse.json(
        { error: 'AI interpretation unavailable. Please add your DEEPSEEK_API_KEY to .env file to enable AI-powered readings.' },
        { status: 503 }
      )
    }

    console.log('=== AI Interpretation Request Success ===')
    return NextResponse.json(aiReading)
  } catch (error) {
    console.error('=== AI Interpretation Error ===')
    console.error('Error details:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack')
    console.error('Environment at error:', {
      hasApiKey: !!process.env.DEEPSEEK_API_KEY,
      baseUrl: process.env.DEEPSEEK_BASE_URL
    })

    // Handle safety violations
    if (error instanceof Error && error.message.includes('Cannot provide readings')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    console.error('=== Returning 500 error ===')
    return NextResponse.json(
      { error: 'Failed to generate AI interpretation', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}