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



// System prompt template for AI readings (Condensed for efficiency)
const SYSTEM_PROMPT_TEMPLATE = `Read Lenormand cards for practical guidance.

NEVER list meanings. NEVER use bullets. Read combinations for real-life advice.

Card meanings: Rider=news,speed; Clover=small luck; Ship=distance,trade; House=home,stability; Tree=health,growth; Clouds=confusion; Snake=complication,betrayal; Coffin=end,pause; Bouquet=gift,pleasant; Scythe=sharp cut; Whip=repetition; Birds=nervous chatter; Child=new,start; Fox=work,cleverness; Bear=power,money; Stars=hope,plan; Stork=change,pregnancy; Dog=friend,loyalty; Tower=authority,bureaucracy; Garden=social,public; Mountain=obstacle; Crossroads=choice; Mice=erosion,stress; Heart=love; Ring=contract,cycle; Book=secret,knowledge; Letter=document; Man=querent or male; Woman=querent or female; Lily=age,peace; Sun=success; Moon=emotion,recognition; Key=importance; Fish=finance,flow; Anchor=stability,end; Cross=burden,destiny.

Rules: Left modifies right. Above influences below.

3-Card Spreads:
- past-present-future: Past→Present→Future timeline
- situation-challenge-advice: Situation→Challenge→Advice
- mind-body-spirit: Mind→Body→Spirit
- yes-no-maybe: Yes→No→Maybe factors
- general-reading: Connect cards as flowing story about relationships/emotions/practical implications

Write 120-150 words everyday language. End with actionable suggestion.

Language={{user_lang}} Question={{question}} Spread={{spread}}`

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
    if (process.env.NODE_ENV === 'development') console.warn('DeepSeek API not configured')
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
          pos: card.position
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
          max_tokens: 400 // Optimized for quality readings
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

    return parseAIResponse(rawResponse, request.layoutType, request.threeCardSpreadType)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
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
    }
    
    return null
  }
}

