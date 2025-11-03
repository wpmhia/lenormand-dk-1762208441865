"use client"

"use client"

import { useState, useEffect } from 'react'
import { AIReadingResponse } from '@/lib/deepseek'
import { ReadingCard, Card as CardType } from '@/lib/types'
import { CardRelationshipVisualizer } from '@/components/CardRelationshipVisualizer'
import { CardRelationship, RelationshipAnalysisResponse } from '@/app/api/readings/relationships/route'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Clock, Zap, Network, ExternalLink, Settings, Timer } from 'lucide-react'

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
  layoutType?: number
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
  layoutType = 3,
  question = ''
}: AIReadingDisplayProps) {
  const [showRelationships, setShowRelationships] = useState(false)
  const [relationshipData, setRelationshipData] = useState<RelationshipAnalysisResponse | null>(null)
  const [relationshipLoading, setRelationshipLoading] = useState(false)
  const [relationshipError, setRelationshipError] = useState<string | null>(null)

  const analyzeRelationships = async () => {
    if (!cards.length || relationshipData) return

    setRelationshipLoading(true)
    setRelationshipError(null)

    try {
      const response = await fetch('/api/readings/relationships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cards,
          layoutType,
          question
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze relationships')
      }

      const data = await response.json()
      setRelationshipData(data)
    } catch (error) {
      console.error('Relationship analysis error:', error)
      setRelationshipError(error instanceof Error ? error.message : 'Failed to analyze relationships')
    } finally {
      setRelationshipLoading(false)
    }
  }

  useEffect(() => {
    if (showRelationships && !relationshipData && !relationshipLoading) {
      analyzeRelationships()
    }
  }, [showRelationships])

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
      <Card className="border-red-200 bg-red-50 slide-in-up">
        <CardContent className="pt-6">
          <div className="text-center text-red-600 space-y-4">
            {getErrorIcon()}
            <div>
              <p className="font-medium">{getErrorTitle()}</p>
              <p className="text-sm mt-2">{error}</p>
              
              {/* Specific error guidance */}
              {errorDetails?.type === 'rate_limit' && (
                <div className="mt-3 p-3 bg-red-100 rounded-lg border border-red-200">
                  <p className="text-sm text-red-700">
                    <strong>Why?</strong> To ensure quality readings for everyone, we limit requests to 1 every 2 seconds.
                  </p>
                  <p className="text-sm text-red-700 mt-1">
                    <strong>What to do:</strong> Wait a moment, then try again.
                  </p>
                </div>
              )}

              {errorDetails?.type === 'configuration_needed' && (
                <div className="mt-3 p-3 bg-red-100 rounded-lg border border-red-200">
                  <p className="text-sm text-red-700">
                    <strong>Why?</strong> AI readings require a DeepSeek API key.
                  </p>
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-red-700">
                      <strong>What to do:</strong> Add DEEPSEEK_API_KEY to your .env file
                    </p>
                    {errorDetails.helpUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-300 text-red-600 hover:bg-red-50"
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
                <div className="mt-3 p-3 bg-red-100 rounded-lg border border-red-200">
                  <p className="text-sm text-red-700">
                    <strong>Why?</strong> The AI service is temporarily experiencing issues.
                  </p>
                  <p className="text-sm text-red-700 mt-1">
                    <strong>What to do:</strong> Try again in a few minutes.
                  </p>
                </div>
              )}

              {errorDetails?.type === 'safety_violation' && (
                <div className="mt-3 p-3 bg-red-100 rounded-lg border border-red-200">
                  <p className="text-sm text-red-700">
                    <strong>Why?</strong> Your question touches on sensitive topics.
                  </p>
                  <p className="text-sm text-red-700 mt-1">
                    <strong>What to do:</strong> {errorDetails.suggestion}
                  </p>
                </div>
              )}

              {retryCount > 0 && (
                <p className="text-xs text-red-500 mt-3">
                  Attempt {retryCount} of 3
                </p>
              )}
            </div>
            
            {onRetry && retryCount < 3 && errorDetails?.type !== 'configuration_needed' && (
              <Button
                onClick={onRetry}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-600 hover:bg-red-50"
                aria-label="Seek wisdom again"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Retry Analysis
              </Button>
            )}
            
            {retryCount >= 3 && (
              <p className="text-xs text-red-500">
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
      <Card className="border-slate-700 bg-slate-900/50 fade-in-scale">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-amber-400/60 border-t-transparent rounded-full gentle-spin" aria-hidden="true" />
            Your reading unfolds...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-slate-300 mb-4">
              Let the cards reveal their wisdom...
            </div>
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="h-4 bg-slate-700 rounded animate-pulse w-full" />
                <div className="h-4 bg-slate-700 rounded animate-pulse w-11/12" />
                <div className="h-4 bg-slate-700 rounded animate-pulse w-10/12" />
                <div className="h-4 bg-slate-700 rounded animate-pulse w-9/12" />
                <div className="h-4 bg-slate-700 rounded animate-pulse w-8/12" />
                <div className="h-4 bg-slate-700 rounded animate-pulse w-7/12" />
              </div>
              <div className="border-t border-amber-400/20 pt-3 mt-4">
                <div className="h-4 bg-amber-400/20 rounded animate-pulse w-3/4 mx-auto" />
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-4 text-center">
              This may take a few moments...
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!aiReading) {
    return (
      <Card className="border-slate-700 bg-slate-900/50 slide-in-left">
        <CardContent className="pt-6">
          <div className="text-center text-slate-400">
            <p>AI analysis not available for this reading.</p>
            <p className="text-sm mt-1">Traditional card meanings are shown below.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-slate-700 bg-slate-900/50 slide-in-up">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400/80" />
          The Sibyl Speaks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Continuous Prose Reading */}
        <section aria-labelledby="reading-heading">
          <div className="text-slate-300 leading-relaxed text-base font-light italic">
            {aiReading.storyline}
          </div>
        </section>

        {/* Tender Action */}
        <section aria-labelledby="action-heading" className="border-t border-amber-400/20 pt-4">
          <div className="text-center">
            <div className="text-xs text-amber-400/60 uppercase tracking-wider font-medium mb-2">Your Path Forward</div>
            <div className="text-amber-200 text-lg font-light italic">
              {aiReading.action}
            </div>
          </div>
        </section>

        {/* Relationship Visualizer Toggle */}
        <section className="border-t border-slate-700 pt-4">
          <Button
            onClick={() => setShowRelationships(!showRelationships)}
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <Network className="w-4 h-4 mr-2" />
            {showRelationships ? 'Hide' : 'Show'} Relationship Map
          </Button>
        </section>

        {/* Relationship Visualizer */}
        {showRelationships && (
          <section className="mt-4">
            <CardRelationshipVisualizer
              cards={cards}
              allCards={allCards}
              relationships={relationshipData?.relationships || []}
              summary={relationshipData?.summary || ''}
              isLoading={relationshipLoading}
              error={relationshipError}
            />
          </section>
        )}
      </CardContent>
    </Card>
  )
}