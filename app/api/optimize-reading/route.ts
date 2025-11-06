import { NextRequest, NextResponse } from 'next/server'
import { classifyQuestion } from '@/lib/deepseek'

interface OptimizeRequest {
  question: string
}

interface OptimizeResponse {
  layoutType: 3 | 5 | 7 | 9 | 36
  spreadType?: string
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

async function analyzeQuestion(question: string): Promise<{ layoutType: 3 | 5 | 7 | 9 | 36; spreadType?: string }> {
  const lowerQuestion = question.toLowerCase()

  // Check for complex/comprehensive requests first
  if (QUESTION_PATTERNS.complex.keywords.some(keyword => lowerQuestion.includes(keyword))) {
    return { layoutType: 9 }
  }

  // Check for Grand Tableau requests
  if (lowerQuestion.includes('grand tableau') || lowerQuestion.includes('full deck') || lowerQuestion.includes('all cards')) {
    return { layoutType: 36 }
  }

  // Try AI classification first
  const aiCategory = await classifyQuestion(question)
  if (aiCategory) {
    const pattern = QUESTION_PATTERNS[aiCategory as keyof typeof QUESTION_PATTERNS]
    if (pattern) {
      return {
        layoutType: pattern.layoutType,
        spreadType: pattern.spreadType
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
    return {
      layoutType: bestMatch.pattern.layoutType,
      spreadType: bestMatch.pattern.spreadType
    }
  }
  
  // Default to 3-card general reading if no patterns match
  return { layoutType: 3, spreadType: 'general-reading' }
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
      spreadType: result.spreadType
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Error optimizing reading:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}