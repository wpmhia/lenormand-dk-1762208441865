"use client"

import { useState, useEffect } from 'react'
import { Card as CardType, ReadingCard } from '@/lib/types'
import { Deck } from '@/components/Deck'
import { ReadingViewer } from '@/components/ReadingViewer'
import { AIReadingDisplay } from '@/components/AIReadingDisplay'
import { ContextInput } from '@/components/ContextInput'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Printer, Sparkles } from 'lucide-react'
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
  const [context, setContext] = useState('')
  const [allowReversed, setAllowReversed] = useState(false)

  const [error, setError] = useState('')
  const [step, setStep] = useState<'setup' | 'drawing' | 'review' | 'ai-analysis' | 'print'>('setup')

  // AI-related state
  const [aiReading, setAiReading] = useState<AIReadingResponse | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
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
        context: context.trim() || undefined,
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

  const handlePrint = () => {
    if (!question.trim()) {
      setError('Please enter a question for your reading')
      return
    }

    if (drawnCards.length === 0) {
      setError('No cards have been drawn for this reading. Please go back and draw cards first.')
      return
    }

    setStep('print')
  }

  const handleStartOver = () => {
    setShowStartOverConfirm(true)
  }

  const confirmStartOver = () => {
    setDrawnCards([])
    setStep('setup')
    setQuestion('')
    setQuestionCharCount(0)
    setContext('')
    setLayoutType(3)
    setAllowReversed(false)
    setError('')
    setAiReading(null)
    setAiLoading(false)
    setAiError(null)
    setShowStartOverConfirm(false)
  }



  return (
    <TooltipProvider>
      <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">New Lenormand Reading</h1>
          <p className="text-slate-300">
            Create a personalized Lenormand card reading with AI-powered analysis
          </p>

          {/* Progress Indicator */}
          <div className="mt-6 flex items-center justify-center space-x-4">
            <div className={`flex items-center ${step === 'setup' ? 'text-blue-400' : 'text-green-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'setup' ? 'bg-blue-600' : 'bg-green-600'}`}>
                1
              </div>
              <span className="ml-2 text-sm">Setup</span>
            </div>
            <div className={`w-8 h-0.5 ${step === 'drawing' || step === 'ai-analysis' || step === 'review' || step === 'print' ? 'bg-green-400' : 'bg-slate-600'}`}></div>
            <div className={`flex items-center ${step === 'drawing' ? 'text-blue-400' : 'text-green-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'drawing' ? 'bg-blue-600' : 'bg-green-600'}`}>
                2
              </div>
              <span className="ml-2 text-sm">Draw</span>
            </div>
            <div className={`w-8 h-0.5 ${step === 'ai-analysis' || step === 'review' || step === 'print' ? 'bg-green-400' : 'bg-slate-600'}`}></div>
            <div className={`flex items-center ${step === 'ai-analysis' ? 'text-blue-400' : 'text-green-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'ai-analysis' ? 'bg-blue-600' : 'bg-green-600'}`}>
                3
              </div>
              <span className="ml-2 text-sm">Analyze</span>
            </div>
            <div className={`w-8 h-0.5 ${step === 'review' || step === 'print' ? 'bg-green-400' : 'bg-slate-600'}`}></div>
            <div className={`flex items-center ${step === 'review' ? 'text-blue-400' : 'text-green-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'review' ? 'bg-blue-600' : 'bg-green-600'}`}>
                4
              </div>
              <span className="ml-2 text-sm">Print</span>
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
          <Card className="border-slate-700 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-white">Question:</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Textarea
                  id="question"
                  value={question}
                  onChange={(e) => {
                    setQuestion(e.target.value)
                    setQuestionCharCount(e.target.value.length)
                  }}
                  placeholder="What guidance do the cards have for me today?"
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-400 min-h-[100px]"
                  maxLength={200}
                  aria-describedby="question-help question-count"
                  required
                />
                <div id="question-count" className="text-right text-xs text-slate-400" aria-live="polite">
                  {questionCharCount}/200 characters
                </div>
                <div id="question-help" className="text-xs text-slate-500">
                  Enter your question to receive personalized guidance from the Lenormand cards
                </div>
                </div>

                <ContextInput
                  value={context}
                  onChange={setContext}
                />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="layout">Reading Type:</Label>
                    <Select value={layoutType.toString()} onValueChange={(value) => setLayoutType(parseInt(value) as 3 | 5 | 9 | 36)}>
                      <SelectTrigger className="bg-slate-900 border-slate-700 text-white" aria-describedby="layout-help">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LAYOUTS.map((layout) => (
                          <SelectItem key={layout.value} value={layout.value.toString()}>
                            {layout.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div id="layout-help" className="text-xs text-slate-500">
                      Choose the number of cards for your reading spread
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="allow-reversed">Allow reversed cards</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Switch
                          id="allow-reversed"
                          checked={allowReversed}
                          onCheckedChange={setAllowReversed}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>When enabled, cards can appear upside down for additional meaning</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>


               </div>

               <Button
                onClick={() => setStep('drawing')}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!question.trim()}
              >
                Continue to Draw Cards
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'drawing' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2 text-white">Draw Your Cards</h2>
              <p className="text-slate-300">
                Drawing {layoutType} cards for your AI-powered reading
              </p>
            </div>

            <Deck
              cards={allCards}
              drawCount={layoutType}
              allowReversed={allowReversed}
              onDraw={handleDraw}
            />
          </div>
         )}

         {step === 'ai-analysis' && (
           <div className="space-y-6">
              <div className="text-center">
               <h2 className="text-2xl font-semibold mb-2 text-white flex items-center justify-center gap-2">
                 <Sparkles className="w-6 h-6 text-blue-400" />
                 AI Analysis
               </h2>
               <p className="text-slate-300">
                 Analyzing your {layoutType}-card spread with advanced AI
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

              <AIReadingDisplay
                aiReading={aiReading}
                isLoading={aiLoading}
                error={aiError}
                onRetry={retryAIAnalysis}
                retryCount={aiRetryCount}
              />

             {!aiLoading && (
               <div className="flex gap-4 justify-center">
                 <Button
                   onClick={() => setStep('drawing')}
                   variant="outline"
                   className="border-slate-700 text-slate-300 hover:bg-slate-800"
                 >
                   Draw Again
                 </Button>
                 <Button
                   onClick={() => setStep('review')}
                   className="bg-blue-600 hover:bg-blue-700"
                 >
                   Continue to Save
                 </Button>
               </div>
             )}
           </div>
         )}

          {step === 'review' && (
           <div className="space-y-6">
             <div className="text-center">
               <h2 className="text-2xl font-semibold mb-2 text-white">Review Your Reading</h2>
             </div>

             <ReadingViewer
               reading={{
                 id: 'temp',
                 title: question,
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

             <div className="flex gap-4 justify-center">
               <Button
                 onClick={() => setStep('drawing')}
                 variant="outline"
                 className="border-slate-700 text-slate-300 hover:bg-slate-800"
               >
                 Draw Again
               </Button>
                 <Button
                   onClick={handlePrint}
                   className="bg-blue-600 hover:bg-blue-700"
                 >
                   <Printer className="w-4 h-4 mr-2" />
                   Print Reading
                 </Button>
             </div>
           </div>
         )}

           {step === 'print' && (
             <div className="space-y-6 print:space-y-4">
               <div className="text-center print:hidden">
                 <h2 className="text-2xl font-semibold mb-2 text-white">Print Your Reading</h2>
                 <p className="text-slate-300">
                   Your Lenormand reading is ready to print.
                 </p>
                </div>

               <ReadingViewer
                 reading={{
                   id: 'print',
                   title: question,
                   question,
                   layoutType,
                   cards: drawnCards,
                   slug: 'print',
                   isPublic: false,
                   createdAt: new Date(),
                   updatedAt: new Date(),
                 }}
                 allCards={allCards}
                 showShareButton={false}
               />

               {aiReading && (
                 <AIReadingDisplay
                   aiReading={aiReading}
                   isLoading={false}
                   error={null}
                   onRetry={retryAIAnalysis}
                   retryCount={aiRetryCount}
                 />
               )}

               <div className="flex gap-4 justify-center print:hidden">
                 <Button
                   onClick={() => window.print()}
                   className="bg-blue-600 hover:bg-blue-700"
                 >
                   <Printer className="w-4 h-4 mr-2" />
                   Print Reading
                 </Button>
                 <Button
                   onClick={handleStartOver}
                   variant="outline"
                   className="border-slate-700 text-slate-300 hover:bg-slate-800"
                 >
                   Create New Reading
                 </Button>
               </div>
             </div>
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