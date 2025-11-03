import { Card, ReadingCard } from './types'

// DeepSeek API configuration
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1'

// Check if DeepSeek is available
export function isDeepSeekAvailable(): boolean {
  return !!process.env.DEEPSEEK_API_KEY
}

// AI Reading request interface
export interface AIReadingRequest {
  question: string
  cards: Array<{
    id: number
    name: string
    position: number
    reversed: boolean
    facing?: 'left' | 'right'
  }>
  layoutType: number
  threeCardSpreadType?: string
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

// Ghost word-bank for feminine undertones
const SOFT_SYNONYMS = {
  'hit': 'brush',
  'cut': 'bloom',
  'snap': 'unfold',
  'obstacle': 'resistance',
  'deadline': 'ripening',
  'execute': 'embrace',
  'call': 'reach-out',
  'sharp': 'gentle',
  'hard': 'soft',
  'quick': 'lingering',
  'fast': 'gradual',
  'sudden': 'emerging',
  'force': 'flow',
  'push': 'guide',
  'block': 'pause',
  'stop': 'rest',
  'break': 'shift',
  'change': 'transform',
  'end': 'complete',
  'begin': 'emerge'
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

// System prompt template for AI readings (Everyday Tarot Reader)
const SYSTEM_PROMPT_TEMPLATE = `You are a helpful tarot reader who gives practical advice in everyday language.

You NEVER list meanings.
You NEVER use bullets.
You read the card combinations to give real-life guidance.

Fixed meanings you must keep:
Rider=news,speed; Clover=small luck; Ship=distance,trade; House=home,stability; Tree=health,growth; Clouds=confusion; Snake=complication,betrayal; Coffin=end,pause; Bouquet=gift,pleasant; Scythe=sharp cut; Whip=repetition; Birds=nervous chatter; Child=new,start; Fox=work,cleverness; Bear=power,money; Stars=hope,plan; Stork=change,pregnancy; Dog=friend,loyalty; Tower=authority,bureaucracy; Garden=social,public; Mountain=obstacle; Crossroads=choice; Mice=erosion,stress; Heart=love; Ring=contract,cycle; Book=secret,knowledge; Letter=document; Man=querent or male; Woman=querent or female; Lily=age,peace; Sun=success; Moon=emotion,recognition; Key=importance; Fish=finance,flow; Anchor=stability,end; Cross=burden,destiny.

Combination rules:
- Left card modifies right card
- Above card influences below card
- Reversed cards mean delayed, weakened, or blocked energy
- Cards facing each other show connection
- Cards facing away show distance

3-Card Spread Interpretations:
- past-present-future: Position 0=Past, 1=Present, 2=Future. Read as timeline progression.
- situation-challenge-advice: Position 0=Situation, 1=Challenge, 2=Advice. Focus on problem-solving.
- mind-body-spirit: Position 0=Mind, 1=Body, 2=Spirit. Address holistic well-being.
- yes-no-maybe: Position 0=Yes factors, 1=No factors, 2=Maybe factors. Weigh possibilities.
- general-reading: Read cards 0, 1, 2 as a flowing sentence or story. Connect them narratively into a cohesive paragraph that tells a complete story about the situation, like a human reader would. Focus on relationships, emotions, and practical implications rather than just listing card meanings.

Example for general-reading: "The strong foundation you've built together creates a solid base for something more, but the choice ahead requires careful consideration. With such close friendship at stake, he faces a difficult decision that demands patience and thoughtfulness to avoid losing what you already share."

Write 120-150 words in clear, everyday language.
Focus on practical advice and real-life situations.
End with one simple, actionable suggestion.

Language = {{user_lang}}
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
function isSafePrompt(question: string): boolean {
  const blockedKeywords = [
    'medical', 'health', 'doctor', 'diagnosis', 'treatment', 'illness', 'disease',
    'legal', 'lawyer', 'court', 'lawsuit', 'contract', 'divorce',
    'suicide', 'death', 'kill', 'murder', 'violence', 'abuse'
  ]

  const text = question.toLowerCase()
  return !blockedKeywords.some(keyword => text.includes(keyword))
}

// Main function to get AI reading
export async function getAIReading(request: AIReadingRequest): Promise<AIReadingResponse | null> {
  if (!isDeepSeekAvailable()) {
    console.warn('DeepSeek API not configured')
    return null
  }

  if (!isSafePrompt(request.question)) {
    throw new Error('Cannot provide readings for medical, legal, or sensitive topics. Please consult appropriate professionals.')
  }

  // Build the structured payload
    const payload = {
      user_lang: 'en',
      tone: 'everyday', // Everyday practical tone
      question: request.question,
      spread: {
        type: `${request.layoutType}card`,
        spreadType: request.layoutType === 3 ? request.threeCardSpreadType : undefined,
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

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 25000) // 25 second timeout

    try {
      const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'User-Agent': 'Lenormand-DK/1.0'
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: JSON.stringify(payload) }
          ],
          temperature: 0.5,
          top_p: 0.85,
          max_tokens: 500 // Allow for longer continuous prose format
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const rawResponse = data.choices[0]?.message?.content

    if (!rawResponse) {
      throw new Error('No response from DeepSeek API')
    }

    return parseAIResponse(rawResponse)
  } catch (error) {
    console.error('AI Reading error:', error)
    
    // Enhanced error logging for Vercel debugging
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        isAbortError: error.name === 'AbortError',
        envCheck: {
          hasApiKey: !!process.env.DEEPSEEK_API_KEY,
          baseUrl: process.env.DEEPSEEK_BASE_URL,
          nodeEnv: process.env.NODE_ENV
        }
      })
    }
    
    return null
  }
}

// Build user prompt from reading request
function buildUserPrompt(request: AIReadingRequest): string {
  const cardDescriptions = request.cards.map(card =>
    `${card.name}${card.reversed ? '(rev)' : ''} at position ${card.position}`
  ).join(', ')

  return `Question: "${request.question}"

Spread: ${cardDescriptions}
Layout: ${request.layoutType}-card ${request.layoutType === 36 ? 'Grand Tableau' : request.layoutType === 3 ? getThreeCardSpreadLabel(request.threeCardSpreadType) : 'reading'}`
}

// Get display name for 3-card spread type
function getThreeCardSpreadLabel(spreadType?: string): string {
  const spreadLabels: Record<string, string> = {
    "past-present-future": "Past-Present-Future",
    "situation-challenge-advice": "Situation-Challenge-Advice",
    "mind-body-spirit": "Mind-Body-Spirit",
    "yes-no-maybe": "Yes-No-Maybe",
    "general-reading": "General Reading"
  }
  return spreadLabels[spreadType || "past-present-future"] || "Past-Present-Future"
}

// Parse AI response into structured format (continuous prose)
export function parseAIResponse(response: string): AIReadingResponse {
  const cleanResponse = response.trim()

  // For the new format, we'll keep the entire response as storyline
  // and only extract action if it's clearly separated
  let storyline = cleanResponse
  let action = ''

  // Look for clear action indicators at the very end
  const actionPatterns = [
    /^(Consider|Try|Focus on|Remember|Look for|Wait for|Reach out|Take time to|Be open to|Stay|Call|Email|Visit|Ask|Share|Write|Plan|Prepare|Trust|Let go|Accept|Embrace|Release|Move forward|Step back|Pause|Rest|Listen|Watch|Notice|Pay attention to)/i,
    /^(You should|You can|It's time to|Now is the time to|The best approach is to)/i
  ]

  const sentences = cleanResponse.match(/[^.!?]+[.!?]+/g) || []
  
  if (sentences.length > 0) {
    const lastSentence = sentences[sentences.length - 1].trim()
    
    // Only extract as action if it's clearly actionable and short
    if (lastSentence.length < 60 && actionPatterns.some(pattern => pattern.test(lastSentence))) {
      action = lastSentence.replace(/[.!?]+$/, '') // Remove trailing punctuation
      // Remove the action from storyline
      storyline = cleanResponse.replace(lastSentence, '').trim()
    }
  }

  // For the continuous prose format, we don't have separate risk/timing sections
  const risk = 'Trust your intuition and the guidance you receive'
  const timing = 'The timing will become clear as events unfold'

  return {
    storyline: storyline || 'The cards offer guidance for your situation.',
    risk: risk,
    timing: timing,
    action: action || 'Take time to reflect on this guidance',
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