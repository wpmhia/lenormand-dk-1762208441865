"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ThumbsUp, ThumbsDown, Minus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface FeedbackButtonsProps {
  readingId: string
  onFeedback?: (rating: 'positive' | 'neutral' | 'negative') => void
}

export function FeedbackButtons({ readingId, onFeedback }: FeedbackButtonsProps) {
  const { toast } = useToast()
  const [submitted, setSubmitted] = useState(false)
  const [selectedRating, setSelectedRating] = useState<'positive' | 'neutral' | 'negative' | null>(null)

  const handleFeedback = async (rating: 'positive' | 'neutral' | 'negative') => {
    if (submitted) return

    setSelectedRating(rating)
    setSubmitted(true)

    try {
      // Store feedback locally for RLHF
      const feedback = {
        readingId,
        rating,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      }

      const existingFeedback = JSON.parse(localStorage.getItem('ai-feedback') || '[]')
      existingFeedback.push(feedback)
      localStorage.setItem('ai-feedback', JSON.stringify(existingFeedback))

      // Call optional callback
      onFeedback?.(rating)

      // Show success message
      const messages = {
        positive: 'Your kindness warms us. 🌸',
        neutral: 'We hear you. 🤔',
        negative: 'Your wisdom guides our growth. 🌱'
      }

      toast({
        title: 'Whisper Received',
        description: messages[rating],
      })
    } catch (error) {
      console.error('Feedback submission error:', error)
      toast({
        title: 'Gentle Pause',
        description: 'Your words wait to be heard. Please try again.',
        variant: 'destructive'
      })
      setSubmitted(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">
          {selectedRating === 'positive' && 'Glad this reading resonated with you!'}
          {selectedRating === 'neutral' && 'Thanks for your honest feedback.'}
          {selectedRating === 'negative' && 'We appreciate your input to improve our AI.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-center text-muted-foreground">
        How accurate was this AI interpretation?
      </p>
      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFeedback('positive')}
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          <ThumbsUp className="w-4 h-4 mr-1" />
          Accurate
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFeedback('neutral')}
          className="border-muted-foreground text-muted-foreground hover:bg-muted-foreground hover:text-background"
        >
          <Minus className="w-4 h-4 mr-1" />
          Partial
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFeedback('negative')}
          className="border-muted text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ThumbsDown className="w-4 h-4 mr-1" />
          Off
        </Button>
      </div>
    </div>
  )
}