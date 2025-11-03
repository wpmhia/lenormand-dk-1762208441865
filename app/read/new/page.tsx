"use client"

import { useState, useEffect } from 'react'
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
import { Sparkles } from 'lucide-react'
import { getCards, drawCards, getCardById } from '@/lib/data'
import { getAIReading, AIReadingRequest, AIReadingResponse, isDeepSeekAvailable } from '@/lib/deepseek'


const LAYOUTS = [
  { value: 3, label: "3 Cards - Past, Present, Future" },
  { value: 5, label: "5 Cards - Extended Reading" },
  { value: 9, label: "9 Cards - Comprehensive Reading" },
  { value: 36, label: "Grand Tableau - Full Deck" }
]

export default function NewReadingPage() {
  const [allCards, setAllCards] = useState<CardType[]>([])
  const [drawnCards, setDrawnCards] = useState<ReadingCard[]>([])
  const [layoutType, setLayoutType] = useState<3 | 5 | 9 | 36>(3)

  const [question, setQuestion] = useState('')
  const [questionCharCount, setQuestionCharCount] = useState(0)

  const [allowReversed, setAllowReversed] = useState(false)

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
  const [showStartOverConfirm, setShowStartOverConfirm] = useState(false)

  useEffect(() => {
    fetchCards()
  }, [])

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
    const readingCards = drawCards(cards, layoutType)
    if (!allowReversed) {
      readingCards.forEach(card => card.reversed = false)
    }
    setDrawnCards(readingCards)

    // Start AI analysis (API route handles availability)
    setStep('ai-analysis')
    await performAIAnalysis(readingCards)
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
          position: card.position,
          reversed: card.reversed
        })),
        layoutType,
        userLocale: navigator.language
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

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
          errorMessage = 'AI analysis timed out. Please try again.'
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

    setLayoutType(3)
    setAllowReversed(false)
    setError('')
    setAiReading(null)
    setAiLoading(false)
    setAiError(null)
    setAiErrorDetails(null)
    setShowStartOverConfirm(false)
  }



  return (
    <TooltipProvider>
      <div className="page-layout mystical-bg">
        {/* Floating background orbs */}
        <div className="floating-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 text-amber-900 relative">
            New Lenormand Reading
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-amber-400 to-rose-400 rounded-full"></div>
          </h1>
          <p className="text-amber-800 text-lg italic">
            Let the ancient cards reveal what your heart already knows
          </p>

          {/* Progress Indicator */}
          <div className="mt-8 flex items-center justify-center space-x-6">
            <div className={`flex items-center ${step === 'setup' ? 'text-rose-400' : 'text-emerald-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step === 'setup' ? 'bg-rose-600 border-rose-400 shadow-lg shadow-rose-500/30' : 'bg-emerald-600 border-emerald-400'}`}>
                1
              </div>
              <span className="ml-3 text-sm font-medium">Setup</span>
            </div>
            <div className={`w-12 h-0.5 rounded-full ${step === 'drawing' || step === 'ai-analysis' ? 'bg-emerald-400' : 'bg-slate-600'}`}></div>
            <div className={`flex items-center ${step === 'drawing' ? 'text-amber-400' : 'text-emerald-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step === 'drawing' ? 'bg-amber-600 border-amber-400 shadow-lg shadow-amber-500/30' : 'bg-emerald-600 border-emerald-400'}`}>
                2
              </div>
              <span className="ml-3 text-sm font-medium">Draw</span>
            </div>
            <div className={`w-12 h-0.5 rounded-full ${step === 'ai-analysis' ? 'bg-emerald-400' : 'bg-slate-600'}`}></div>
            <div className={`flex items-center ${step === 'ai-analysis' ? 'text-purple-400' : 'text-emerald-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step === 'ai-analysis' ? 'bg-purple-600 border-purple-400 shadow-lg shadow-purple-500/30' : 'bg-emerald-600 border-purple-400'}`}>
                3
              </div>
              <span className="ml-3 text-sm font-medium">Analyze</span>
            </div>

          </div>
        </div>

        {error && (
          <Alert className="border-red-200 bg-red-50 mb-6">
            <AlertDescription className="text-red-800">
              {error}
              <Button
                variant="link"
                size="sm"
                onClick={() => setError('')}
                className="ml-2 text-red-600 hover:text-red-800 p-0 h-auto"
              >
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {step === 'setup' && (
          <div className="space-y-6">
            <Card className="border-rose-400/20 bg-gradient-to-br from-slate-900/60 via-rose-950/20 to-slate-800/40 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-50"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-rose-200 text-xl">
                  Your Sacred Question:
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10">
              <div className="space-y-3">
                <Textarea
                  id="question"
                  value={question}
                  onChange={(e) => {
                    setQuestion(e.target.value)
                    setQuestionCharCount(e.target.value.length)
                  }}
                  placeholder="What guidance do the cards have for me today?"
                  className="bg-slate-900/80 border-rose-400/30 text-white placeholder:text-rose-300/50 min-h-[120px] rounded-xl focus:border-rose-400/60 focus:ring-rose-400/20 resize-none backdrop-blur-sm"
                  maxLength={200}
                  aria-describedby="question-help question-count"
                  required
                />
                <div id="question-count" className="text-right text-xs text-rose-300/60" aria-live="polite">
                  {questionCharCount}/200 characters
                </div>
                <div id="question-help" className="text-xs text-rose-200/70 italic">
                  Let your question breathe, and the cards will whisper their wisdom
                </div>
                </div>



                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="layout">Reading Type:</Label>
                     <Select value={layoutType.toString()} onValueChange={(value) => setLayoutType(parseInt(value) as 3 | 5 | 9 | 36)}>
                       <SelectTrigger className="bg-slate-900/80 border-rose-400/30 text-white rounded-xl focus:border-rose-400/60 backdrop-blur-sm" aria-describedby="layout-help">
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent className="bg-slate-900 border-rose-400/30">
                         {LAYOUTS.map((layout) => (
                           <SelectItem key={layout.value} value={layout.value.toString()} className="text-white hover:bg-rose-950/50 focus:bg-rose-950/50">
                             {layout.label}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                     <div id="layout-help" className="text-xs text-rose-200/70 italic">
                       Choose the number of cards for your reading spread
                     </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-900/40 rounded-xl border border-rose-400/20">
                    <Label htmlFor="allow-reversed" className="text-rose-200 font-medium">Allow reversed cards</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Switch
                          id="allow-reversed"
                          checked={allowReversed}
                          onCheckedChange={setAllowReversed}
                          className="!bg-rose-200 !border-rose-400 !data-[state=checked]:bg-rose-500 !data-[state=checked]:border-rose-600 !thumb:bg-white transition-all duration-200"
                        />
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-900 border-rose-400/30 text-rose-200">
                        <p>When enabled, cards can appear upside down for additional meaning</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>


               </div>

                <Button
                 onClick={() => setStep('drawing')}
                 className="w-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-white shadow-lg shadow-rose-500/30 rounded-xl py-3 font-semibold transition-all duration-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                 disabled={!question.trim()}
               >
                 Continue to Draw Cards
               </Button>
            </CardContent>
          </Card>
          </div>
        )}

         {step === 'drawing' && (
           <Card className="border-amber-400/20 bg-gradient-to-br from-slate-900/60 via-amber-950/20 to-slate-800/40 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden relative">
             <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-50"></div>
             <CardContent className="space-y-8 p-8 relative z-10">
               <div className="text-center">
                 <h2 className="text-3xl font-semibold mb-4 text-white relative">
                   Draw Your Cards
                   <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-amber-400 to-purple-400 rounded-full"></div>
                 </h2>
                 <p className="text-slate-200 text-lg italic">
                   Drawing {layoutType} cards from the sacred deck
                 </p>
               </div>

               <Deck
                 cards={allCards}
                 drawCount={layoutType}
                 allowReversed={allowReversed}
                 onDraw={handleDraw}
               />
             </CardContent>
           </Card>
          )}

          {step === 'ai-analysis' && (
            <Card className="border-purple-400/20 bg-gradient-to-br from-slate-900/60 via-purple-950/20 to-slate-800/40 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-50"></div>
              <CardContent className="space-y-6 p-8 relative z-10">
                <div className="text-center">
                 <h2 className="text-2xl font-semibold mb-2 text-white flex items-center justify-center gap-2">
                   <Sparkles className="w-6 h-6 text-purple-400" />
                   AI Analysis
                 </h2>
                  <p className="text-slate-300">
                    The sibyl weaves wisdom from your {layoutType} sacred cards
                  </p>
               </div>

<ReadingViewer
                  reading={{
                    id: 'temp',
                    title: 'Your Reading',
                    question,
                    layoutType,
                    cards: drawnCards,
                    slug: 'temp',
                     isPublic: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  }}
                  allCards={allCards}
                  showShareButton={false}
                />

                {/* Show traditional meanings while AI loads or if AI fails */}
                {(aiLoading || (!aiReading && !aiLoading)) && (
                  <CardInterpretation
                    cards={drawnCards}
                    allCards={allCards}
                    layoutType={layoutType}
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
                    position: card.position,
                    reversed: card.reversed
                  }))}
                  allCards={allCards}
                  layoutType={layoutType}
                  question={question}
                />

               {!aiLoading && (
                 <div className="flex gap-4 justify-center">
                   <Button
                     onClick={() => setStep('drawing')}
                     variant="outline"
                     className="border-purple-400/30 text-purple-200 hover:bg-purple-950/50 rounded-xl py-3 font-semibold transition-all duration-300"
                   >
                     Draw Again
                   </Button>

                 </div>
               )}
              </CardContent>
            </Card>
          )}





          {/* Start Over Confirmation Dialog */}
          <Dialog open={showStartOverConfirm} onOpenChange={setShowStartOverConfirm}>
            <DialogContent className="bg-slate-900 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Start Over?</DialogTitle>
                <DialogDescription className="text-slate-300">
                  This will reset your current reading and all progress. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowStartOverConfirm(false)}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmStartOver}
                  className="bg-red-600 hover:bg-red-700"
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