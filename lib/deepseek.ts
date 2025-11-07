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
  spreadId: string
  userLocale?: string
  layoutType?: number
  threeCardSpreadType?: string
  fiveCardSpreadType?: string
  sevenCardSpreadType?: string
}

// AI Reading response interface
export interface AIReadingResponse {
  storyline: string
  risk: string
  timing: string
  action: string
  rawResponse: string
}

// Helper function to parse spreadId and derive layout information
function parseSpreadId(spreadId: string): {
  layoutType: number
  threeCardSpreadType?: string
  fiveCardSpreadType?: string
  sevenCardSpreadType?: string
} {
  // Map spreadId to layout type and spread type
  const spreadMappings: Record<string, {
    layoutType: number
    threeCardSpreadType?: string
    fiveCardSpreadType?: string
    sevenCardSpreadType?: string
  }> = {
    // 3-card spreads
    "sentence-3": { layoutType: 3, threeCardSpreadType: "general-reading" },
    "past-present-future": { layoutType: 3, threeCardSpreadType: "past-present-future" },
    "yes-no-maybe": { layoutType: 3, threeCardSpreadType: "yes-no-maybe" },
    "situation-challenge-advice": { layoutType: 3, threeCardSpreadType: "situation-challenge-advice" },
    "mind-body-spirit": { layoutType: 3, threeCardSpreadType: "mind-body-spirit" },

    // 5-card spreads
    "sentence-5": { layoutType: 5, fiveCardSpreadType: "general-reading" },
    "structured-reading": { layoutType: 5, fiveCardSpreadType: "structured-reading" },

    // 7-card spreads
    "week-ahead": { layoutType: 7, sevenCardSpreadType: "week-ahead" },
    "relationship-double-significator": { layoutType: 7, sevenCardSpreadType: "relationship-double-significator" },

    // 9-card spreads
    "comprehensive": { layoutType: 9 },

    // 36-card spreads
    "grand-tableau": { layoutType: 36 }
  }

  return spreadMappings[spreadId] || { layoutType: 3, threeCardSpreadType: "general-reading" }
}