// Build user prompt from reading request
function buildUserPrompt(request: AIReadingRequest): string {
  const cardDescriptions = request.cards.map(card =>
    `${card.name} at position ${card.position}`
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

// Contextual fallback actions based on reading type
const getContextualAction = (layout: number, spread?: string): string => {
  if (layout === 3) {
    const actions: Record<string, string> = {
      'past-present-future': 'Consider how your past experiences inform your current path forward',
      'situation-challenge-advice': 'Address the challenge head-on with the clarity you now have',
      'mind-body-spirit': 'Balance your mind, body, and spirit through mindful practices',
      'yes-no-maybe': 'Trust your intuition as the situation continues to clarify',
      'general-reading': 'Apply this wisdom to your relationships and practical decisions'
    }
    return actions[spread || 'general-reading'] || 'Reflect on how these insights apply to your current situation'
  }

  if (layout === 5) {
    return 'Take the first step toward implementing these insights in your life'
  }

  if (layout === 9) {
    return 'Use this comprehensive guidance to navigate your current challenges'
  }

  if (layout === 36) {
    return 'Let this Grand Tableau reading illuminate your path forward'
  }

  return 'Take time to reflect on this guidance and how it applies to your situation'
}

// Parse AI response into structured format
export function parseAIResponse(response: string, layoutType?: number, threeCardSpreadType?: string): AIReadingResponse {
  const cleanResponse = response.trim()

  // Try to parse structured format first (numbered or bold markdown)
  const structuredResult = parseStructuredResponse(cleanResponse, layoutType, threeCardSpreadType)
  if (structuredResult) {
    return structuredResult
  }

  // Fall back to continuous prose format
  let storyline = cleanResponse
  let action = ''

  // Enhanced action pattern recognition
  const actionPatterns = [
    // Direct action verbs
    /^(Consider|Try|Focus on|Remember|Look for|Wait for|Reach out|Take time to|Be open to|Stay|Call|Email|Visit|Ask|Share|Write|Plan|Prepare|Trust|Let go|Accept|Embrace|Release|Move forward|Step back|Pause|Rest|Listen|Watch|Notice|Pay attention to|Start|Begin|Continue|Stop|Change|Transform|Create|Build|Connect|Communicate|Express|Share|Give|Receive|Learn|Teach|Explore|Discover|Heal|Grow|Strengthen|Support|Help|Guide|Lead|Follow|Choose|Decide|Act|Do)/i,
    // Suggestion phrases
    /^(You should|You can|It's time to|Now is the time to|The best approach is to|I suggest you|My advice is to|Try this|Do this|Take this step|Make this choice|Follow this path)/i,
    // Imperative forms
    /^(Don't|Do not|Always|Never|Keep|Maintain|Develop|Cultivate|Nurture|Seek|Find|Pursue|Avoid|Prevent|Resolve|Address|Solutions|Opportunities)/i
  ]

  const sentences = cleanResponse.match(/[^.!?]+[.!?]+/g) || []

  // Try to extract action from the last few sentences
  for (let i = sentences.length - 1; i >= Math.max(0, sentences.length - 3); i--) {
    const sentence = sentences[i].trim()

    // Skip very short or very long sentences
    if (sentence.length < 10 || sentence.length > 80) continue

    // Check if sentence contains actionable language
    if (actionPatterns.some(pattern => pattern.test(sentence))) {
      // Additional quality checks
      const isQualityAction = (
        // Has a clear verb
        /\b(consider|try|focus|remember|look|wait|reach|take|be|stay|call|email|visit|ask|share|write|plan|prepare|trust|let|accept|embrace|release|move|step|pause|rest|listen|watch|notice|pay|start|begin|continue|stop|change|transform|create|build|connect|communicate|express|give|receive|learn|teach|explore|discover|heal|grow|strengthen|support|help|guide|lead|follow|choose|decide|act|do)\b/i.test(sentence) &&
        // Not just generic advice
        !/\b(be positive|stay positive|think positive|have faith|trust the process|everything will work out|be patient|good things come|miracles happen)\b/i.test(sentence.toLowerCase()) &&
        // Has some specificity
        sentence.split(' ').length >= 3
      )

      if (isQualityAction) {
        action = sentence.replace(/[.!?]+$/, '') // Remove trailing punctuation
        // Remove the action from storyline
        storyline = cleanResponse.replace(sentence, '').trim()
        break
      }
    }
  }

  // For the continuous prose format, we don't have separate risk/timing sections
  const risk = 'Trust your intuition and the guidance you receive'
  const timing = 'The timing will become clear as events unfold'

  return {
    storyline: storyline || 'The cards offer guidance for your situation.',
    risk: risk,
    timing: timing,
    action: action || getContextualAction(layoutType || 3, threeCardSpreadType),
    rawResponse: response
  }
}

// Helper function to parse structured responses
function parseStructuredResponse(response: string, layoutType?: number, threeCardSpreadType?: string): AIReadingResponse | null {
  const lines = response.split('\n').map(line => line.trim()).filter(line => line.length > 0)

  let storyline = ''
  let risk = ''
  let timing = ''
  let action = ''

  // Try numbered format: 1. **Story** ..., 2. **Risk** ..., etc.
  const numberedBoldPattern = /^(\d+)\.\s*\*\*(\w+)\*\*\s*(.+)$/
  const sections: Record<string, string> = {}

  for (const line of lines) {
    let match = line.match(numberedBoldPattern)
    if (match) {
      const [, , sectionName, content] = match
      sections[sectionName.toLowerCase()] = content.trim()
    }
  }

  // Try numbered format without bold: 1. Story: ..., 2. Risk: ..., etc.
  if (Object.keys(sections).length === 0) {
    const numberedColonPattern = /^(\d+)\.\s*(\w+):\s*(.+)$/
    for (const line of lines) {
      const match = line.match(numberedColonPattern)
      if (match) {
        const [, , sectionName, content] = match
        sections[sectionName.toLowerCase()] = content.trim()
      }
    }
  }

  // Try bold markdown format: **Story** ..., **Risk** ..., etc.
  if (Object.keys(sections).length === 0) {
    const boldPattern = /^\*\*(\w+)\*\*\s*(.+)$/
    for (const line of lines) {
      const match = line.match(boldPattern)
      if (match) {
        const [, sectionName, content] = match
        sections[sectionName.toLowerCase()] = content.trim()
      }
    }
  }

  // Try simple numbered format: 1. Content, 2. Risk: ..., etc.
  if (Object.keys(sections).length === 0) {
    const simpleNumberedPattern = /^(\d+)\.\s*(.+)$/
    const numberedLines: string[] = []

    for (const line of lines) {
      const match = line.match(simpleNumberedPattern)
      if (match) {
        numberedLines.push(match[2].trim())
      }
    }

    // If we have exactly 4 numbered lines, assume they're story, risk, timing, action
    if (numberedLines.length === 4) {
      storyline = numberedLines[0]
      risk = numberedLines[1].replace(/^Risk:\s*/i, '')
      timing = numberedLines[2].replace(/^Timing:\s*/i, '')
      action = numberedLines[3].replace(/^Act:\s*/i, '')
    }
  }

  // Extract sections if we found them via patterns
  if (Object.keys(sections).length > 0) {
    storyline = sections.story || sections.storyline || ''
    risk = sections.risk || ''
    timing = sections.timing || ''
    action = sections.act || sections.action || ''

    // If we have sections but no explicit story, check if the first numbered line is the story
    if (!storyline) {
      const firstNumberedLine = lines.find(line => /^\d+\./.test(line))
      if (firstNumberedLine) {
        const content = firstNumberedLine.replace(/^\d+\.\s*/, '').trim()
        // If it doesn't start with a section label, treat it as story
        if (!/^(story|risk|timing|act)[:\s]/i.test(content)) {
          storyline = content
        }
      }
    }
  }

  // If we found at least storyline, consider it structured
  if (storyline) {
    // Use the same contextual action logic
    const contextualAction = getContextualAction(layoutType || 3, threeCardSpreadType)

    return {
      storyline: storyline || 'The cards offer guidance for your situation.',
      risk: risk || 'Trust your intuition and the guidance you receive',
      timing: timing || 'The timing will become clear as events unfold',
      action: action || contextualAction,
      rawResponse: response
    }
  }

  return null
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