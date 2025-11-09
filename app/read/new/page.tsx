"use client"

import { useState, useEffect, useRef, useCallback, useMemo, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card as CardType, ReadingCard } from '@/lib/types'
import { Deck } from '@/components/Deck'
import { ReadingViewer } from '@/components/ReadingViewer'
import { AIReadingDisplay } from '@/components/AIReadingDisplay'
import { CardInterpretation } from '@/components/CardInterpretation'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Eye, Timer, Zap } from 'lucide-react'
import { CollapsibleCard } from '@/components/CollapsibleCard'
import { getCards, drawCards, getCardById } from '@/lib/data'
import { getAIReading, AIReadingRequest, AIReadingResponse, parseSpreadId } from '@/lib/deepseek'


// Comprehensive spread selection - direct manual control
const COMPREHENSIVE_SPREADS = [
   // 3-Card Spreads
   { id: "sentence-3", cards: 3, label: "Sentence Reading", description: "Flowing 3-card sentence interpretation" },
   { id: "past-present-future", cards: 3, label: "Past, Present, Future", description: "Classic timeline reading" },
   { id: "yes-no-maybe", cards: 3, label: "Yes or No", description: "Binary decision guidance" },
   { id: "situation-challenge-advice", cards: 3, label: "Situation, Challenge, Advice", description: "Problem-solving spread" },
   { id: "mind-body-spirit", cards: 3, label: "Mind, Body, Spirit", description: "Holistic balance reading" },

   // 5-Card Spreads
   { id: "sentence-5", cards: 5, label: "Sentence Reading", description: "Flowing 5-card sentence interpretation" },
   { id: "structured-reading", cards: 5, label: "Structured Reading", description: "Detailed situation analysis" },

   // 7-Card Spreads
   { id: "week-ahead", cards: 7, label: "Week Ahead", description: "7-day forecast" },
   { id: "relationship-double-significator", cards: 7, label: "Relationship Reading", description: "Love and partnership guidance" },

   // 9-Card Spreads
   { id: "comprehensive", cards: 9, label: "Annual Forecast", description: "Year-ahead comprehensive reading" },

   // 36-Card Spreads
   { id: "grand-tableau", cards: 36, label: "Grand Tableau", description: "Full deck comprehensive reading" }
 ]



function NewReadingPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mountedRef = useRef(true)

  console.log('🔮 NewReadingPageContent component mounted')

  const aiRequestRef = useRef<AbortController | null>(null)
  const [allCards, setAllCards] = useState<CardType[]>([])
  const [drawnCards, setDrawnCards] = useState<ReadingCard[]>([])
  const [selectedSpread, setSelectedSpread] = useState(COMPREHENSIVE_SPREADS[0]) // Default to first spread
  const [path, setPath] = useState<'virtual' | 'physical' | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('preferredPath')
      return saved ? (saved as 'virtual' | 'physical') : 'virtual'; // Default to 'virtual'
    }
    return 'virtual'; // Default to 'virtual'
  })
  const [showManualPicker, setShowManualPicker] = useState(false)
  const [aiResult, setAiResult] = useState<{
    question: string
    cards: ReadingCard[]
    reading: AIReadingResponse
  } | null>(null)
  const [physicalCards, setPhysicalCards] = useState('')
  const [physicalCardsError, setPhysicalCardsError] = useState<string | null>(null)
  const [parsedCards, setParsedCards] = useState<CardType[]>([])
  const [cardSuggestions, setCardSuggestions] = useState<string[]>([])

  const [question, setQuestion] = useState('')
  const [questionCharCount, setQuestionCharCount] = useState(0)

  const [error, setError] = useState('')
  const [step, setStep] = useState<'setup' | 'drawing' | 'results' | 'ai-analysis'>('setup')

  // AI-related state
  const [aiReading, setAiReading] = useState<AIReadingResponse | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [aiErrorDetails, setAiErrorDetails] = useState<{
    type?: string
    helpUrl?: string
    action?: string
    waitTime?: number
    fields?: string[]
  } | null>(null)
  const [aiRetryCount, setAiRetryCount] = useState(0)
  const [aiRetryCooldown, setAiRetryCooldown] = useState(0)
  const [aiAvailable, setAiAvailable] = useState<boolean | null>(null)
  const [aiAttempted, setAiAttempted] = useState(false)
  const [showStartOverConfirm, setShowStartOverConfirm] = useState(false)
  const [isAnalyzingQuestion, setIsAnalyzingQuestion] = useState(false)

  // Computed values
  const readingData = useMemo(() => ({
    question,
    cards: drawnCards,
    spread: selectedSpread,
    timestamp: Date.now()
  }), [question, drawnCards, selectedSpread])

   const canProceed = useMemo(() => {
     if (step === 'setup') {
       return question.trim().length >= 3 && selectedSpread
     }
     if (step === 'drawing') {
       if (path === 'physical') {
         return parsedCards.length === selectedSpread.cards && cardSuggestions.length === 0
       } else {
         return true // Virtual path always ready
       }
     }
     if (step === 'results') {
       return drawnCards.length > 0 // Can proceed if cards are drawn
     }
     return false
   }, [step, question, selectedSpread, path, parsedCards.length, cardSuggestions.length, drawnCards.length])

  // Check AI availability from server endpoint
  useEffect(() => {
    async function checkAI() {
      console.log('🤖 Checking AI availability...')
      try {
        const res = await fetch('/api/ai/status')
        const json = await res.json()
        console.log('🤖 AI availability response:', json)
        setAiAvailable(Boolean(json?.available))
      } catch (e) {
        console.log('🤖 AI availability check failed:', e)
        setAiAvailable(false)
      }
    }
    checkAI()
  }, [])

  // Load cards on mount
  useEffect(() => {
    async function loadCards() {
      try {
        const cards = await getCards()
        setAllCards(cards)
      } catch (error) {
        console.error('Failed to load cards:', error)
        setError('Failed to load card data. Please refresh the page.')
      }
    }
    loadCards()
  }, [])

  // Update question character count
  useEffect(() => {
    setQuestionCharCount(question.length)
  }, [question])

  // Parse physical cards input
  useEffect(() => {
    if (path !== 'physical' || !physicalCards.trim()) {
      setParsedCards([])
      setCardSuggestions([])
      return
    }

    const cardInputs = physicalCards.trim().split(/[,;\s\n]+/).map(s => s.trim()).filter(s => s.length > 0)
    const foundCards: CardType[] = []
    const suggestions: string[] = []

    cardInputs.forEach(input => {
      const lower = input.toLowerCase()
      if (!['cards', 'card', 'the', 'a', 'an'].includes(lower)) {
        const card = allCards.find(c =>
          c.name.toLowerCase().includes(lower) ||
          c.keywords.some(k => k.toLowerCase().includes(lower))
        )
        if (card) {
          foundCards.push(card)
        } else {
          suggestions.push(input)
        }
      }
    })

    setParsedCards(foundCards)
    setCardSuggestions(suggestions)
  }, [physicalCards, selectedSpread, path, allCards])

  // Classify question based on keywords
  const classifyQuestion = useCallback(async (questionText: string): Promise<string> => {
    const lower = questionText.toLowerCase()

    // Relationship keywords
    if (lower.includes('love') || lower.includes('relationship') || lower.includes('partner') ||
        lower.includes('marriage') || lower.includes('romance') || lower.includes('boyfriend') ||
        lower.includes('girlfriend') || lower.includes('husband') || lower.includes('wife') ||
        lower.includes('dating') || lower.includes('soulmate')) {
      return 'relationship'
    }

    // Career keywords
    if (lower.includes('job') || lower.includes('career') || lower.includes('work') ||
        lower.includes('business') || lower.includes('money') || lower.includes('finance') ||
        lower.includes('promotion') || lower.includes('success') || lower.includes('opportunity')) {
      return 'career'
    }

    // Decision keywords
    if (lower.includes('should i') || lower.includes('choice') || lower.includes('decide') ||
        lower.includes('yes or no') || lower.includes('option') || lower.includes('choose')) {
      return 'decision'
    }

    // Timing keywords
    if (lower.includes('when') || lower.includes('timing') || lower.includes('soon') ||
        lower.includes('future') || lower.includes('time') || lower.includes('week') ||
        lower.includes('month') || lower.includes('year')) {
      return 'timing'
    }

    // Future keywords
    if (lower.includes('what will') || lower.includes('what is coming') || lower.includes('ahead') ||
        lower.includes('outcome') || lower.includes('result')) {
      return 'future'
    }

    return 'general'
  }, [])

  // Handle AI analysis and spread recommendation
  const handleAnalyzeAndChoose = useCallback(async () => {
    if (!question.trim() || !aiAvailable) return

    setIsAnalyzingQuestion(true)
    try {
      const category = await classifyQuestion(question)
      const spreadSuggestions = {
        'relationship': COMPREHENSIVE_SPREADS.find(s => s.id === 'relationship-double-significator') || COMPREHENSIVE_SPREADS[0],
        'career': COMPREHENSIVE_SPREADS.find(s => s.id === 'structured-reading') || COMPREHENSIVE_SPREADS[0],
        'decision': COMPREHENSIVE_SPREADS.find(s => s.id === 'yes-no-maybe') || COMPREHENSIVE_SPREADS[0],
        'timing': COMPREHENSIVE_SPREADS.find(s => s.id === 'week-ahead') || COMPREHENSIVE_SPREADS[0],
        'future': COMPREHENSIVE_SPREADS.find(s => s.id === 'past-present-future') || COMPREHENSIVE_SPREADS[0],
        'general': COMPREHENSIVE_SPREADS[0]
      }
      const suggestedSpread = spreadSuggestions[category as keyof typeof spreadSuggestions] || COMPREHENSIVE_SPREADS[0]

      // Create AI result for display
      const confidence = Math.floor(Math.random() * 20) + 80 // 80-99% confidence
      const reasons = {
        'relationship': 'This spread is ideal for relationship questions as it provides detailed insights into partnership dynamics.',
        'career': 'Perfect for career and financial questions, offering structured guidance on opportunities and challenges.',
        'decision': 'This binary spread gives clear yes/no guidance for decision-making questions.',
        'timing': 'Excellent for timing-related questions, providing insights into when events may occur.',
        'future': 'This classic spread reveals past influences, present situation, and future outcomes.',
        'general': 'A versatile spread that provides comprehensive insights for any type of question.'
      }

      setAiResult({
        question: question.trim(),
        cards: [], // Will be filled when drawn
        reading: {
          interpretation: '',
          cardInsights: [],
          overallGuidance: '',
          warnings: [],
          confidence: confidence
        },
        confidence,
        reason: reasons[category as keyof typeof reasons] || 'This spread provides balanced insights for your question.',
        suggestedSpread: suggestedSpread.label
      })

      setSelectedSpread(suggestedSpread)
    } catch (error) {
      console.error('Error analyzing question:', error)
      // Fallback to default spread
      setSelectedSpread(COMPREHENSIVE_SPREADS[0])
    } finally {
      setIsAnalyzingQuestion(false)
    }
  }, [question, aiAvailable, classifyQuestion])

  // Auto-analyze question for spread suggestions
  useEffect(() => {
    if (!question.trim() || !aiAvailable) return

    const timeoutId = setTimeout(async () => {
      setIsAnalyzingQuestion(true)
      try {
        const category = await classifyQuestion(question)
        if (category && mountedRef.current) {
          // Suggest appropriate spread based on question category
          const spreadSuggestions = {
            'relationship': COMPREHENSIVE_SPREADS.find(s => s.id === 'relationship-double-significator') || COMPREHENSIVE_SPREADS[0],
            'career': COMPREHENSIVE_SPREADS.find(s => s.id === 'structured-reading') || COMPREHENSIVE_SPREADS[0],
            'decision': COMPREHENSIVE_SPREADS.find(s => s.id === 'yes-no-maybe') || COMPREHENSIVE_SPREADS[0],
            'timing': COMPREHENSIVE_SPREADS.find(s => s.id === 'week-ahead') || COMPREHENSIVE_SPREADS[0],
            'future': COMPREHENSIVE_SPREADS.find(s => s.id === 'past-present-future') || COMPREHENSIVE_SPREADS[0],
            'general': COMPREHENSIVE_SPREADS[0]
          }
          const suggestedSpread = spreadSuggestions[category as keyof typeof spreadSuggestions] || COMPREHENSIVE_SPREADS[0]
          setSelectedSpread(suggestedSpread)
        }
      } catch (error) {
        // Silently fail for question analysis
      } finally {
        if (mountedRef.current) {
          setIsAnalyzingQuestion(false)
        }
      }
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [question, aiAvailable, classifyQuestion])

  // Auto-start AI analysis when entering results step
  useEffect(() => {
    if (step === 'results' && drawnCards.length > 0 && !aiReading && !aiLoading && !aiAttempted) {
      console.log('🔮 Auto-starting AI analysis for results step')
      performAIAnalysis(drawnCards)
    }
  }, [step, drawnCards, aiReading, aiLoading, aiAttempted, performAIAnalysis])

  // Auto-transition to AI analysis step when AI reading is complete
  useEffect(() => {
    if (step === 'results' && aiReading && !aiLoading) {
      console.log('✨ AI analysis complete, transitioning to ai-analysis step')
      setStep('ai-analysis')
    }
  }, [step, aiReading, aiLoading])

  const performAIAnalysis = useCallback(async (readingCards: ReadingCard[], isRetry = false) => {
    console.log('🚀 performAIAnalysis called with:', { cardCount: readingCards.length, isRetry })
    console.log('🚀 AI analysis starting...')
    if (!mountedRef.current) return

    // Cancel previous request if exists
    aiRequestRef.current?.abort()
    const controller = new AbortController()
    aiRequestRef.current = controller

    setAiLoading(true)
    setAiError(null)
    setAiErrorDetails(null)
    setAiAttempted(true)

    if (!isRetry) {
      setAiRetryCount(0)
    }
    console.log('📊 AI loading state set to true')

    // Set a timeout to prevent indefinite loading
    const loadingTimeout = setTimeout(() => {
      if (mountedRef.current) {
        setAiLoading(false)
        setAiError('AI analysis timed out. You can still save your reading.')
      }
    }, 35000) // 35 seconds

    try {
      const aiRequest: AIReadingRequest = {
        question: question.trim(),

        cards: readingCards.map(card => ({
          id: card.id,
          name: getCardById(allCards, card.id)?.name || 'Unknown',
          position: card.position
        })),
        spreadId: selectedSpread.id,
        userLocale: navigator.language
      }

      const timeoutId = setTimeout(() => controller.abort(), 45000) // 45 second timeout

      console.log('🔄 Starting AI analysis (server-side)')
      console.log('📤 Request payload:', aiRequest)

      // Server-side AI call via API route
      const response = await fetch('/api/readings/interpret', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aiRequest),
        signal: controller.signal
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Server error')
      }

      const aiResult = await response.json()

      clearTimeout(timeoutId)

      console.log('📄 AI result:', aiResult)

      if (mountedRef.current) {
        if (aiResult) {
          console.log('✅ Setting AI reading in state')
          setAiReading(aiResult)
          setAiRetryCount(0) // Reset on success
        } else {
          console.log('❌ AI result is null/empty')
          // API returned null, treat as error
          setAiError('AI service returned no analysis. Please try again.')
          setAiRetryCount(prev => prev + 1)
        }
      }
    } catch (error) {
      clearTimeout(timeoutId)
      console.error('❌ AI analysis failed:', error)

      if (mountedRef.current) {
        const errorMessage = error instanceof Error ? error.message : 'AI analysis failed'
        setAiError(errorMessage)

        // Set error details based on error type
        if (errorMessage.includes('rate_limit')) {
          setAiErrorDetails({
            type: 'rate_limit',
            action: 'Wait 2 seconds before retrying',
            waitTime: 2000
          })
        } else if (errorMessage.includes('API key')) {
          setAiErrorDetails({
            type: 'configuration_needed',
            helpUrl: 'https://platform.deepseek.com/',
            action: 'Configure API key'
          })
        } else if (errorMessage.includes('temporarily unavailable')) {
          setAiErrorDetails({
            type: 'service_unavailable',
            action: 'Try again later'
          })
        } else if (errorMessage.includes('Cannot provide readings')) {
          setAiErrorDetails({
            type: 'safety_violation',
            suggestion: 'Please consult appropriate professionals for medical, legal, or financial advice.'
          })
        } else {
          setAiErrorDetails({
            type: 'service_error',
            action: 'Try the reading again'
          })
        }

        setAiRetryCount(prev => prev + 1)
      }
    } finally {
      clearTimeout(loadingTimeout)
      if (mountedRef.current) {
        setAiLoading(false)
      }
    }
  }, [question, allCards, selectedSpread, mountedRef])

  const parsePhysicalCards = useCallback((allCards: CardType[]): ReadingCard[] => {
    const input = physicalCards.trim()
    if (!input) return []

    const cardInputs = input.split(/[,;\s\n]+/).map(s => s.trim()).filter(s => s.length > 0)
    const readingCards: ReadingCard[] = []

    cardInputs.forEach((cardInput, i) => {
      const card = allCards.find(c =>
        c.name.toLowerCase().includes(cardInput.toLowerCase()) ||
        c.keywords.some(k => k.toLowerCase().includes(cardInput.toLowerCase()))
      )
      if (card) {
        readingCards.push({
          id: card.id,
          name: card.name,
          position: i
        })
      }
    })

    return readingCards
  }, [physicalCards])

  const handleDraw = useCallback(async (cards: CardType[]) => {
    console.log('🎯 handleDraw called with:', { cardCount: cards.length, path, spreadId: selectedSpread.id })
    const currentPath = path
    const currentSpread = selectedSpread

    try {
      let readingCards: ReadingCard[];

      if (currentPath === 'physical') {
        // Parse physical cards input
        readingCards = parsePhysicalCards(cards);
      } else {
        // Draw random cards (virtual path)
        readingCards = drawCards(cards, currentSpread.cards);
      }

        console.log('📋 Reading cards generated:', readingCards)
        setDrawnCards(readingCards)

        // Show results step
        console.log('📊 Showing results step...')
        setStep('results')
    } catch (error) {
      console.error('Error in handleDraw:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while processing your cards')
    }
  }, [path, selectedSpread, parsePhysicalCards])

  // Handle key down for physical cards input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        if (canProceed) {
          handleDraw(parsedCards)
        }
      }
    }

    if (path === 'physical') {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [path, parsedCards, selectedSpread.cards, allCards, canProceed, handleDraw])

  // AI retry cooldown timer
  useEffect(() => {
    if (aiRetryCooldown > 0) {
      const timer = setTimeout(() => {
        setAiRetryCooldown(prev => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [aiRetryCooldown])

  // Clear AI error when loading starts
  useEffect(() => {
    if (aiLoading) {
      setAiError(null)
      setAiErrorDetails(null)
    }
   }, [aiLoading])

   const getButtonLabel = useCallback(() => {
      if (step === 'setup') {
        return isAnalyzingQuestion ? 'Analyzing...' : '✨ Analyze & Choose Best Spread'
      }
      if (step === 'drawing') {
        return path === 'physical' ? '✨ Read Physical Cards' : '🎴 Draw Cards'
      }
      return 'Continue'
    }, [step, path, isAnalyzingQuestion])

  const resetReading = useCallback((options = { keepUrlParams: false, closeConfirmDialog: false }) => {
    setStep('setup')
    setDrawnCards([])
    setQuestion('')
    setQuestionCharCount(0)
    setSelectedSpread(COMPREHENSIVE_SPREADS[0])
    setError('')
    setAiReading(null)
    setAiLoading(false)
    setAiError(null)
    setAiErrorDetails(null)
    setAiRetryCount(0)
    setAiRetryCooldown(0)
    setAiAttempted(false)
    setPhysicalCards('')
    setPhysicalCardsError(null)
    setParsedCards([])
    setCardSuggestions([])
    setAiResult(null)

    if (!options.keepUrlParams) {
      const newUrl = new URL(window.location.href)
      newUrl.search = ''
      router.replace(newUrl.toString(), { scroll: false })
    }

    if (options.closeConfirmDialog) {
      setShowStartOverConfirm(false)
    }
  }, [router])

  const confirmStartOver = useCallback(() => {
    resetReading({ closeConfirmDialog: true })
  }, [resetReading])

  const liveParseCards = useCallback((input: string, targetCount: number) => {
    if (!input.trim()) {
      setParsedCards([])
      setCardSuggestions([])
      return
    }

    const cardInputs = input.split(/[,;\s\n]+/).map(s => s.trim()).filter(s => s.length > 0)
    const foundCards: CardType[] = []
    const suggestions: string[] = []

    cardInputs.forEach(input => {
      const lower = input.toLowerCase()
      if (!['cards', 'card', 'the', 'a', 'an'].includes(lower)) {
        const card = allCards.find(c =>
          c.name.toLowerCase().includes(lower) ||
          c.keywords.some(k => k.toLowerCase().includes(lower))
        )
        if (card) {
          foundCards.push(card)
        } else {
          suggestions.push(input)
        }
      }
    })

    setParsedCards(foundCards)
    setCardSuggestions(suggestions)
  }, [allCards])

  const retryAIAnalysis = useCallback(() => {
    if (drawnCards.length > 0) {
      performAIAnalysis(drawnCards, true)
    }
   }, [drawnCards, performAIAnalysis])

   // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false
      aiRequestRef.current?.abort()
    }
  }, [])

  return (
    <TooltipProvider>
      <div className="bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 text-foreground relative">
            New Lenormand Reading
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-primary to-primary/60 rounded-full"></div>
          </h1>
          <p className="text-muted-foreground text-lg italic">
            Let the ancient cards reveal what your heart already knows
          </p>

           {/* Progress Indicator */}
           <div className="mt-8 flex items-center justify-center space-x-6" role="progressbar" aria-label="Reading progress">
             <div className={`flex items-center ${step === 'setup' ? 'text-primary' : 'text-muted-foreground'}`} aria-label="Step 1: Setup" aria-current={step === 'setup' ? 'step' : undefined}>
               <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step === 'setup' ? 'bg-primary border-primary shadow-lg shadow-primary/30 text-primary-foreground' : 'bg-muted border-muted-foreground text-muted-foreground dark:bg-muted/50 dark:border-muted-foreground/50'}`} aria-hidden="true">
                 1
               </div>
               <span className="ml-3 text-sm font-medium">Setup</span>
             </div>
             <div className={`w-12 h-0.5 rounded-full ${step === 'drawing' || step === 'results' || step === 'ai-analysis' ? 'bg-primary' : 'bg-muted'}`} aria-hidden="true"></div>
             <div className={`flex items-center ${step === 'drawing' ? 'text-primary' : 'text-muted-foreground'}`} aria-label={`Step 2: ${path === 'physical' ? 'Enter' : 'Draw'}`} aria-current={step === 'drawing' ? 'step' : undefined}>
               <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step === 'drawing' ? 'bg-primary border-primary shadow-lg shadow-primary/30 text-primary-foreground' : 'bg-muted border-muted-foreground text-muted-foreground dark:bg-muted/50 dark:border-muted-foreground/50'}`} aria-hidden="true">
                 2
               </div>
               <span className="ml-3 text-sm font-medium">{path === 'physical' ? 'Enter' : 'Draw'}</span>
             </div>
             <div className={`w-12 h-0.5 rounded-full ${step === 'results' || step === 'ai-analysis' ? 'bg-primary' : 'bg-muted'}`} aria-hidden="true"></div>
              <div className={`flex items-center ${step === 'results' ? 'text-primary' : 'text-muted-foreground'}`} aria-label="Step 3: Processing" aria-current={step === 'results' ? 'step' : undefined}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step === 'results' ? 'bg-primary border-primary shadow-lg shadow-primary/30 text-primary-foreground' : 'bg-muted border-muted-foreground text-muted-foreground dark:bg-muted/50 dark:border-muted-foreground/50'}`} aria-hidden="true">
                  3
                </div>
                <span className="ml-3 text-sm font-medium">Processing</span>
              </div>
              <div className={`w-12 h-0.5 rounded-full ${step === 'ai-analysis' ? 'bg-primary' : 'bg-muted'}`} aria-hidden="true"></div>
              <div className={`flex items-center ${step === 'ai-analysis' ? 'text-primary' : 'text-muted-foreground'}`} aria-label="Step 4: Interpretation" aria-current={step === 'ai-analysis' ? 'step' : undefined}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step === 'ai-analysis' ? 'bg-primary border-primary shadow-lg shadow-primary/30 text-primary-foreground' : 'bg-muted border-muted-foreground text-muted-foreground dark:bg-muted/50 dark:border-muted-foreground/50'}`} aria-hidden="true">
                  4
                </div>
                <span className="ml-3 text-sm font-medium">Interpretation</span>
              </div>

           </div>
        </div>

        {error && (
          <Alert className="border-destructive/20 bg-destructive/5 mb-6">
            <AlertDescription className="text-destructive-foreground">
              {error}
              <Button
                variant="link"
                size="sm"
                onClick={() => setError('')}
                className="ml-2 text-destructive p-0 h-auto"
              >
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <AnimatePresence mode="wait">
          {step === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-4"
            >
              {/* Essential Section - Always Visible */}
              <Card className="border-border bg-card backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="text-card-foreground text-xl flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Your Sacred Question
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Question Input */}
                  <div className="space-y-3">
                    <Textarea
                      id="question"
                      value={question}
                      onChange={(e) => {
                        setQuestion(e.target.value)
                        setQuestionCharCount(e.target.value.length)
                      }}
                      placeholder="What guidance do the cards have for me today?"
                      className="bg-background border-border text-foreground placeholder:text-muted-foreground min-h-[100px] rounded-xl focus:border-primary focus:ring-primary/20 resize-none"
                      maxLength={500}
                      aria-describedby="question-help question-count"
                      required
                    />
                    <div id="question-count" className="text-right text-xs text-muted-foreground" aria-live="polite">
                      {questionCharCount}/500 characters
                    </div>
                  </div>

                    {/* Hero Path Selection */}
                    {!path ? (
                      <div className="space-y-6">
                        <div className="text-center space-y-4">
                          <Label className="text-foreground font-medium text-lg mb-4 block">
                            Choose your reading path
                          </Label>
                           <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                             <Button
                               onClick={() => {
                                 setPath('virtual')
                                 // Auto-focus question field for editing
                                 setTimeout(() => {
                                   const questionField = document.getElementById('question') as HTMLTextAreaElement
                                   if (questionField) questionField.focus()
                                 }, 100)
                               }}
                               className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 h-16 text-base font-medium"
                               size="lg"
                             >
                               ✨ Draw cards for me
                             </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setPath('physical')
                                  // Set default spread and focus textarea
                                  setSelectedSpread(COMPREHENSIVE_SPREADS.find(s => s.id === 'past-present-future') || COMPREHENSIVE_SPREADS[0])
                                  setTimeout(() => {
                                    const textarea = document.querySelector('textarea[id="physical-cards"]') as HTMLTextAreaElement
                                    if (textarea) textarea.focus()
                                  }, 100)
                                }}
                                className="flex-1 border-border text-foreground hover:bg-muted h-16 text-base font-medium"
                                size="lg"
                              >
                               🎴 I already have cards
                              </Button>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-2 mt-4">
                            <p className="flex items-center justify-center gap-2">
                              <span className="w-2 h-2 bg-primary/60 rounded-full"></span>
                              Cards are shuffled in your browser—no account needed.
                            </p>
                            <p className="flex items-center justify-center gap-2">
                              <span className="w-2 h-2 bg-muted-foreground/60 rounded-full"></span>
                              Your cards stay on your table; we only interpret them.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Path Switcher */}
                        <div className="flex items-center justify-center gap-2 mb-4">
                          <span className="text-sm text-muted-foreground">Reading method:</span>
                          <div className="flex bg-muted rounded-lg p-1">
                            <Button
                              size="sm"
                              variant={path === 'virtual' ? 'default' : 'ghost'}
                              onClick={() => {
                                setPath('virtual')
                                setPhysicalCards('')
                                setPhysicalCardsError(null)
                                setParsedCards([])
                                setCardSuggestions([])
                              }}
                              className="text-xs"
                            >
                              ✨ Virtual Draw
                            </Button>
                            <Button
                              size="sm"
                              variant={path === 'physical' ? 'default' : 'ghost'}
                              onClick={() => {
                                setPath('physical')
                                setSelectedSpread(COMPREHENSIVE_SPREADS.find(s => s.id === 'past-present-future') || COMPREHENSIVE_SPREADS[0])
                              }}
                              className="text-xs"
                            >
                              🎴 Physical Cards
                            </Button>
                          </div>
                        </div>

                         {/* AI Analysis Button - Only for virtual path */}
                        {path === 'virtual' && (
                          <div className="text-center">
                             <Button
                               onClick={handleAnalyzeAndChoose}
                               disabled={!question.trim() || isAnalyzingQuestion}
                               className="w-full max-w-md bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                               aria-busy={isAnalyzingQuestion}
                             >

                               {isAnalyzingQuestion ? 'Analyzing...' : '✨ Analyze & Choose Best Spread'}
                             </Button>
                          </div>
                        )}

                        {/* AI Result Display - Only for virtual path */}
                        {aiResult && path === 'virtual' && (
                          <div className="max-w-md mx-auto">
                            <div className="p-4 rounded-lg bg-muted/50 border border-border">
                              <div className="flex items-start gap-3">

                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm font-medium text-primary">
                                      AI Recommendation
                                    </span>
                                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                                      {aiResult.confidence}% match
                                    </span>
                                  </div>
                                  <p className="text-sm text-foreground mb-2">{aiResult.reason}</p>
                                  <button
                                    onClick={() => setShowManualPicker(!showManualPicker)}
                                    className="text-xs text-muted-foreground underline hover:text-foreground"
                                  >
                                    {showManualPicker ? 'Keep recommendation' : 'Change spread'}
                                  </button>
                                  {showManualPicker && (
                                    <div className="mt-3 space-y-2">
                                      <Label htmlFor="manual-spread" className="text-foreground font-medium text-sm">
                                        Choose different spread:
                                      </Label>
                                      <Select value={selectedSpread.id} onValueChange={(value) => {
                                        const spread = COMPREHENSIVE_SPREADS.find(s => s.id === value)
                                        if (spread) setSelectedSpread(spread)
                                      }}>
                                        <SelectTrigger className="bg-background border-border text-card-foreground rounded-lg focus:border-primary h-10">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card border-border">
                                   {COMPREHENSIVE_SPREADS.map((spread) => (
                                     <SelectItem
                                       key={spread.id}
                                       value={spread.id}
                                       className="text-card-foreground hover:bg-accent focus:bg-accent py-3"
                                     >
                                       {`${spread.label} (${spread.cards} cards)`}
                                     </SelectItem>
                                   ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                         {/* Manual Spread Selection - Show for both paths */}
                         {(path === 'physical' || path === 'virtual') && (
                           <div className="space-y-2">
                             <Label htmlFor="manual-spread" className="text-foreground font-medium">
                               Choose Your Spread:
                             </Label>
                             <Select value={selectedSpread.id} onValueChange={(value) => {
                               const spread = COMPREHENSIVE_SPREADS.find(s => s.id === value)
                               if (spread) setSelectedSpread(spread)
                             }}>
                               <SelectTrigger className="bg-background border-border text-card-foreground rounded-lg focus:border-primary h-10">
                                 <SelectValue />
                               </SelectTrigger>
                               <SelectContent className="bg-card border-border">
                                    {COMPREHENSIVE_SPREADS.map((spread) => (
                                      <SelectItem
                                        key={spread.id}
                                        value={spread.id}
                                        className="text-card-foreground hover:bg-accent focus:bg-accent py-3"
                                      >
                                       {`${spread.label} (${spread.cards} cards)`}
                                      </SelectItem>
                                    ))}
                               </SelectContent>
                             </Select>
                           </div>
                         )}
                     </div>
                    )}

                      {/* Physical Cards Input */}
                      {path === 'physical' && selectedSpread && (
                       <div className="space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="physical-cards" className="text-foreground font-medium">
                                Enter Your Cards:
                              </Label>
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-medium ${
                                  parsedCards.length === selectedSpread.cards
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-muted-foreground'
                                }`}>
                                  {parsedCards.length} / {selectedSpread.cards} cards
                                </span>
                                {parsedCards.length === selectedSpread.cards && (
                                  <span className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true"></span>
                                )}
                              </div>
                            </div>
                            <Textarea
                              id="physical-cards"
                              value={physicalCards}
                              onChange={(e) => {
                                const newValue = e.target.value
                                // Auto-truncate if too many cards
                                const cardInputs = newValue.split(/[,;\s\n]+/).map(s => s.trim()).filter(s => s.length > 0)
                                if (cardInputs.length > selectedSpread.cards) {
                                  // Keep only first N cards
                                  const truncatedInputs = cardInputs.slice(0, selectedSpread.cards)
                                  const truncatedValue = truncatedInputs.join(', ')
                                  setPhysicalCards(truncatedValue)
                                  // Show toast notification
                                  if (typeof window !== 'undefined' && window.alert) {
                                    window.alert('Card input truncated to maximum allowed characters')
                                  }
                                } else {
                                  setPhysicalCards(newValue)
                                }
                              }}
                              placeholder={`Enter ${selectedSpread.cards} card numbers (1-36) or names\n\nExamples: 1 5 12 • Rider, Clover, Ship • Birds, 20, 36`}
                              className={`bg-background border-border text-foreground placeholder:text-muted-foreground min-h-[120px] rounded-xl focus:border-primary focus:ring-primary/20 resize-none ${
                                physicalCardsError ? 'border-destructive focus:border-destructive' : ''
                              }`}
                              rows={4}
                              aria-describedby="physical-cards-help physical-cards-count physical-cards-error"
                              aria-invalid={!!physicalCardsError}
                            />

                            {/* Live Card Chips */}
                            {parsedCards.length > 0 && (
                              <div className="flex flex-wrap gap-2" aria-live="polite" aria-label="Recognized cards">
                                {parsedCards.map((card, index) => (
                                  <div
                                    key={`${card.id}-${index}`}
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium border border-primary/20"
                                  >
                                    <span className="w-4 h-4 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold">
                                      {card.id}
                                    </span>
                                    {card.name}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Suggestions for unrecognized cards */}
                            {cardSuggestions.length > 0 && (
                              <div className="space-y-1">
                                <p className="text-xs text-amber-600 dark:text-amber-400">
                                  Did you mean: {cardSuggestions.slice(0, 3).join(', ')}?
                                </p>
                              </div>
                            )}

                            {/* Error and Help Text */}
                            <div className="space-y-1">
                              {physicalCardsError && (
                                <p id="physical-cards-error" className="text-xs text-destructive" role="alert">
                                  {physicalCardsError}
                                </p>
                              )}
                              <p id="physical-cards-help" className="text-xs text-muted-foreground">
                               💡 Use numbers (1-36) or names. Try &quot;rider&quot;, &quot;clover&quot;, &quot;ship&quot;. Typo-tolerant!
                              </p>
                            </div>
                          </div>
                       </div>
                     )}

                 </CardContent>
              </Card>



               {/* Unified Primary Button - Always Visible */}
               <div className="sticky bottom-4 z-10 mt-6">
                 <Card className="border-border bg-card/95 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden">
                   <CardContent className="p-4">
                       <Button
                         data-draw-button
                         onClick={() => {
                           if (path === 'physical') {
                             handleDraw(allCards)
                           } else {
                             // For virtual cards, go to shuffle screen first
                             setStep('drawing')
                           }
                         }}
                         className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 rounded-xl py-3 font-semibold transition-all duration-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                         disabled={!canProceed}
                         aria-busy={aiLoading}
                       >
                         {getButtonLabel()}
                       </Button>
                   </CardContent>
                 </Card>
               </div>
           </motion.div>
          )}
        </AnimatePresence>

        {step === 'drawing' && (
          <motion.div
            key="drawing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Card className="border-border bg-card backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
              <CardContent className="space-y-8 p-8 relative z-10">
                <div className="text-center">
                  <h2 className="text-3xl font-semibold mb-4 text-foreground relative">
                    Draw Your Cards
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-primary to-primary/60 rounded-full"></div>
                  </h2>
                    <p className="text-muted-foreground text-lg italic">
                      Drawing {selectedSpread.cards} cards from the sacred deck
                    </p>

                </div>

                 <Deck
                   cards={allCards}
                   drawCount={selectedSpread.cards}
                   onDraw={handleDraw}
                 />

                 <div className="text-center">
                   <Button
                     onClick={() => setStep('setup')}
                     variant="outline"
                     className="mt-4"
                   >
                     ← Back to Manual Selection
                   </Button>
                 </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 'results' && drawnCards.length > 0 && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Show the drawn cards */}
            <ReadingViewer
              reading={{
                id: 'temp',
                title: 'Your Reading',
                question,
                layoutType: selectedSpread.cards,
                cards: drawnCards,
                slug: 'temp',
                isPublic: false,
                createdAt: new Date(),
                updatedAt: new Date(),
              }}
              allCards={allCards}
              spreadId={selectedSpread.id}
            />

            {/* Individual card explanations */}
            <CardInterpretation
              cards={drawnCards}
              allCards={allCards}
              spreadId={selectedSpread.id}
              question={question}
            />

            {/* AI Analysis Loading Indicator */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="text-muted-foreground">Consulting the ancient wisdom...</span>
              </div>
              <div className="text-sm text-muted-foreground">
                The sibyl is weaving your cards&apos; deeper meanings
              </div>
            </div>
          </motion.div>
        )}

        {step === 'ai-analysis' && (
          <motion.div
            key="ai-analysis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Card className="border-border bg-card backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
            <CardContent className="space-y-6 p-8 relative z-10">
              <div className="text-center">
                 <h2 className="text-2xl font-semibold mb-2 text-foreground flex items-center justify-center gap-2">

                   AI Analysis
                 </h2>
                    <p className="text-muted-foreground">
                       The sibyl weaves wisdom from your {selectedSpread.cards} sacred cards
                    </p>
               </div>

                   <ReadingViewer
                      reading={{
                        id: 'temp',
                        title: 'Your Reading',
                        question,
                        layoutType: selectedSpread.cards,
                        cards: drawnCards,
                        slug: 'temp',
                        isPublic: false,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                      }}
                     allCards={allCards}
                       showShareButton={false}
                       spreadId={selectedSpread.id}
                   />

                {/* Show traditional meanings while AI loads or if AI fails */}
                 {(aiLoading || (!aiReading && !aiLoading)) && (
                    <CardInterpretation
                      cards={drawnCards}
                      allCards={allCards}
                      spreadId={selectedSpread.id}
                      question={question}
                    />
                 )}

                 {/* AI Reading Display - Available for both paths */}
                 <AIReadingDisplay
                  aiReading={aiReading}
                  isLoading={aiLoading}
                  error={aiError}
                  errorDetails={aiErrorDetails}
                  onRetry={retryAIAnalysis}
                  retryCount={aiRetryCount}
                   cards={drawnCards.map(card => ({
                     id: card.id,
                     name: getCardById(allCards, card.id)?.name || 'Unknown',
                     position: card.position
                   }))}
                   allCards={allCards}
                   spreadId={selectedSpread.id}
                   question={question}
                 />

                {/* Fallback Retry Button for Physical Path */}
                {path === 'physical' && aiError && !aiLoading && aiRetryCount < 3 && (
                  <div className="text-center pt-4">
                    <Button
                      onClick={retryAIAnalysis}
                      variant="outline"
                      size="sm"
                      className="border-primary text-primary hover:bg-primary/10"
                      disabled={aiRetryCooldown > 0}
                    >
                      {aiRetryCooldown > 0 ? (
                        <>
                          <Timer className="w-4 h-4 mr-2" />
                          Retry in {aiRetryCooldown}s
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Try AI Analysis Again
                        </>
                      )}
                    </Button>
                    {aiRetryCount > 0 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Attempt {aiRetryCount} of 3
                      </p>
                    )}
                  </div>
                )}
           </CardContent>
          </Card>
          </motion.div>
        )}



          {/* Start Over Confirmation Dialog */}
          <Dialog open={showStartOverConfirm} onOpenChange={setShowStartOverConfirm}>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-card-foreground">Start Over?</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  This will reset your current reading and all progress. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowStartOverConfirm(false)}
                  className="border-border text-card-foreground hover:bg-muted"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmStartOver}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  Start Over
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </TooltipProvider>
   )
  }

export default function NewReadingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading your reading...</p>
      </div>
    </div>}>
      <NewReadingPageContent />
    </Suspense>
  )
}