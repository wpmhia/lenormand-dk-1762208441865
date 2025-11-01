"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card as CardType, ReadingCard, Reading } from '@/lib/types'
import { Deck } from '@/components/Deck'
import { ReadingViewer } from '@/components/ReadingViewer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Save, Eye } from 'lucide-react'
import { getCards, drawCards, saveReading, generateSlug, createShareableUrl } from '@/lib/data'

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
  const [title, setTitle] = useState('')
  const [question, setQuestion] = useState('')
  const [allowReversed, setAllowReversed] = useState(false)
  const [isPublic, setIsPublic] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedReading, setSavedReading] = useState<Reading | null>(null)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'setup' | 'drawing' | 'review'>('setup')

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

  const handleDraw = (cards: CardType[]) => {
    const readingCards = drawCards(cards, layoutType)
    if (!allowReversed) {
      readingCards.forEach(card => card.reversed = false)
    }
    setDrawnCards(readingCards)
    setStep('review')
  }

  const handleSave = () => {
    if (!title.trim()) {
      setError('Please enter a title for your reading')
      return
    }

    setIsSaving(true)
    setError('')

    try {
      const now = new Date()
      const reading: Reading = {
        id: generateSlug(),
        title: title.trim(),
        question: question.trim() || undefined,
        layoutType,
        cards: drawnCards,
        slug: generateSlug(),
        isPublic,
        createdAt: now,
        updatedAt: now,
      }

      saveReading(reading)
      setSavedReading(reading)
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
    setTitle('')
    setQuestion('')
  }

  const handleViewReading = () => {
    if (savedReading) {
      router.push(`/read/${savedReading.slug}`)
    }
  }

  

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">New Lenormand Reading</h1>
        <p className="text-gray-600">
          Create a personalized Lenormand card reading
        </p>
      </div>

      {error && (
        <Alert className="mb-6" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {step === 'setup' && (
        <Card>
          <CardHeader>
            <CardTitle>Reading Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Daily Reading"
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="question">Question (Optional)</Label>
              <Textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What guidance do I need for today?"
                maxLength={500}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="layout">Layout Type</Label>
              <Select value={layoutType.toString()} onValueChange={(value) => setLayoutType(parseInt(value) as 3 | 5 | 9 | 36)}>
                <SelectTrigger>
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

            <div className="flex items-center space-x-2">
              <Switch
                id="reversed"
                checked={allowReversed}
                onCheckedChange={setAllowReversed}
              />
              <Label htmlFor="reversed">Allow reversed cards</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
              <Label htmlFor="public">Make reading public (shareable)</Label>
            </div>

            <Button 
              onClick={() => setStep('drawing')} 
              className="w-full"
              disabled={!title.trim()}
            >
              Continue to Draw Cards
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'drawing' && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Draw Your Cards</h2>
            <p className="text-gray-600">
              Drawing {layoutType} cards for your reading
            </p>
          </div>

          <Deck
            cards={allCards}
            drawCount={layoutType}
            allowReversed={allowReversed}
            onDraw={handleDraw}
          />

          <div className="flex justify-center">
            <Button variant="outline" onClick={() => setStep('setup')}>
              Back to Setup
            </Button>
          </div>
        </div>
      )}

      {step === 'review' && !savedReading && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Review Your Reading</h2>
            <p className="text-gray-600">
              Click on cards to see their meanings and combinations
            </p>
          </div>

          <ReadingViewer
            reading={{
              id: 'temp',
              title,
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
            <Button variant="outline" onClick={handleStartOver}>
              Start Over
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
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

      {step === 'review' && savedReading && (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="text-green-600 text-lg font-semibold">
              ✓ Reading saved successfully!
            </div>
            
            <ReadingViewer
              reading={savedReading}
              allCards={allCards}
              showShareButton={true}
              onShare={() => {
                const shareUrl = createShareableUrl(savedReading)
                navigator.clipboard.writeText(shareUrl)
                alert('Shareable link copied to clipboard!')
              }}
            />

            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={handleStartOver}>
                New Reading
              </Button>
              <Button onClick={handleViewReading}>
                <Eye className="w-4 h-4 mr-2" />
                View Reading
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}