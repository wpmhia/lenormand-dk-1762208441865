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
1. Timeframe matters: "2025", "next year", "whole year" → 9-card or 36-card.
2. Scope matters: "family", "us", "everything" → larger spreads (7, 9, 36).
3. Simplicity matters: "yes/no", "today", "this week" → smaller spreads (3, 5, 7).
4. **Never default to 3-card unless the question is truly tiny.**
5. When in doubt, size up: 5-card is safer than 3-card for ambiguous questions.

Examples:
- "Will I get the job?" → 3-card Yes-No-Maybe, "Career", "Binary decision"
- "What will 2025 bring us as a family?" → 9-card Comprehensive, "Annual Forecast", "Year scope + family system"
- "Tell me about love" → 7-card Relationship, "Relationship", "Broad topic needs depth"
- "What about money, health and work?" → 9-card Comprehensive, "General", "Multiple life areas"
`;

interface OptimizeRequest {
  question: string
}

interface OptimizeResponse {
  layoutType: 3 | 5 | 7 | 9 | 36
  spreadType?: string
  confidence?: number
  reason?: string
  ambiguous?: boolean
  focus?: string
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

    try {
      // DeepSeek call
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

      // Safety: validate spread exists
      if (!VALID_SPREADS.includes(aiChoice.spreadType)) {
        throw new Error(`Invalid spread: ${aiChoice.spreadType}`);
      }

      // Map spreadType to layoutType and spreadType
      let layoutType: 3 | 5 | 7 | 9 | 36;
      let spreadType: string | undefined;

      if (aiChoice.spreadType === '3-card Past-Present-Future') {
        layoutType = 3;
        spreadType = 'past-present-future';
      } else if (aiChoice.spreadType === '3-card Yes-No-Maybe') {
        layoutType = 3;
        spreadType = 'yes-no-maybe';
      } else if (aiChoice.spreadType === '5-card Structured') {
        layoutType = 5;
        spreadType = 'structured-reading';
      } else if (aiChoice.spreadType === '7-card Relationship Double-Significator') {
        layoutType = 7;
        spreadType = 'relationship-double-significator';
      } else if (aiChoice.spreadType === '7-card Week-Ahead') {
        layoutType = 7;
        spreadType = 'week-ahead';
      } else if (aiChoice.spreadType === '9-card Comprehensive') {
        layoutType = 9;
        spreadType = undefined;
      } else if (aiChoice.spreadType === '36-card Grand Tableau') {
        layoutType = 36;
        spreadType = undefined;
      } else {
        throw new Error(`Unknown spread: ${aiChoice.spreadType}`);
      }

      const result = {
        layoutType,
        spreadType,
        confidence: 95, // High confidence for AI selection
        reason: aiChoice.reason,
        focus: aiChoice.readingType.toLowerCase().replace(/\s+/g, '-')
      };

      // Cache the result
      cache.set(cacheKey, { result, timestamp: Date.now() });

      return NextResponse.json(result);
    } catch (error) {
      console.error('AI selection failed:', error);

      // Smart fallback: NEVER 3-card by default
      const t = question.toLowerCase();
      let fallback = {
        layoutType: 5 as const,
        spreadType: 'structured-reading',
        confidence: 50,
        reason: 'AI unavailable - using structured default',
        focus: 'general'
      };

      if (t.includes('year') || t.includes('2025') || t.includes('2026')) {
        fallback = {
          layoutType: 9 as const,
          spreadType: undefined,
          confidence: 70,
          reason: 'AI unavailable - detected annual scope',
          focus: 'annual-forecast'
        };
      } else if (t.includes('family') || t.includes('relationship') || t.includes('love')) {
        fallback = {
          layoutType: 7 as const,
          spreadType: 'relationship-double-significator',
          confidence: 70,
          reason: 'AI unavailable - detected relationship scope',
          focus: 'relationship'
        };
      } else if (t.includes('yes') && t.includes('no')) {
        fallback = {
          layoutType: 3 as const,
          spreadType: 'yes-no-maybe',
          confidence: 80,
          reason: 'AI unavailable - detected yes/no format',
          focus: 'yesno'
        };
      }

      // Cache the fallback
      cache.set(cacheKey, { result: fallback, timestamp: Date.now() });

      return NextResponse.json(fallback);
    }

  } catch (error) {
    console.error('Error optimizing reading:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

interface OptimizeResponse {
  layoutType: 3 | 5 | 7 | 9 | 36
  spreadType?: string
  confidence?: number
  reason?: string
  ambiguous?: boolean
  focus?: string
}

// Question analysis patterns
const QUESTION_PATTERNS = {
  // Time-based questions
  future: {
    keywords: ['what will happen', 'what will become', 'what is the outcome', 'what is the result', 'what comes next', 'what is coming', 'what lies ahead', 'tomorrow', 'next week', 'next month', 'next year', 'in the future'],
    layoutType: 3 as const,
    spreadType: 'past-present-future'
  },
  timing: {
    keywords: ['when', 'timing', 'how long', 'how soon', 'time', 'date', 'week', 'month', 'year'],
    layoutType: 7 as const,
    spreadType: 'week-ahead'
  },
  
  // Decision/Choice questions
  decision: {
    keywords: ['should i choose', 'which option', 'what should i do', 'decision between', 'either or', 'which path', 'what to choose', 'select between', 'pick one'],
    layoutType: 3 as const,
    spreadType: 'situation-challenge-advice'
  },
  yesno: {
    keywords: ['is it yes or no', 'will it happen', 'should i do it', 'can i expect', 'will i get', 'is it possible', 'will i succeed', 'should i proceed'],
    layoutType: 3 as const,
    spreadType: 'yes-no-maybe'
  },
  
  // Problem/Challenge questions
  problem: {
    keywords: ['problem', 'issue', 'challenge', 'obstacle', 'difficulty', 'struggle', 'blocked', 'stuck', 'conflict', 'trouble'],
    layoutType: 5 as const,
    spreadType: 'structured-reading'
  },
  solution: {
    keywords: ['solution', 'solve', 'fix', 'resolve', 'overcome', 'help', 'advice', 'guidance', 'how to'],
    layoutType: 5 as const,
    spreadType: 'structured-reading'
  },
  
  // Relationship questions
  relationship: {
    keywords: ['relationship', 'love', 'romance', 'partner', 'boyfriend', 'girlfriend', 'husband', 'wife', 'dating', 'marriage', 'breakup', 'divorce'],
    layoutType: 7 as const,
    spreadType: 'relationship-double-significator'
  },
  
  // Work/Career questions
  career: {
    keywords: ['job', 'career', 'work', 'business', 'promotion', 'boss', 'colleague', 'company', 'office', 'professional'],
    layoutType: 5 as const,
    spreadType: 'structured-reading'
  },
  
  // Health/Wellness questions (non-medical)
  wellness: {
    keywords: ['health', 'wellness', 'energy', 'stress', 'anxiety', 'mood', 'emotional', 'mental', 'balance', 'self-care'],
    layoutType: 3 as const,
    spreadType: 'mind-body-spirit'
  },
  
  // Financial questions
  money: {
    keywords: ['money', 'financial', 'finance', 'income', 'salary', 'investment', 'debt', 'savings', 'wealth', 'rich', 'poor'],
    layoutType: 5 as const,
    spreadType: 'structured-reading'
  },
  
  // General/Life questions
  general: {
    keywords: ['life', 'path', 'journey', 'purpose', 'meaning', 'guidance', 'insight', 'understanding', 'clarity'],
    layoutType: 3 as const,
    spreadType: 'general-reading'
  },
  
  // Complex/Comprehensive questions
  complex: {
    keywords: ['comprehensive', 'detailed', 'thorough', 'in-depth', 'complete', 'full picture', 'everything', 'overall'],
    layoutType: 9 as const
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

async function analyzeQuestion(question: string): Promise<{ layoutType: 3 | 5 | 7 | 9 | 36; spreadType?: string }> {
  // Auto-capitalise months and common pronouns/names
  const capitalisedQuestion = question.replace(/\b(i\b|january|february|march|april|may|june|july|august|september|october|november|december)\b/gi, w => w.charAt(0).toUpperCase() + w.slice(1))

  const lowerQuestion = capitalisedQuestion.toLowerCase()

  // Check for complex/comprehensive requests first
  if (QUESTION_PATTERNS.complex.keywords.some(keyword => lowerQuestion.includes(keyword))) {
    return { layoutType: 9 }
  }

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
        confidence: 90, // High confidence for AI classification
        reason: `AI classified as ${aiCategory} category`,
        focus: aiCategory
      }
    }
  }

  // Fallback to keyword-based analysis
  
  // Score each pattern based on weighted keyword matches
  const scores = Object.entries(QUESTION_PATTERNS).map(([key, pattern]) => {
    let score = 0
    pattern.keywords.forEach(keyword => {
      if (lowerQuestion.includes(keyword)) {
        // Higher weight for longer, more specific phrases
        const weight = keyword.length > 10 ? 3 : keyword.length > 5 ? 2 : 1
        score += weight
      }
    })
    return { key, score, pattern }
  })

  // Context-aware adjustments
  scores.forEach(item => {
    // Boost decision patterns for questions starting with "should I" or "which"
    if ((lowerQuestion.startsWith('should i') || lowerQuestion.startsWith('which')) && item.key === 'decision') {
      item.score += 2
    }
    // Boost yesno for questions starting with "will I" or "can I"
    if ((lowerQuestion.startsWith('will i') || lowerQuestion.startsWith('can i')) && item.key === 'yesno') {
      item.score += 2
    }
  })

  // Filter out zero scores
  const filteredScores = scores.filter(item => item.score > 0)
  
  // Sort by score (highest first)
  filteredScores.sort((a, b) => b.score - a.score)

  if (filteredScores.length > 0) {
    const bestMatch = filteredScores[0]
    let layoutType = bestMatch.pattern.layoutType
    let spreadType = bestMatch.pattern.spreadType

    // Calculate confidence (best score as percentage of max possible score)
    const maxPossibleScore = 10 // Rough estimate
    const confidence = Math.min(100, (bestMatch.score / maxPossibleScore) * 100)

    // Check for ambiguity (multiple categories with scores within 20% of best)
    const bestScore = bestMatch.score
    const ambiguous = filteredScores.filter(item => item.score >= bestScore * 0.8).length > 1

    // Generate reason
    let reason = `Detected keywords for ${bestMatch.key} category`
    if (scope === 'macro') {
      reason += ' + macro scope upgrade'
    }

    // Upgrade spread for macro scope questions
    if (scope === 'macro') {
      if (layoutType <= 5) {
        layoutType = 9 // Upgrade to comprehensive
        spreadType = undefined // Comprehensive doesn't have specific spread type
        reason += ' (upgraded to comprehensive for broad scope)'
      } else if (layoutType === 7) {
        layoutType = 36 // Upgrade to Grand Tableau for very broad questions
        spreadType = undefined
        reason += ' (upgraded to Grand Tableau for broad scope)'
      }
      // For 9, keep as is; for 36, already max
    }

    return {
      layoutType,
      spreadType,
      confidence: Math.round(confidence),
      reason,
      ambiguous,
      focus: bestMatch.key
    }
  }
  
  // Default to 3-card general reading if no patterns match
  return {
    layoutType: 3,
    spreadType: 'general-reading',
    confidence: 0,
    reason: 'No specific patterns detected, using general reading',
    focus: 'general'
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