import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory cache for optimization results (5-minute TTL)
const cache = new Map<string, { result: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

const VALID_SPREADS = [
  '3-card Past-Present-Future',
  '3-card Yes-No-Maybe',
  '5-card Structured',
  '7-card Relationship Double-Significator',
  '7-card Week-Ahead',
  '9-card Comprehensive',
  '36-card Grand Tableau',
] as const;

const SYSTEM_PROMPT = `
You are a Lenormand spread selector. Analyze the question and return ONLY this JSON:
\`\`\`json
{
  "readingType": "string", // e.g. "Annual Forecast", "Relationship", "Career"
  "spreadType": "string",  // must be one of: ${VALID_SPREADS.join(', ')}
  "reason": "string"       // one short sentence explaining your choice
}
\`\`\`

**Selection rules:**
1. Year questions (2026, next year, annual) → 9-card Comprehensive
2. Yes/No or binary decisions → 3-card Yes-No-Maybe
3. Relationship/love questions → 7-card Relationship Double-Significator
4. General life guidance or multiple areas → 5-card Structured
5. Family scope or broad topics → upgrade to larger spreads (7, 9, 36)
6. **Never default to 3-card unless truly binary**

Examples:
- "Will I get the job?" → 3-card Yes-No-Maybe, "Career", "Binary decision"
- "What will 2026 bring us?" → 9-card Comprehensive, "Annual Forecast", "Year timeframe"
- "Tell me about love" → 7-card Relationship Double-Significator, "Relationship", "Love topic"
- "What about money, health and work?" → 9-card Comprehensive, "General", "Multiple life areas"
`;

interface OptimizeRequest {
  question: string
}

// Question analysis patterns
const QUESTION_PATTERNS = {
  future: {
    keywords: ['what will happen', 'what will become', 'what is the outcome', 'what is the result', 'what comes next', 'what is coming', 'what lies ahead', 'tomorrow', 'next week', 'next month', 'next year', 'in the future', '2026', '2025', 'annual', 'year ahead'],
    layoutType: 9 as const,
    spreadType: 'comprehensive'
  },
  yesno: {
    keywords: ['is it yes or no', 'will it happen', 'should i do it', 'can i expect', 'will i get', 'is it possible', 'will i succeed', 'should i proceed', 'yes or no'],
    layoutType: 3 as const,
    spreadType: 'yes-no-maybe'
  },
  relationship: {
    keywords: ['relationship', 'love', 'romance', 'partner', 'boyfriend', 'girlfriend', 'husband', 'wife', 'dating', 'marriage', 'breakup', 'divorce', 'soulmate', 'crush'],
    layoutType: 7 as const,
    spreadType: 'relationship-double-significator'
  },
  complex: {
    keywords: ['comprehensive', 'detailed', 'thorough', 'in-depth', 'complete', 'full picture', 'everything', 'overall', 'life in general', 'general outlook', 'major events', 'multiple areas', 'money', 'health', 'work', 'career'],
    layoutType: 9 as const,
    spreadType: 'comprehensive'
  }
}

// Scope detector for macro vs micro questions
function detectScope(text: string): { scope: 'micro' | 'macro'; reason: string } {
  const t = text.toLowerCase();

  const yearPhrases   = /\b(2026|2025|next year|whole year|entire year|annual|year ahead)\b/i;
  const familyPhrases = /\b(family|us as a family|household|kids?|children|partner|together)\b/i;
  const broadPhrases  = /\b(everything|all areas|life in general|general outlook|major events)\b/i;
  const multiMonth    = /\b(quarter|six.month|9.month|12.month|jan.*feb.*mar)\b/i;

  let score = 0;
  if (yearPhrases.test(t))   score++;
  if (familyPhrases.test(t)) score++;
  if (broadPhrases.test(t))  score++;
  if (multiMonth.test(t))    score++;

  return score >= 2
    ? { scope: 'macro', reason: 'Long time-frame + multi-person subject' }
    : { scope: 'micro', reason: 'Single-issue or short-term' };
}

async function analyzeQuestion(question: string): Promise<{ layoutType: 3 | 5 | 7 | 9 | 36; spreadType?: string; confidence?: number; reason?: string; ambiguous?: boolean; focus?: string }> {
  // Auto-capitalise months and common pronouns/names
  const capitalisedQuestion = question.replace(/\b(i\b|january|february|march|april|may|june|july|august|september|october|november|december)\b/gi, w => w.charAt(0).toUpperCase() + w.slice(1))

  const lowerQuestion = capitalisedQuestion.toLowerCase()

  // Check for Grand Tableau requests
  if (lowerQuestion.includes('grand tableau') || lowerQuestion.includes('full deck') || lowerQuestion.includes('all cards')) {
    return { layoutType: 36 }
  }

  // Detect scope for potential spread upgrades
  const { scope } = detectScope(question)

  // Try AI classification first
  const aiCategory = await classifyQuestion(question)
  if (aiCategory) {
    const pattern = QUESTION_PATTERNS[aiCategory as keyof typeof QUESTION_PATTERNS]
    if (pattern) {
      let layoutType = pattern.layoutType
      let spreadType = pattern.spreadType

      // Upgrade spread for macro scope questions
      if (scope === 'macro') {
        if (layoutType <= 5) {
          layoutType = 9 // Upgrade to comprehensive
          spreadType = undefined // Comprehensive doesn't have specific spread type
        } else if (layoutType === 7) {
          layoutType = 36 // Upgrade to Grand Tableau for very broad questions
          spreadType = undefined
        }
        // For 9, keep as is; for 36, already max
      }

       return {
        layoutType,
        spreadType,
        confidence: 95, // High confidence for AI classification
        reason: `AI classified as ${aiCategory} category`,
        focus: aiCategory,
        ambiguous: false
      }
    }
  }

  // Fallback when AI fails
  return {
    layoutType: 5,
    spreadType: 'structured-reading',
    confidence: 30,
    reason: 'AI unavailable, using general structured reading',
    focus: 'general',
    ambiguous: false
  }
}

// AI classification function using DeepSeek
async function classifyQuestion(question: string): Promise<string | null> {
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: question },
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) throw new Error(`DeepSeek error: ${response.status}`);

    const data = await response.json();
    const aiChoice = JSON.parse(data.choices[0].message.content);

    return aiChoice.readingType;
  } catch (error) {
    console.error('AI classification failed:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: OptimizeRequest = await request.json()

    if (!body.question || typeof body.question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      )
    }

    const question = body.question.trim()

    // Check cache first
    const cacheKey = question.toLowerCase()
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.result)
    }
    
    if (question.length < 5) {
      return NextResponse.json(
        { error: 'Question is too short' },
        { status: 400 }
      )
    }
    
    if (question.length > 500) {
      return NextResponse.json(
        { error: 'Question is too long' },
        { status: 400 }
      )
    }
    
    // Analyze the question and determine optimal reading
    const result = await analyzeQuestion(question)
    
    const response: OptimizeResponse = {
      layoutType: result.layoutType,
      spreadType: result.spreadType,
      confidence: result.confidence,
      reason: result.reason,
      ambiguous: result.ambiguous,
      focus: result.focus
    }

    // Cache the result
    cache.set(cacheKey, { result: response, timestamp: Date.now() })

    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Error optimizing reading:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}