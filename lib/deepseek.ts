import { Card, ReadingCard } from './types'

// DeepSeek API configuration
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'

// Check if DeepSeek is available
export function isDeepSeekAvailable(): boolean {
  return !!process.env.DEEPSEEK_API_KEY
}

// AI Reading request interface
export interface AIReadingRequest {
  question: string
  context?: string
  cards: Array<{
    id: number
    name: string
    position: number
    reversed: boolean
    facing?: 'left' | 'right'
  }>
  layoutType: number
  userLocale?: string
}

// AI Reading response interface
export interface AIReadingResponse {
  storyline: string
  risk: string
  timing: string
  action: string
  rawResponse: string
}

// Lenormand card keywords (Frozen Classical Kernel)
const LENORMAND_KEYWORDS = {
  1: "Rider = news, messages, communication, arrival",
  2: "Clover = luck, opportunity, small fortune, chance",
  3: "Ship = travel, journey, change, distance",
  4: "House = home, family, stability, property",
  5: "Tree = health, growth, longevity, nature",
  6: "Clouds = confusion, uncertainty, worry, secrets",
  7: "Snake = betrayal, deception, wisdom, healing",
  8: "Coffin = endings, transformation, release, sorrow",
  9: "Bouquet = gifts, beauty, appreciation, celebration",
  10: "Scythe = cutting, decisions, separation, harvest",
  11: "Whip = conflict, arguments, passion, discipline",
  12: "Birds = conversation, gossip, thoughts, siblings",
  13: "Child = new beginnings, innocence, youth, potential",
  14: "Fox = cunning, caution, intelligence, deceit",
  15: "Bear = strength, authority, protection, mother",
  16: "Stars = hopes, dreams, guidance, spirituality",
  17: "Stork = change, movement, birth, improvement",
  18: "Dog = loyalty, friendship, trust, help",
  19: "Tower = isolation, authority, ambition, retreat",
  20: "Garden = community, gatherings, public life, growth",
  21: "Mountain = obstacles, challenges, delays, ambition",
  22: "Paths = choices, crossroads, decisions, direction",
  23: "Mice = loss, theft, worries, details",
  24: "Heart = love, emotions, relationships, passion",
  25: "Ring = commitment, contracts, marriage, cycles",
  26: "Book = knowledge, secrets, education, mystery",
  27: "Letter = documents, news, communication, clarity",
  28: "Man = masculine energy, partner, father, authority",
  29: "Woman = feminine energy, partner, mother, intuition",
  30: "Lilies = peace, harmony, maturity, sexuality",
  31: "Sun = success, vitality, happiness, clarity",
  32: "Moon = emotions, intuition, cycles, dreams",
  33: "Key = solutions, opportunities, answers, access",
  34: "Fish = abundance, wealth, fertility, flow",
  35: "Anchor = stability, security, patience, foundation",
  36: "Cross = burden, sacrifice, faith, destiny"
}

// Combination grammar rules
const COMBINATION_RULES = `
Lenormand Combination Grammar:
- Left card modifies right card
- Above influences outcome below
- Reversed cards = delayed, weakened, or blocked energy
- Mirror pairs (1-36, 2-35, etc.) show hidden subplots
- Figures facing each other = connection/energy flow
- Figures facing away = separation/distance
`

// System prompt template for AI readings (LenormandAI-Spread-Only)
const SYSTEM_PROMPT_TEMPLATE = `You are LenormandAI-Spread-Only.
You NEVER explain individual cards.
You interpret ONLY the COMBINATION in the spread.

Base meanings you must obey:
Rider=news,speed; Clover=small luck; Ship=distance,trade; House=home,stability; Tree=health,growth; Clouds=confusion; Snake=complication,betrayal; Coffin=end,pause; Bouquet=gift,pleasant; Scythe=sharp cut; Whip=repetition; Birds=nervous chatter; Child=new,start; Fox=work,cleverness; Bear=power,money; Stars=hope,plan; Stork=change,pregnancy; Dog=friend,loyalty; Tower=authority,bureaucracy; Garden=social,public; Mountain=obstacle; Crossroads=choice; Mice=erosion,stress; Heart=love; Ring=contract,cycle; Book=secret,knowledge; Letter=document; Man=querent or male; Woman=querent or female; Lily=age,peace; Sun=success; Moon=emotion,recognition; Key=importance; Fish=finance,flow; Anchor=stability,end; Cross=burden,destiny.

Combination rules:
- Left card modifies right; above influences outcome.
- Reversed = delayed, weakened, internalised.
- Mirror pairs (1-36 … 18-19) = hidden subplot.
- Direction: figure facing = energy flow.

Output format (strict markdown):
1. **Story** ≤40 words narrative using ≥3 cards.
2. **Risk** ≤15 words bullet.
3. **Timing** ≤15 words bullet.
4. **Act** single localised verb phrase ≤10 words.

Language = {{user_lang}}
Tone = {{tone}}
Question = {{question}}
Spread = {{spread}}`

// Function to build system prompt with variables
function buildSystemPrompt(vars: {
  user_lang: string
  tone: string
  question: string
  spread: string
}): string {
  return SYSTEM_PROMPT_TEMPLATE
    .replace('{{user_lang}}', vars.user_lang)
    .replace('{{tone}}', vars.tone)
    .replace('{{question}}', vars.question)
    .replace('{{spread}}', vars.spread)
}

