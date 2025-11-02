import { NextRequest, NextResponse } from 'next/server'
import { getAIReading, AIReadingRequest, isDeepSeekAvailable } from '@/lib/deepseek'
import { getCardById, getCards } from '@/lib/data'

export interface RelationshipAnalysisRequest {
  cards: Array<{
    id: number
    name: string
    position: number
    reversed: boolean
  }>
  layoutType: number
  question?: string
}

export interface CardRelationship {
  fromCardId: number
  toCardId: number
  strength: 'weak' | 'moderate' | 'strong' | 'conflicting'
  explanation: string
  type: 'supportive' | 'challenging' | 'neutral' | 'amplifying'
}

export interface RelationshipAnalysisResponse {
  relationships: CardRelationship[]
  summary: string
}

// AI prompt for relationship analysis
const RELATIONSHIP_ANALYSIS_PROMPT = `You are LenormandAI-Relationships.
Analyze the relationships between cards in this Lenormand spread.
Focus ONLY on card-to-card relationships and connections.

Base meanings:
Rider=news,speed; Clover=small luck; Ship=distance,trade; House=home,stability; Tree=health,growth; Clouds=confusion; Snake=complication,betrayal; Coffin=end,pause; Bouquet=gift,pleasant; Scythe=sharp cut; Whip=repetition; Birds=nervous chatter; Child=new,start; Fox=work,cleverness; Bear=power,money; Stars=hope,plan; Stork=change,pregnancy; Dog=friend,loyalty; Tower=authority,bureaucracy; Garden=social,public; Mountain=obstacle; Crossroads=choice; Mice=erosion,stress; Heart=love; Ring=contract,cycle; Book=secret,knowledge; Letter=document; Man=querent or male; Woman=querent or female; Lily=age,peace; Sun=success; Moon=emotion,recognition; Key=importance; Fish=finance,flow; Anchor=stability,end; Cross=burden,destiny.

Relationship rules:
- Adjacent cards influence each other directly
- Mirror pairs (1-36, 2-35, etc.) show hidden connections
- Figure cards facing each other = connection/energy flow
- Figures facing away = separation/distance
- Left card modifies right card's meaning
- Above influences outcome below

Output format (strict JSON):
{
  "relationships": [
    {
      "fromCardId": number,
      "toCardId": number,
      "strength": "weak|moderate|strong|conflicting",
      "explanation": "brief explanation (max 50 chars)",
      "type": "supportive|challenging|neutral|amplifying"
    }
  ],
  "summary": "overall relationship pattern (max 100 chars)"
}

Language = {{user_lang}}
Question = {{question}}
Spread = {{spread}}`

function buildRelationshipPrompt(vars: {
  user_lang: string
  question: string
  spread: string
}): string {
  return RELATIONSHIP_ANALYSIS_PROMPT
    .replace('{{user_lang}}', vars.user_lang)
    .replace('{{question}}', vars.question)
    .replace('{{spread}}', vars.spread)
}

export async function POST(request: NextRequest) {
  try {
    const body: RelationshipAnalysisRequest = await request.json()

    if (!body.cards || !Array.isArray(body.cards)) {
      return NextResponse.json(
        { error: 'Missing required fields: cards array' },
        { status: 400 }
      )
    }

    if (!isDeepSeekAvailable()) {
      return NextResponse.json(
        { error: 'AI analysis unavailable. Please add your DEEPSEEK_API_KEY to enable AI-powered features.' },
        { status: 503 }
      )
    }

    // Build the analysis payload
    const payload = {
      user_lang: 'en',
      question: body.question || 'Analyze card relationships',
      spread: {
        type: `${body.layoutType}card`,
        cards: body.cards.map(card => ({
          name: card.name,
          pos: card.position,
          rev: card.reversed
        }))
      }
    }

    const spreadJson = JSON.stringify(payload.spread)
    const systemPrompt = buildRelationshipPrompt({
      user_lang: payload.user_lang,
      question: payload.question,
      spread: spreadJson
    })

    const response = await fetch(`${process.env.DEEPSEEK_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: JSON.stringify(payload) }
        ],
        temperature: 0.3,
        top_p: 0.8,
        max_tokens: 800
      })
    })

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`)
    }

    const data = await response.json()
    const rawResponse = data.choices[0]?.message?.content

    if (!rawResponse) {
      throw new Error('No response from DeepSeek API')
    }

    const analysis = parseRelationshipResponse(rawResponse)
    return NextResponse.json(analysis)

  } catch (error) {
    console.error('Relationship analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze card relationships' },
      { status: 500 }
    )
  }
}

function parseRelationshipResponse(response: string): RelationshipAnalysisResponse {
  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(response.trim())
    return {
      relationships: parsed.relationships || [],
      summary: parsed.summary || 'Card relationships analyzed'
    }
  } catch (e) {
    // Fallback: try to extract JSON from text
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          relationships: parsed.relationships || [],
          summary: parsed.summary || 'Card relationships analyzed'
        }
      } catch (e2) {
        // Final fallback
        return {
          relationships: [],
          summary: 'Unable to analyze relationships'
        }
      }
    }

    return {
      relationships: [],
      summary: 'Unable to analyze relationships'
    }
  }
}