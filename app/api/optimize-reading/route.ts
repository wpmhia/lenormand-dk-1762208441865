import { NextRequest, NextResponse } from 'next/server'

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
    keywords: ['future', 'will', 'happen', 'become', 'outcome', 'result', 'next', 'coming', 'ahead', 'tomorrow', 'next week', 'next month', 'next year'],
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
    keywords: ['should', 'choose', 'decision', 'option', 'which', 'either', 'or', 'between', 'select', 'pick'],
    layoutType: 3 as const,
    spreadType: 'situation-challenge-advice'
  },
  yesno: {
    keywords: ['yes', 'no', 'whether', 'if', 'can', 'will i', 'should i', 'do i'],
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

function analyzeQuestion(question: string): { layoutType: 3 | 5 | 7 | 9 | 36; spreadType?: string } {
  const lowerQuestion = question.toLowerCase()
  
  // Check for complex/comprehensive requests first
  if (QUESTION_PATTERNS.complex.keywords.some(keyword => lowerQuestion.includes(keyword))) {
    return { layoutType: 9 }
  }
  
  // Check for Grand Tableau requests
  if (lowerQuestion.includes('grand tableau') || lowerQuestion.includes('full deck') || lowerQuestion.includes('all cards')) {
    return { layoutType: 36 }
  }
  
  // Score each pattern based on keyword matches
  const scores = Object.entries(QUESTION_PATTERNS).map(([key, pattern]) => {
    const matches = pattern.keywords.filter(keyword => lowerQuestion.includes(keyword)).length
    return { key, score: matches, pattern }
  }).filter(item => item.score > 0)
  
  // Sort by score (highest first)
  scores.sort((a, b) => b.score - a.score)
  
  if (scores.length > 0) {
    const bestMatch = scores[0]
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
    const result = analyzeQuestion(question)
    
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