// Optimized system prompt for faster AI responses
const SYSTEM_PROMPT_TEMPLATE = `You are a Lenormand card reader. Provide direct, practical guidance in clear, everyday language. Do not use conversational phrases like "Of course" or "Certainly". Start directly with the reading interpretation.

Key meanings: Rider=news/speed, Clover=luck, Ship=travel/distance, House=home/stability, Tree=health/growth, Clouds=confusion, Snake=issues/betrayal, Coffin=end/closure, Bouquet=gifts/pleasure, Scythe=cutting change, Whip=repetition/conflict, Birds=communication/anxiety, Child=new beginnings, Fox=cunning/work, Bear=strength/money, Stars=hope/goals, Stork=change/movement, Dog=loyalty/friends, Tower=authority/structure, Garden=social/public, Mountain=obstacles, Crossroads=choices, Mice=loss/worry, Heart=love/emotions, Ring=commitment/cycles, Book=secrets/learning, Letter=communication, Man=masculine energy, Woman=feminine energy, Lily=peace/maturity, Sun=success/clarity, Moon=intuition/emotions, Key=importance/solutions, Fish=finance/abundance, Anchor=stability/security, Cross=burden/fate.

Reading rules: Adjacent cards modify each other. Position matters.

3-card spreads: past-present-future (timeline), situation-challenge-advice (problem-solving), mind-body-spirit (holistic), yes-no-maybe (count positive vs negative card meanings with majority rules, center card as tie-breaker), general (flexible narrative flow: can be read as past-present-future OR mind-body-spirit OR situation-action-outcome, always analyze mirror relationship between positions 1&3 for hidden tension or harmony).

5-card spreads: For structured readings, read left→right as premise (foundation) – obstacle (challenge) – what helps (resources/support) – outcome (result) – final result (ultimate conclusion). Use flexible 5-stage scripts like situation-cause-solution-development-resolution or past-present-future-advice-outcome. Always analyze knighting (positions 1-3-5: the journey's progression) and mirroring (1-5: beginning vs end, 2-4: challenge vs development) for extra nuance and hidden connections. For general readings, read as a flowing sentence interpretation that weaves all 5 cards into a cohesive narrative.

7-card spreads: For Week-Ahead spreads, read Monday→Sunday as weekly progression. Monday (new beginnings/fresh energy) → Tuesday (challenges/work) → Wednesday (communication/connections) → Thursday (progress/momentum) → Friday (social/completion) → Saturday (rest/reflection) → Sunday (closure/spirituality). Always analyze knighting (positions 1-3-5-7) to reveal the running theme or weekly energy pattern. For Relationship Double-Significator spreads, read in triangular layout: positions 1-2-3 (left partner's past-present-future view), position 4 (what sits between them), positions 5-6-7 (right partner's past-present-future view). The central card reveals relationship dynamics and challenges.

9-card spreads (3x3 grid): Read in three layers - first horizontal time flow (top row: recent past, middle row: present, bottom row: near future), then vertical life areas (left column: inner world/thoughts/feelings, middle column: direct actions/central issue, right column: outside world/influences), finally diagonal karmic drivers (top-left to bottom-right: developing life path, top-right to bottom-left: corrective/blocking energy).

Grand Tableau (36-card spread): Traditional Lenormand reading sequence - 1. Locate significator (Woman #29 or Man #28) representing the querent, 2. Read "cross of the moment" (5-card cross: significator's full row + full column) for core message, 3. Read four corners (1-36-6-31) for fixed frame of situation, 4. Read four center cards (13-16-12-11) for what's secretly driving the matter, 5. Read nine-card square around significator (±1 card in row/column) for immediate influences, 6. Count in patterns (7s or 5s from significator) to tell story through time, 7. Note knights (90° positions), mirrors (opposite), and house meanings where cards fall.

Write 100-130 words. Weave actionable guidance naturally throughout the reading narrative for a cohesive, flowing interpretation.

Lang={{lang}} Q={{q}} Cards={{cards}} Spread={{spread}}`

// Function to build system prompt with variables
function buildSystemPrompt(vars: {
  lang: string
  q: string
  cards: string
  spread: string
}): string {
  return SYSTEM_PROMPT_TEMPLATE
    .replace('{{lang}}', vars.lang)
    .replace('{{q}}', vars.q)
    .replace('{{cards}}', vars.cards)
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

// Classify question category using AI
export async function classifyQuestion(question: string): Promise<string | null> {
  if (!isDeepSeekAvailable()) {
    return null
  }

  if (!isSafePrompt(question)) {
    return 'general' // Safe fallback
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout for classification

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
          {
            role: 'system',
            content: `Classify this Lenormand question into exactly one of these categories. Return only the category name in lowercase, no explanation:

future - questions about what will happen, outcomes, future events
timing - questions about when something will happen, timeframes, dates
decision - questions about choices, what to do, options
yesno - yes/no questions, will I/can I questions
problem - questions about issues, challenges, obstacles
solution - questions about solutions, fixes, advice
relationship - questions about love, partners, relationships
career - questions about work, jobs, professional matters
wellness - questions about health, emotions, personal growth
money - questions about finances, money, wealth
general - general guidance, life questions
complex - comprehensive or detailed analysis needed`
          },
          { role: 'user', content: question }
        ],
        temperature: 0.1,
        max_tokens: 20
      }),
      signal: controller.signal
    })

    if (!response.ok) {
      console.warn('DeepSeek classification failed:', response.status)
      return null
    }

    const data = await response.json()
    const category = data.choices?.[0]?.message?.content?.trim().toLowerCase()

    // Validate it's a known category
    const validCategories = ['future', 'timing', 'decision', 'yesno', 'problem', 'solution', 'relationship', 'career', 'wellness', 'money', 'general', 'complex']
    if (validCategories.includes(category)) {
      return category
    }

    return null
  } catch (error) {
    console.warn('DeepSeek classification error:', error)
    return null
  } finally {
    clearTimeout(timeoutId)
  }
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

  // Parse spreadId to get layout information
  const spreadInfo = parseSpreadId(request.spreadId)
  const layoutType = request.layoutType || spreadInfo.layoutType
  const threeCardSpreadType = request.threeCardSpreadType || spreadInfo.threeCardSpreadType
  const fiveCardSpreadType = request.fiveCardSpreadType || spreadInfo.fiveCardSpreadType
  const sevenCardSpreadType = request.sevenCardSpreadType || spreadInfo.sevenCardSpreadType

    // Build optimized payload for faster processing
      const payload = {
        lang: 'en',
        q: request.question,
        spread: `${layoutType}card${layoutType === 3 ? `-${threeCardSpreadType}` : layoutType === 5 ? `-${fiveCardSpreadType}` : layoutType === 7 ? `-${sevenCardSpreadType}` : ''}`,
        cards: request.cards.map(card => `${card.name}:${card.position}`).join(',')
      }

    // Build system prompt with variables
    const systemPrompt = buildSystemPrompt({
      lang: payload.lang,
      q: payload.q,
      cards: payload.cards,
      spread: payload.spread
    })

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 40000) // 40 second timeout

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
            { role: 'system', content: systemPrompt }
          ],
          temperature: 0.5,
          top_p: 0.85,
          max_tokens: 300 // Reduced for faster responses
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

    return parseAIResponse(rawResponse, layoutType, threeCardSpreadType, fiveCardSpreadType)
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

