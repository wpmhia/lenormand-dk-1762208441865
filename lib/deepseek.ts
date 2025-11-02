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

// System prompt for AI readings
const SYSTEM_PROMPT = `You are an expert Lenormand card reader with 20+ years experience. You MUST follow these rules:

CORE KEYWORDS (cannot be changed):
${Object.values(LENORMAND_KEYWORDS).join('\n')}

${COMBINATION_RULES}

RESPONSE FORMAT (strict - do not deviate):
1. 35-word storyline (must use ≥ 3 cards)
2. Risk bullet (≤ 15 words)
3. Timing bullet (≤ 15 words)
4. Action verb (1 word)

Keep interpretations specific to the question and context provided. Be direct, practical, and actionable. Temperature 0.4, top-p 0.85.`

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
    const userPrompt = buildUserPrompt(request)

    const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.4,
        top_p: 0.85,
        max_tokens: 300
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

  // Extract components (flexible parsing)
  let storyline = ''
  let risk = ''
  let timing = ''
  let action = ''

  for (const line of lines) {
    if (line.match(/^\d+\./)) {
      const content = line.replace(/^\d+\.\s*/, '')
      if (!storyline) {
        storyline = content
      } else if (!risk && (line.toLowerCase().includes('risk') || lines.indexOf(line) === 1)) {
        risk = content.replace(/^risk:?\s*/i, '')
      } else if (!timing && (line.toLowerCase().includes('timing') || lines.indexOf(line) === 2)) {
        timing = content.replace(/^timing:?\s*/i, '')
      } else if (!action) {
        action = content.replace(/^action:?\s*/i, '')
      }
    }
  }

  // Fallback parsing if structured format not followed
  if (!storyline) {
    const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 10)
    storyline = sentences[0]?.trim() || response.substring(0, 100)
  }

  return {
    storyline: storyline.substring(0, 150), // Limit length
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