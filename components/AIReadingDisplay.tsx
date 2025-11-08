"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AIReadingResponse } from '@/lib/deepseek'
import { ReadingCard, Card as CardType } from '@/lib/types'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Clock, Zap, ExternalLink, Settings, Timer } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface AIReadingDisplayProps {
  aiReading: AIReadingResponse | null
  isLoading?: boolean
  error?: string | null
  errorDetails?: {
    type?: string
    helpUrl?: string
    action?: string
    waitTime?: number
    fields?: string[]
    suggestion?: string
  } | null
  onRetry?: () => void
  retryCount?: number
  cards?: ReadingCard[]
  allCards?: CardType[]
  spreadId?: string
  question?: string
}

export function AIReadingDisplay({
  aiReading,
  isLoading,
  error,
  errorDetails,
  onRetry,
  retryCount = 0,
  cards = [],
  allCards = [],
  spreadId,
  question = ''
}: AIReadingDisplayProps) {

  // Show loading state if loading and no error
  if (isLoading && !error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        aria-live="polite"
        aria-atomic="true"
      >
        <Card className="border-border bg-card slide-in-up">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary/80 animate-pulse" />
              The Sibyl Speaks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Consulting the ancient wisdom...</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Don't render anything if no AI reading, not loading, and no error
  if (!aiReading && !error && !isLoading) {
    return null
  }

  if (error) {
    const getErrorIcon = () => {
      switch (errorDetails?.type) {
        case 'rate_limit': return <Timer className="w-8 h-8 mx-auto" />
        case 'configuration_needed': return <Settings className="w-8 h-8 mx-auto" />
        case 'service_unavailable': return <Clock className="w-8 h-8 mx-auto" />
        case 'safety_violation': return <AlertTriangle className="w-8 h-8 mx-auto" />
        default: return <AlertTriangle className="w-8 h-8 mx-auto" />
      }
    }

    const getErrorTitle = () => {
      switch (errorDetails?.type) {
        case 'rate_limit': return 'Please Wait Before Next Reading'
        case 'configuration_needed': return 'AI Configuration Required'
        case 'service_unavailable': return 'AI Service Temporarily Unavailable'
        case 'safety_violation': return 'Question Guidelines'
        default: return 'AI Analysis Unavailable'
      }
    }

    return (
      <Card className="border-destructive bg-destructive/10 slide-in-up">
        <CardContent className="pt-6">
          <div className="text-center text-destructive space-y-4">
            {getErrorIcon()}
            <div>
              <p className="font-medium">{getErrorTitle()}</p>
              <p className="text-sm mt-2">{error}</p>
              
              {/* Specific error guidance */}
              {errorDetails?.type === 'rate_limit' && (
                <div className="mt-3 p-3 border-destructive/20 rounded-lg border border-red-200">
                  <p className="text-sm text-destructive">
                    <strong>Why?</strong> To ensure quality readings for everyone, we limit requests to 1 every 2 seconds.
                  </p>
                  <p className="text-sm text-destructive mt-1">
                    <strong>What to do:</strong> Wait a moment, then try again.
                  </p>
                </div>
              )}

              {errorDetails?.type === 'configuration_needed' && (
                <div className="mt-3 p-3 border-destructive/20 rounded-lg border border-red-200">
                  <p className="text-sm text-destructive">
                    <strong>Why?</strong> AI readings require a DeepSeek API key.
                  </p>
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-destructive">
                      <strong>What to do:</strong> Add DEEPSEEK_API_KEY to your .env file
                    </p>
                    {errorDetails.helpUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-destructive text-destructive hover:bg-destructive/10"
                        asChild
                      >
                        <a href={errorDetails.helpUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3 mr-2" />
                          Get API Key
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {errorDetails?.type === 'service_unavailable' && (
                <div className="mt-3 p-3 border-destructive/20 rounded-lg border border-red-200">
                  <p className="text-sm text-destructive">
                    <strong>Why?</strong> The AI service is temporarily experiencing issues.
                  </p>
                  <p className="text-sm text-destructive mt-1">
                    <strong>What to do:</strong> Try again in a few minutes.
                  </p>
                </div>
              )}

              {errorDetails?.type === 'safety_violation' && (
                <div className="mt-3 p-3 border-destructive/20 rounded-lg border border-red-200">
                  <p className="text-sm text-destructive">
                    <strong>Why?</strong> Your question touches on sensitive topics.
                  </p>
                  <p className="text-sm text-destructive mt-1">
                    <strong>What to do:</strong> {errorDetails.suggestion}
                  </p>
                </div>
              )}

              {retryCount > 0 && (
                <p className="text-xs text-destructive mt-3">
                  Attempt {retryCount} of 3
                </p>
              )}
            </div>
            
            {onRetry && retryCount < 3 && errorDetails?.type !== 'configuration_needed' && (
              <Button
                onClick={onRetry}
                variant="outline"
                size="sm"
                className="border-destructive text-destructive hover:bg-destructive/10"
                aria-label="Seek wisdom again"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Retry Analysis
              </Button>
            )}
            
            {retryCount >= 3 && (
              <p className="text-xs text-destructive">
                The mystical connection needs a moment. Please try again later or continue with your intuition.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="border-border bg-card fade-in-scale">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <motion.div
              className="w-5 h-5 border-2 border-amber-400/60 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              aria-hidden="true"
            />
            Your reading unfolds...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              Let the cards reveal their wisdom...
            </div>
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-11/12" />
                <div className="h-4 bg-muted rounded w-10/12" />
                <div className="h-4 bg-muted rounded w-9/12" />
                <div className="h-4 bg-muted rounded w-8/12" />
                <div className="h-4 bg-muted rounded w-7/12" />
              </div>
              <div className="border-t border-amber-400/20 pt-3 mt-4">
                <div className="h-4 bg-primary/20 rounded w-3/4 mx-auto" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-4 text-center">
              This may take a few moments...
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Only show "not available" if AI has been attempted (isLoading is false and no error)
  // This prevents showing fallback on initial load before AI is attempted
  if (!aiReading && !isLoading && !error) {
    return (
      <Card className="border-border bg-card slide-in-left">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground space-y-4">
            <div>
              <p>AI analysis not available for this reading.</p>
              <p className="text-sm mt-1">Traditional card meanings are shown below.</p>
            </div>
            {onRetry && (
              <Button
                onClick={onRetry}
                variant="outline"
                size="sm"
                className="border-primary text-primary hover:bg-primary/10"
              >
                <Zap className="w-4 h-4 mr-2" />
                Try AI Analysis Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      aria-live="polite"
      aria-atomic="true"
    >
      <Card className="border-border bg-card slide-in-up">
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary/80" />
          The Sibyl Speaks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Continuous Prose Reading */}
        {aiReading && (
          <section aria-labelledby="reading-heading">
            <div className="text-muted-foreground leading-relaxed text-base font-light">
              <ReactMarkdown>{aiReading.storyline}</ReactMarkdown>
            </div>
          </section>
        )}






      </CardContent>
    </Card>
    </motion.div>
  )
}