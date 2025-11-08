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
  const [step, setStep] = useState<'setup' | 'drawing' | 'ai-analysis'>('setup')

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
    return false
  }, [step, question, selectedSpread, path, parsedCards.length, cardSuggestions.length])

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
  }, [question, aiAvailable])

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
    console.log('🎯 About to call performAIAnalysis')
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

      // Start AI analysis (API route handles availability)
      console.log('🤖 Starting AI analysis step...')
      setStep('ai-analysis')
      await performAIAnalysis(readingCards)
    } catch (error) {
      console.error('Error in handleDraw:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while processing your cards')
    }
  }, [path, selectedSpread, performAIAnalysis, parsePhysicalCards])

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
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">

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