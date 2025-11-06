"use client"

import { useState, useEffect, Suspense } from 'react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Sparkles, Dice1, Settings, Shuffle, Eye } from 'lucide-react'
import { CollapsibleCard } from '@/components/CollapsibleCard'
import { getCards, drawCards, getCardById } from '@/lib/data'
import { getAIReading, AIReadingRequest, AIReadingResponse, isDeepSeekAvailable } from '@/lib/deepseek'


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
  const searchParams = useSearchParams()
  const router = useRouter()
  const [allCards, setAllCards] = useState<CardType[]>([])
  const [drawnCards, setDrawnCards] = useState<ReadingCard[]>([])
  const [selectedSpread, setSelectedSpread] = useState(COMPREHENSIVE_SPREADS[0]) // Default to first spread
  const [path, setPath] = useState<'virtual' | null>(null)
  const [showManualPicker, setShowManualPicker] = useState(false)
  const [aiResult, setAiResult] = useState<{
    spreadId: string;
    reason: string;
    confidence: number;
  } | null>(null)

  const [question, setQuestion] = useState('')
  const [questionCharCount, setQuestionCharCount] = useState(0)



  const [error, setError] = useState('')
  const [step, setStep] = useState<'setup' | 'drawing' | 'ai-analysis'>('setup')

  // Optimization results
  const [optimizationResult, setOptimizationResult] = useState<{
    confidence?: number
    reason?: string
    ambiguous?: boolean
    focus?: string
  } | null>(null)

  // Load from URL params or localStorage on mount
  useEffect(() => {
    const urlQuestion = searchParams.get('q')
    const urlSpreadId = searchParams.get('s')

    if (urlQuestion || urlSpreadId) {
      // Load from URL params
      if (urlQuestion) setQuestion(urlQuestion)
      if (urlSpreadId) {
        const spread = COMPREHENSIVE_SPREADS.find(s => s.id === urlSpreadId)
        if (spread) setSelectedSpread(spread)
      }
    } else {
      // Fallback to localStorage
      const lastOptimised = localStorage.getItem('lastOptimised')
      if (lastOptimised) {
        try {
          const data = JSON.parse(lastOptimised)
          setQuestion(data.question || '')
          if (data.spreadId) {
            const spread = COMPREHENSIVE_SPREADS.find(s => s.id === data.spreadId)
            if (spread) setSelectedSpread(spread)
          } else if (data.layoutType && data.spreadType) {
            // Legacy format - convert to new format
            const spread = COMPREHENSIVE_SPREADS.find(s =>
              s.cards === data.layoutType &&
              (s.id === data.spreadType || s.id.includes(data.spreadType))
            )
            if (spread) setSelectedSpread(spread)
          }
          setOptimizationResult(data.optimizationResult || null)
        } catch (e) {
          // Ignore invalid data
        }
      }
    }
  }, [searchParams])

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
  const [showStartOverConfirm, setShowStartOverConfirm] = useState(false)
  const [isAnalyzingQuestion, setIsAnalyzingQuestion] = useState(false)


   const resetReading = () => {
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
        setPath(null)
        setShowManualPicker(false)
        setAiResult(null)
    }

  useEffect(() => {
    fetchCards()
    resetReading()
  }, [])

   useEffect(() => {
     if (searchParams.get('reset')) {
       resetReading()
     }
   }, [searchParams])

    // Clear AI result when question changes
    useEffect(() => {
      setAiResult(null)
      setShowManualPicker(false)
    }, [question])

  const fetchCards = async () => {
    try {
      const cards = await getCards()
      setAllCards(cards)
    } catch (error) {
      console.error('Error fetching cards:', error)
      setError('Failed to load cards')
    }
  }



   const handleDraw = async (cards: CardType[]) => {
     try {
       // Draw random cards (virtual path only)
       const readingCards = drawCards(cards, selectedSpread.cards)

       setDrawnCards(readingCards)

       // Start AI analysis (API route handles availability)
       setStep('ai-analysis')
       await performAIAnalysis(readingCards)
     } catch (error) {
       console.error('Error in handleDraw:', error)
       setError(error instanceof Error ? error.message : 'An error occurred while processing your cards')
     }
   }

  const performAIAnalysis = async (readingCards: ReadingCard[], isRetry = false) => {
    setAiLoading(true)
    setAiError(null)
    setAiErrorDetails(null)

    if (!isRetry) {
      setAiRetryCount(0)
    }

    // Set a timeout to prevent indefinite loading
    const loadingTimeout = setTimeout(() => {
      console.log('AI loading timeout reached')
      setAiLoading(false)
      setAiError('AI analysis timed out. You can still save your reading.')
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

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 45000) // 45 second timeout

      const response = await fetch('/api/readings/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiRequest),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json()
        // Set detailed error information for better user guidance
        setAiErrorDetails({
          type: errorData.type,
          helpUrl: errorData.helpUrl,
          action: errorData.action,
          waitTime: errorData.waitTime,
          fields: errorData.fields
        })
        throw new Error(errorData.error || 'AI analysis failed')
      }

      const aiResult = await response.json()
      setAiReading(aiResult)
      setAiRetryCount(0) // Reset on success
    } catch (error) {
      console.error('AI analysis error:', error)
      let errorMessage = 'AI analysis failed'

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'AI analysis is taking longer than expected. The service may be busy - please try again in a moment.'
        } else {
          errorMessage = error.message
        }
      }

      setAiError(errorMessage)
      setAiRetryCount(prev => prev + 1)
    } finally {
      clearTimeout(loadingTimeout)
      setAiLoading(false)
    }
  }

  const retryAIAnalysis = () => {
    if (drawnCards.length > 0) {
      performAIAnalysis(drawnCards, true)
    }
  }


  const handleStartOver = () => {
    setShowStartOverConfirm(true)
  }

  const confirmStartOver = () => {
     setDrawnCards([])
     setStep('setup')
     setQuestion('')
     setQuestionCharCount(0)

      setSelectedSpread(COMPREHENSIVE_SPREADS[0])
     setError('')
     setAiReading(null)
     setAiLoading(false)
     setAiError(null)
     setAiErrorDetails(null)
     setShowStartOverConfirm(false)
    }

  const handleAnalyzeAndChoose = async () => {
    if (!question.trim()) {
      setError('Please enter a question first')
      return
    }

    setIsAnalyzingQuestion(true)
    setError('')

    try {
      const response = await fetch('/api/optimize-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim() })
      })

      if (!response.ok) {
        throw new Error('Failed to analyze question')
      }

      const { spreadId, confidence, reason, ambiguous, focus } = await response.json()

      // Apply the optimized settings
      const spread = COMPREHENSIVE_SPREADS.find(s => s.id === spreadId)
      if (spread) {
        setSelectedSpread(spread)
      }

      // Store optimization metadata
      setOptimizationResult({ confidence, reason, ambiguous, focus })

      // Set AI result for inline display
      setAiResult({
        spreadId: spreadId,
        reason: reason,
        confidence: confidence || 85
      })

      // Update URL for shareable link
      const params = new URLSearchParams()
      params.set('q', question)
      params.set('s', spreadId)
      router.replace(`/read/new?${params.toString()}`, { scroll: false })

    } catch (error) {
      console.error('Error analyzing question:', error)
      setError('Failed to analyze question. Please try again.')
    } finally {
      setIsAnalyzingQuestion(false)
    }
  }

  const getButtonLabel = () => {
    if (!question.trim()) return "Draw & Interpret";
    if (aiResult) return `Draw ${selectedSpread.cards}-Card Spread & Interpret`;
    return "Draw & Interpret";
  }

  const canProceed = question.trim() && path === 'virtual';



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
          <div className="mt-8 flex items-center justify-center space-x-6">
            <div className={`flex items-center ${step === 'setup' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step === 'setup' ? 'bg-primary border-primary shadow-lg shadow-primary/30 text-primary-foreground' : 'bg-muted border-muted-foreground text-muted-foreground dark:bg-muted/50 dark:border-muted-foreground/50'}`}>
                1
              </div>
              <span className="ml-3 text-sm font-medium">Setup</span>
            </div>
            <div className={`w-12 h-0.5 rounded-full ${step === 'drawing' || step === 'ai-analysis' ? 'bg-primary' : 'bg-muted'}`}></div>
            <div className={`flex items-center ${step === 'drawing' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step === 'drawing' ? 'bg-primary border-primary shadow-lg shadow-primary/30 text-primary-foreground' : 'bg-muted border-muted-foreground text-muted-foreground dark:bg-muted/50 dark:border-muted-foreground/50'}`}>
                2
              </div>
              <span className="ml-3 text-sm font-medium">Draw</span>
            </div>
            <div className={`w-12 h-0.5 rounded-full ${step === 'ai-analysis' ? 'bg-primary' : 'bg-muted'}`}></div>
            <div className={`flex items-center ${step === 'ai-analysis' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step === 'ai-analysis' ? 'bg-primary border-primary shadow-lg shadow-primary/30 text-primary-foreground' : 'bg-muted border-muted-foreground text-muted-foreground dark:bg-muted/50 dark:border-muted-foreground/50'}`}>
                3
              </div>
              <span className="ml-3 text-sm font-medium">Analyze</span>
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

                   {/* Simple Path Selection */}
                   {!path ? (
                     <div className="space-y-4">
                       <div className="text-center">
                         <Label className="text-foreground font-medium text-lg mb-4 block">
                           Do you already have cards drawn?
                         </Label>
                         <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                           <Button
                             onClick={() => setPath('virtual')}
                             className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30"
                           >
                             No, draw for me
                           </Button>
                           <Button
                             variant="outline"
                             onClick={() => router.push('/read/physical')}
                             className="flex-1 border-border text-foreground hover:bg-muted"
                           >
                             Yes, I have cards
                           </Button>
                         </div>
                       </div>
                     </div>
                   ) : (
                     <div className="space-y-4">
                       {/* AI Analysis Button */}
                       <div className="text-center">
                         <Button
                           onClick={handleAnalyzeAndChoose}
                           disabled={!question.trim() || isAnalyzingQuestion}
                           className="w-full max-w-md bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                         >
                           <Sparkles className={`w-4 h-4 mr-2 ${isAnalyzingQuestion ? 'animate-spin' : ''}`} />
                           {isAnalyzingQuestion ? 'Analyzing...' : '✨ Analyze & Choose Best Spread'}
                         </Button>
                       </div>

                       {/* AI Result Display */}
                       {aiResult && (
                         <div className="max-w-md mx-auto">
                           <div className="p-4 rounded-lg bg-muted/50 border border-border">
                             <div className="flex items-start gap-3">
                               <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
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
                                           <SelectItem key={spread.id} value={spread.id} className="text-card-foreground hover:bg-accent focus:bg-accent">
                                             <div className="flex flex-col">
                                               <span className="font-medium">{spread.label}</span>
                                               <span className="text-xs text-muted-foreground">{spread.description} ({spread.cards} cards)</span>
                                             </div>
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
                     </div>
                   )}

                   {/* Physical Cards Escape Hatch */}
                   <div className="pt-4 border-t border-border text-center">
                     <p className="text-xs text-muted-foreground">
                       Already have cards?{" "}
                       <button 
                         onClick={() => router.push('/read/physical')}
                         className="text-primary underline hover:text-primary/80"
                       >
                         Interpret your draw
                       </button>
                     </p>
                   </div>
                </CardContent>
              </Card>





              {/* Advanced Options - Collapsible */}
              {optimizationResult && (
                <CollapsibleCard
                  title="Reading Insights"
                  icon={<Sparkles className="w-4 h-4" />}
                  defaultOpen={false}
                  className="border-muted/50"
                >
                  <div className="space-y-3">
                    {optimizationResult.ambiguous && (
                      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                        <span className="text-sm font-medium">⚠️ Heads-up:</span>
                        <span className="text-sm">This question mixes multiple themes—consider narrowing it down or doing separate readings.</span>
                      </div>
                    )}

                    {optimizationResult.confidence !== undefined && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">AI match confidence</span>
                          <span className="font-medium">{optimizationResult.confidence}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${optimizationResult.confidence}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {optimizationResult.reason && (
                      <p className="text-xs text-muted-foreground italic">
                        {optimizationResult.reason}
                      </p>
                    )}
                  </div>
                </CollapsibleCard>
              )}

               {/* Unified Primary Button */}
               {path === 'virtual' && (
                 <div className="sticky bottom-4 z-10 mt-6">
                   <Card className="border-border bg-card/95 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden">
                     <CardContent className="p-4">
                       <Button
                         onClick={() => setStep('drawing')}
                         className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 rounded-xl py-3 font-semibold transition-all duration-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                         disabled={!canProceed}
                       >
                         {getButtonLabel()}
                       </Button>
                     </CardContent>
                   </Card>
                 </div>
               )}
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
                   {optimizationResult?.focus && (
                     <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                       <span>Focus: {optimizationResult.focus.charAt(0).toUpperCase() + optimizationResult.focus.slice(1)}</span>
                     </div>
                   )}
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
                   <Sparkles className="w-6 h-6 text-primary" />
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