// Simplified user prompt (now handled in system prompt)
function buildUserPrompt(request: AIReadingRequest): string {
  return '' // Not used anymore
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

// Contextual fallback conclusions based on reading type
function getContextualAction(layoutType: number, threeCardSpreadType?: string, fiveCardSpreadType?: string): string {
  if (layoutType === 3) {
    switch (threeCardSpreadType) {
      case 'past-present-future':
        return 'Learn from the past, act in the present, and prepare for the future'
      case 'situation-challenge-advice':
        return 'Address the challenge directly and follow the advice given'
      case 'mind-body-spirit':
        return 'Balance your mind, nurture your body, and honor your spirit'
      case 'yes-no-maybe':
        return 'Trust the majority of card meanings, with the center as tie-breaker'
      case 'general-reading':
      default:
        return 'Act on the central insight that emerged from the mirror relationship between your cards'
    }
  } else if (layoutType === 5) {
    switch (fiveCardSpreadType) {
      case 'general-reading':
        return 'Follow the flowing narrative of the five cards to guide your path'
      default:
        return 'Address the obstacle, utilize available resources, and embrace the outcome'
    }
  } else if (layoutType === 7) {
    return 'Follow the weekly progression and relationship dynamics revealed'
  } else if (layoutType === 9) {
    return 'Balance the three layers of time, life areas, and karmic drivers'
  } else if (layoutType === 36) {
    return 'Focus on the cross of the moment and significator influences'
  }

  return 'Trust your intuition and follow the guidance revealed'
}

// Parse AI response into structured format
export function parseAIResponse(response: string, layoutType?: number, threeCardSpreadType?: string, fiveCardSpreadType?: string): AIReadingResponse {
  const cleanResponse = response.trim()

  // Try to parse structured format first (numbered or bold markdown)
  const structuredResult = parseStructuredResponse(cleanResponse, layoutType, threeCardSpreadType, fiveCardSpreadType)
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

  // Use contextual action for unstructured responses
  const contextualAction = getContextualAction(layoutType || 3, threeCardSpreadType, fiveCardSpreadType)

  return {
    storyline: storyline || 'The cards offer guidance for your situation.',
    risk: risk,
    timing: timing,
    action: action || contextualAction,
    rawResponse: response
  }
}

// Helper function to parse structured responses
function parseStructuredResponse(response: string, layoutType?: number, threeCardSpreadType?: string, fiveCardSpreadType?: string): AIReadingResponse | null {
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
    action = sections.act || sections.action || sections.conclusion || sections.guidance || ''

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
    // Use contextual action if no action was found in structured response
    const contextualAction = getContextualAction(layoutType || 3, threeCardSpreadType, fiveCardSpreadType)

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