import { NextRequest, NextResponse } from 'next/server'
import { getAIReading, AIReadingRequest, canMakeAIRequest } from '@/lib/deepseek'
import { getCardById, getCards } from '@/lib/data'

// Force Node.js runtime for better AI API compatibility
export const runtime = 'nodejs'

// Configure function timeout for Vercel (45 seconds for DeepSeek API)
export const maxDuration = 45

export async function POST(request: NextRequest) {
  try {
    console.log('=== AI Interpretation Request Started ===')
    console.log('Environment check:', {
      nodeEnv: process.env.NODE_ENV,
      hasApiKey: !!process.env.DEEPSEEK_API_KEY,
      apiKeyLength: process.env.DEEPSEEK_API_KEY?.length || 0,
      baseUrl: process.env.DEEPSEEK_BASE_URL || 'DEFAULT'
    })

    // Rate limiting check
    if (!canMakeAIRequest()) {
      console.log('Rate limited - blocking request')
      return NextResponse.json(
        { 
          error: 'Please wait 2 seconds between readings. This ensures quality interpretations for everyone.',
          type: 'rate_limit',
          waitTime: 2000
        },
        { status: 429 }
      )
    }

    const body: AIReadingRequest = await request.json()
    if (process.env.NODE_ENV === 'development') {
      console.log('Request body:', { question: body.question, cardCount: body.cards?.length, layoutType: body.layoutType })
    }

    // Validate required fields
    if (!body.question || !body.cards || !Array.isArray(body.cards)) {
      if (process.env.NODE_ENV === 'development') console.log('Validation failed: missing fields')
      const missingFields: string[] = []
      if (!body.question) missingFields.push('question')
      if (!body.cards) missingFields.push('cards')
      if (!Array.isArray(body.cards)) missingFields.push('cards must be an array')

      return NextResponse.json(
        {
          error: `Missing required fields: ${missingFields.join(', ')}`,
          type: 'validation_error',
          fields: missingFields
        },
        { status: 400 }
      )
    }

    // Load all cards data
    const allCards = await getCards()
    if (process.env.NODE_ENV === 'development') console.log('Cards loaded:', allCards.length)

    // Validate cards exist and get full card data
    const enrichedCards = body.cards.map((card) => {
      const fullCard = getCardById(allCards, card.id)
      if (!fullCard) {
        throw new Error(`Card with id ${card.id} not found`)
      }
      return {
        id: card.id,
        name: fullCard.name,
        position: card.position
      }
    })
    if (process.env.NODE_ENV === 'development') console.log('Cards enriched:', enrichedCards.length)

    const aiRequest: AIReadingRequest = {
      ...body,
      cards: enrichedCards
    }

    console.log('Calling getAIReading...')
    const aiReading = await getAIReading(aiRequest)
    console.log('AI reading result:', aiReading ? 'SUCCESS' : 'NULL')

    if (!aiReading) {
      if (process.env.NODE_ENV === 'development') console.log('AI reading returned null')
      const isConfigured = !!process.env.DEEPSEEK_API_KEY
      const errorMessage = isConfigured 
        ? 'AI service is temporarily unavailable. Please try again in a few minutes.'
        : 'AI readings require an API key. Add DEEPSEEK_API_KEY to your .env file to enable AI-powered readings.'
      
      return NextResponse.json(
        { 
          error: errorMessage,
          type: isConfigured ? 'service_unavailable' : 'configuration_needed',
          helpUrl: isConfigured ? undefined : 'https://platform.deepseek.com/',
          action: isConfigured ? 'Try again later' : 'Configure API key'
        },
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
      nodeEnv: process.env.NODE_ENV,
      hasApiKey: !!process.env.DEEPSEEK_API_KEY,
      baseUrl: process.env.DEEPSEEK_BASE_URL
    })

    // Handle safety violations
    if (error instanceof Error && error.message.includes('Cannot provide readings')) {
      return NextResponse.json(
        {
          error: error.message,
          type: 'safety_violation',
          suggestion: 'Please consult appropriate professionals for medical, legal, or financial advice.'
        },
        { status: 400 }
      )
    }

    if (process.env.NODE_ENV === 'development') console.error('=== Returning 500 error ===')
    return NextResponse.json(
      { 
        error: 'AI interpretation service encountered an error. Please try again.',
        type: 'service_error',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined,
        action: 'Try the reading again or contact support if the problem persists'
      },
      { status: 500 }
    )
  }
}