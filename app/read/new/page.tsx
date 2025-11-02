"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card as CardType, ReadingCard, Reading } from '@/lib/types'
import { Deck } from '@/components/Deck'
import { ReadingViewer } from '@/components/ReadingViewer'
import { AIReadingDisplay } from '@/components/AIReadingDisplay'
import { FeedbackButtons } from '@/components/FeedbackButtons'
import { ContextInput } from '@/components/ContextInput'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Save, Eye, Sparkles } from 'lucide-react'
import { getCards, drawCards, saveReading, generateSlug, createShareableUrl, getCardById } from '@/lib/data'
import { getAIReading, AIReadingRequest, AIReadingResponse, isDeepSeekAvailable } from '@/lib/deepseek'

const LAYOUTS = [
  { value: 3, label: "3 Cards - Past, Present, Future" },
  { value: 5, label: "5 Cards - Extended Reading" },
  { value: 9, label: "9 Cards - Comprehensive Reading" },
  { value: 36, label: "Grand Tableau - Full Deck" }
]

export default function NewReadingPage() {
  const router = useRouter()
  
  const [allCards, setAllCards] = useState<CardType[]>([])
  const [drawnCards, setDrawnCards] = useState<ReadingCard[]>([])
  const [layoutType, setLayoutType] = useState<3 | 5 | 9 | 36>(3)

  const [question, setQuestion] = useState('')
  const [questionCharCount, setQuestionCharCount] = useState(0)
  const [context, setContext] = useState('')
  const [allowReversed, setAllowReversed] = useState(false)
  const [isPublic, setIsPublic] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedReading, setSavedReading] = useState<Reading | null>(null)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'setup' | 'drawing' | 'review' | 'ai-analysis' | 'saved'>('setup')

  // AI-related state
  const [aiReading, setAiReading] = useState<AIReadingResponse | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)

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

  const performAIAnalysis = async (readingCards: ReadingCard[]) => {
    setAiLoading(true)
    setAiError(null)

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

      const response = await fetch('/api/readings/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiRequest)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'AI analysis failed')
      }

      const aiResult = await response.json()
      setAiReading(aiResult)
    } catch (error) {
      console.error('AI analysis error:', error)
      setAiError(error instanceof Error ? error.message : 'AI analysis failed')
    } finally {
      setAiLoading(false)
    }
  }

  const handleSave = () => {
    if (!question.trim()) {
      setError('Please enter a question for your reading')
      return
    }

    setIsSaving(true)
    setError('')

    try {
      const now = new Date()
      const reading: Reading = {
        id: generateSlug(),
        title: question.trim(),
        question: question.trim(),
        layoutType,
        cards: drawnCards,
        slug: generateSlug(),
        isPublic,
        createdAt: now,
        updatedAt: now,
      }

      saveReading(reading)
       setSavedReading(reading)
       setStep('saved')
    } catch (error) {
      console.error('Error saving reading:', error)
      setError('Failed to save reading')
    } finally {
      setIsSaving(false)
    }
  }

  const handleStartOver = () => {
    setDrawnCards([])
    setSavedReading(null)
    setStep('setup')
    setQuestion('')
    setQuestionCharCount(0)
    setContext('')
    setLayoutType(3)
    setAllowReversed(false)
    setIsPublic(false)
    setError('')
    setAiReading(null)
    setAiLoading(false)
    setAiError(null)
  }

  const handleViewReading = () => {
    if (savedReading) {
      router.push(`/read/${savedReading.slug}`)
    }
  }

  

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">New Lenormand Reading</h1>
          <p className="text-slate-300">
            Create a personalized Lenormand card reading with AI-powered analysis
          </p>
        </div>

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
                />
                <div className="text-right text-xs text-slate-400">
                  {questionCharCount}/200
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
                     <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
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
                 </div>

                 <div className="flex items-center justify-between">
                   <Label htmlFor="allow-reversed">Allow reversed cards</Label>
                   <Switch
                     id="allow-reversed"
                     checked={allowReversed}
                     onCheckedChange={setAllowReversed}
                   />
                 </div>

                 <div className="flex items-center justify-between">
                   <Label htmlFor="is-public">Make reading shareable</Label>
                   <Switch
                     id="is-public"
                     checked={isPublic}
                     onCheckedChange={setIsPublic}
                   />
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
                 isPublic,
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
                 isPublic,
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
                 onClick={handleSave}
                 disabled={isSaving}
                 className="bg-blue-600 hover:bg-blue-700"
               >
                 {isSaving ? (
                   <>
                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                     Saving...
                   </>
                 ) : (
                   <>
                     <Save className="w-4 h-4 mr-2" />
                     Save Reading
                   </>
                 )}
               </Button>
             </div>
           </div>
         )}

         {step === 'saved' && savedReading && (
           <div className="space-y-6">
             <div className="text-center">
               <h2 className="text-2xl font-semibold mb-2 text-white">Reading Saved!</h2>
               <p className="text-slate-300">
                 Your Lenormand reading has been saved successfully.
               </p>
              </div>

              {aiReading && (
                <AIReadingDisplay
                  aiReading={aiReading}
                  isLoading={false}
                  error={null}
                />
              )}

              {aiReading && (
                <FeedbackButtons
                  readingId={savedReading.id}
                  onFeedback={(rating) => {
                    // Optional: handle feedback callback
                    console.log('Feedback received:', rating)
                  }}
                />
              )}

              <Card className="border-slate-700 bg-slate-900/50">
               <CardContent className="pt-6">
                 <div className="text-center space-y-4">
                   <div className="text-lg font-medium text-white">
                     "{savedReading.title}"
                   </div>
                   <div className="text-slate-400">
                     {savedReading.layoutType} cards • {savedReading.isPublic ? 'Shareable' : 'Private'}
                   </div>
                   <div className="flex gap-4 justify-center">
                     <Button
                       onClick={handleViewReading}
                       className="bg-blue-600 hover:bg-blue-700"
                     >
                       <Eye className="w-4 h-4 mr-2" />
                       View Reading
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
               </CardContent>
             </Card>
           </div>
         )}
       </div>
    </div>
  )
}