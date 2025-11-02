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
        <p className="text-sm text-slate-400">
          {selectedRating === 'positive' && 'Glad this reading resonated with you!'}
          {selectedRating === 'neutral' && 'Thanks for your honest feedback.'}
          {selectedRating === 'negative' && 'We appreciate your input to improve our AI.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-center text-slate-400">
        How accurate was this AI interpretation?
      </p>
      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFeedback('positive')}
          className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
        >
          <ThumbsUp className="w-4 h-4 mr-1" />
          Accurate
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFeedback('neutral')}
          className="border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-white"
        >
          <Minus className="w-4 h-4 mr-1" />
          Partial
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFeedback('negative')}
          className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
        >
          <ThumbsDown className="w-4 h-4 mr-1" />
          Off
        </Button>
      </div>
    </div>
  )
}