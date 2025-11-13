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
          {/* Loading State */}
          {isLoading && (
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Consulting the ancient wisdom...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="space-y-4">
              <div className="text-center text-destructive space-y-2">
                {errorDetails?.type === 'rate_limit' && <Timer className="w-8 h-8 mx-auto" />}
                {errorDetails?.type === 'configuration_needed' && <Settings className="w-8 h-8 mx-auto" />}
                {errorDetails?.type === 'service_unavailable' && <Clock className="w-8 h-8 mx-auto" />}
                {errorDetails?.type === 'safety_violation' && <AlertTriangle className="w-8 h-8 mx-auto" />}
                {!errorDetails?.type && <AlertTriangle className="w-8 h-8 mx-auto" />}
                
                <div>
                  <p className="font-medium">
                    {errorDetails?.type === 'rate_limit' && 'Please Wait Before Next Reading'}
                    {errorDetails?.type === 'configuration_needed' && 'AI Configuration Required'}
                    {errorDetails?.type === 'service_unavailable' && 'AI Service Temporarily Unavailable'}
                    {errorDetails?.type === 'safety_violation' && 'Question Guidelines'}
                    {!errorDetails?.type && 'AI Analysis Unavailable'}
                  </p>
                  <p className="text-sm mt-2">{error}</p>
                </div>
              </div>

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

              {onRetry && retryCount < 3 && errorDetails?.type !== 'configuration_needed' && (
                <Button
                  onClick={onRetry}
                  variant="outline"
                  size="sm"
                  className="border-destructive text-destructive hover:bg-destructive/10 w-full mt-3"
                  aria-label="Seek wisdom again"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Retry Analysis
                </Button>
              )}
            </div>
          )}

          {/* Success State - Show Reading */}
          {aiReading && !isLoading && !error && (
            <>
              <section aria-labelledby="reading-heading">
                <div className="text-muted-foreground leading-relaxed text-base font-light">
                  <ReactMarkdown>{aiReading.storyline}</ReactMarkdown>
                </div>
              </section>

              {/* Risk Section */}
              {aiReading.risk && (
                <div className="border-t border-border pt-4">
                  <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Risks & Cautions
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <ReactMarkdown>{aiReading.risk}</ReactMarkdown>
                  </p>
                </div>
              )}

              {/* Timing Section */}
              {aiReading.timing && (
                <div className="border-t border-border pt-4">
                  <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary/80" />
                    Timing
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <ReactMarkdown>{aiReading.timing}</ReactMarkdown>
                  </p>
                </div>
              )}

              {/* Action Section */}
              {aiReading.action && (
                <div className="border-t border-border pt-4 bg-primary/5 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    Recommended Action
                  </h3>
                  <p className="text-sm text-primary-foreground font-medium leading-relaxed">
                    <ReactMarkdown>{aiReading.action}</ReactMarkdown>
                  </p>
                </div>
              )}
            </>
          )}

          {/* Initial State - No data yet */}
          {!aiReading && !isLoading && !error && (
            <div className="text-center text-muted-foreground space-y-4 py-8">
              <div>
                <p className="text-sm">AI-powered insights will appear here after your cards are drawn.</p>
                <p className="text-xs mt-2 opacity-75">The ancient wisdom awaits your question...</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
