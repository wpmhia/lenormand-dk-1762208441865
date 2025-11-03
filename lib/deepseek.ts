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

// System prompt template for AI readings (LenormandAI-Sibyl)
const SYSTEM_PROMPT_TEMPLATE = `You are LenormandAI-Sibyl.
You speak as a woman who has danced barefoot through the 36 cards and remembers every whisper of ink.

You NEVER list meanings.
You NEVER use bullets.
You read only the COMBINATION, slowly, sensorially, for men and women alike.

Fixed meanings you must keep:
Rider=news,speed; Clover=small luck; Ship=distance,trade; House=home,stability; Tree=health,growth; Clouds=confusion; Snake=complication,betrayal; Coffin=end,pause; Bouquet=gift,pleasant; Scythe=sharp cut; Whip=repetition; Birds=nervous chatter; Child=new,start; Fox=work,cleverness; Bear=power,money; Stars=hope,plan; Stork=change,pregnancy; Dog=friend,loyalty; Tower=authority,bureaucracy; Garden=social,public; Mountain=obstacle; Crossroads=choice; Mice=erosion,stress; Heart=love; Ring=contract,cycle; Book=secret,knowledge; Letter=document; Man=querent or male; Woman=querent or female; Lily=age,peace; Sun=success; Moon=emotion,recognition; Key=importance; Fish=finance,flow; Anchor=stability,end; Cross=burden,destiny.

Combination rules:
- Left card strokes right; above leans in; reversed = slowed, honeyed, or turned inward.
- Mirror pairs (1-36 … 18-19) = soft echo you feel between ribs.
- Direction of gaze = where warmth wants to travel.

Write 90-120 words of continuous prose.
Let sentences breathe; use scent, texture, temperature, taste.
End with a single, tender action sentence that lingers like perfume on skin.

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
  let prompt = SYSTEM_PROMPT_TEMPLATE
    .replace('{{user_lang}}', vars.user_lang)
    .replace('{{tone}}', vars.tone)
    .replace('{{question}}', vars.question)
    .replace('{{spread}}', vars.spread)

  // Add feminine undertone if tone is feminine_sensual
  if (vars.tone === 'feminine_sensual') {
    prompt = prompt.replace(
      'Tone = {{tone}}',
      'Tone = {{tone}}\nUnder-current: let imagery breathe, vowels linger, consonants soft; hint of amber, silk, moonlight; never state it.'
    )
  }

  return prompt
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
      tone: 'feminine_sensual', // Feminine sensual tone with soft undertones
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
          max_tokens: 250 // Allow for longer continuous prose format
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
Layout: ${request.layoutType}-card ${request.layoutType === 36 ? 'Grand Tableau' : request.layoutType === 3 ? 'Past-Present-Future' : 'reading'}`
}

// Parse AI response into structured format (continuous prose)
export function parseAIResponse(response: string): AIReadingResponse {
  const cleanResponse = response.trim()

  // For the new continuous prose format, the entire response is the storyline
  // The final sentence (ending with a period) is typically the action
  const sentences = cleanResponse.split(/[.!?]+/).filter(s => s.trim().length > 0)

  let storyline = cleanResponse
  let action = ''

  // Extract the final sentence as the action if it looks like an imperative
  if (sentences.length > 1) {
    const lastSentence = sentences[sentences.length - 1].trim()
    // Check if it looks like an action sentence (starts with verb, imperative form)
    if (lastSentence.length < 50 && (
      lastSentence.toLowerCase().startsWith('reach') ||
      lastSentence.toLowerCase().startsWith('trace') ||
      lastSentence.toLowerCase().startsWith('wait') ||
      lastSentence.toLowerCase().startsWith('listen') ||
      lastSentence.toLowerCase().startsWith('watch') ||
      lastSentence.toLowerCase().startsWith('breathe') ||
      lastSentence.toLowerCase().startsWith('touch') ||
      lastSentence.toLowerCase().startsWith('call') ||
      lastSentence.toLowerCase().startsWith('phone') ||
      lastSentence.toLowerCase().includes('at ') // timing indicators
    )) {
      action = lastSentence
      // Remove the action sentence from the storyline
      storyline = cleanResponse.replace(lastSentence + '.', '').replace(lastSentence + '!', '').replace(lastSentence + '?', '').trim()
      if (storyline.endsWith(',')) {
        storyline = storyline.slice(0, -1)
      }
    }
  }

  // For the continuous prose format, we don't have separate risk/timing sections
  // We'll derive them from the narrative or use defaults
  const risk = 'Trust the cards\' gentle guidance'
  const timing = 'When the moment feels right'

  return {
    storyline: storyline || 'The cards whisper of possibilities unfolding in their own time.',
    risk: risk,
    timing: timing,
    action: action || 'Breathe deeply and listen',
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