// Safety check function
function isSafePrompt(question: string, context?: string): boolean {
  const blockedKeywords = [
    'medical', 'health', 'doctor', 'diagnosis', 'treatment', 'illness', 'disease',
    'legal', 'lawyer', 'court', 'lawsuit', 'contract', 'divorce',
    'suicide', 'death', 'kill', 'murder', 'violence', 'abuse'
  ]

  const text = `${question} ${context || ''}`.toLowerCase()
  return !blockedKeywords.some(keyword => text.includes(keyword))
}

// Main function to get AI reading
export async function getAIReading(request: AIReadingRequest): Promise<AIReadingResponse | null> {
  if (!isDeepSeekAvailable()) {
    console.warn('DeepSeek API not configured')
    return null
  }

  if (!isSafePrompt(request.question, request.context)) {
    throw new Error('Cannot provide readings for medical, legal, or sensitive topics. Please consult appropriate professionals.')
  }

  try {
    // Build the structured payload
    const payload = {
      user_lang: request.userLocale || 'en',
      tone: 'executive', // Default tone, could be made configurable
      question: request.question,
      spread: {
        type: `${request.layoutType}card`,
        cards: request.cards.map(card => ({
          name: card.name,
          pos: card.position,
          rev: card.reversed
        }))
      }
    }

    // Build system prompt with variables
    const spreadJson = JSON.stringify(payload.spread)
    const systemPrompt = buildSystemPrompt({
      user_lang: payload.user_lang,
      tone: payload.tone,
      question: payload.question,
      spread: spreadJson
    })

    const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: JSON.stringify(payload) }
        ],
        temperature: 0.4,
        top_p: 0.85,
        max_tokens: 180 // Keep under 800 total tokens
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

    return parseAIResponse(rawResponse)
  } catch (error) {
    console.error('AI Reading error:', error)
    return null
  }
}

// Build user prompt from reading request
function buildUserPrompt(request: AIReadingRequest): string {
  const cardDescriptions = request.cards.map(card =>
    `${card.name}${card.reversed ? '(rev)' : ''} at position ${card.position}`
  ).join(', ')

  return `Question: "${request.question}"
${request.context ? `Context: ${request.context}` : ''}
Spread: ${cardDescriptions}
Layout: ${request.layoutType}-card ${request.layoutType === 36 ? 'Grand Tableau' : request.layoutType === 3 ? 'Past-Present-Future' : 'reading'}`
}

// Parse AI response into structured format
export function parseAIResponse(response: string): AIReadingResponse {
  const lines = response.trim().split('\n').map(line => line.trim())

  // Extract components from markdown format
  let storyline = ''
  let risk = ''
  let timing = ''
  let action = ''

  for (const line of lines) {
    // Remove numbered prefix first
    const cleanLine = line.replace(/^\d+\.\s*/, '')

    // Match **Story** format
    if (cleanLine.includes('**Story**') || cleanLine.includes('**story**')) {
      storyline = cleanLine.replace(/\*\*Story\*\*\s*/i, '').replace(/\*\*story\*\*\s*/i, '').trim()
    }
    // Match **Risk** format
    else if (cleanLine.includes('**Risk**') || cleanLine.includes('**risk**')) {
      risk = cleanLine.replace(/\*\*Risk\*\*\s*/i, '').replace(/\*\*risk\*\*\s*/i, '').trim()
    }
    // Match **Timing** format
    else if (cleanLine.includes('**Timing**') || cleanLine.includes('**timing**')) {
      timing = cleanLine.replace(/\*\*Timing\*\*\s*/i, '').replace(/\*\*timing\*\*\s*/i, '').trim()
    }
    // Match **Act** format
    else if (cleanLine.includes('**Act**') || cleanLine.includes('**act**')) {
      action = cleanLine.replace(/\*\*Act\*\*\s*/i, '').replace(/\*\*act\*\*\s*/i, '').trim()
    }
  }

  // Fallback parsing if markdown format not followed
  if (!storyline || !risk || !timing || !action) {
    // Try numbered format as fallback
    for (const line of lines) {
      if (line.match(/^\d+\./)) {
        const content = line.replace(/^\d+\.\s*/, '')
        if (!storyline && line.includes('1.')) {
          storyline = content.replace(/\*\*Story\*\*\s*/i, '').replace(/\*\*story\*\*\s*/i, '')
        } else if (!risk && (line.includes('2.') || line.toLowerCase().includes('risk'))) {
          risk = content.replace(/\*\*Risk\*\*\s*/i, '').replace(/\*\*risk\*\*\s*/i, '').replace(/^risk:?\s*/i, '')
        } else if (!timing && (line.includes('3.') || line.toLowerCase().includes('timing'))) {
          timing = content.replace(/\*\*Timing\*\*\s*/i, '').replace(/\*\*timing\*\*\s*/i, '').replace(/^timing:?\s*/i, '')
        } else if (!action && line.includes('4.')) {
          action = content.replace(/\*\*Act\*\*\s*/i, '').replace(/\*\*act\*\*\s*/i, '').replace(/^act:?\s*/i, '')
        }
      }
    }
  }

  return {
    storyline: storyline || 'The cards suggest a complex situation requiring careful consideration.',
    risk: risk || 'Monitor developments carefully',
    timing: timing || 'Timing unclear - observe signs',
    action: action || 'Observe',
    rawResponse: response
  }
}

// Rate limiting (simple client-side)
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 2000 // 2 seconds

export function canMakeAIRequest(): boolean {
  const now = Date.now()
  if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
    return false
  }
  lastRequestTime = now
  return true
}