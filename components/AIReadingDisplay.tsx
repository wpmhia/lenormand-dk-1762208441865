"use client"

import { AIReadingResponse } from '@/lib/deepseek'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Clock, Zap } from 'lucide-react'

interface AIReadingDisplayProps {
  aiReading: AIReadingResponse | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  retryCount?: number
}

export function AIReadingDisplay({ aiReading, isLoading, error, onRetry, retryCount = 0 }: AIReadingDisplayProps) {
  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 slide-in-up">
        <CardContent className="pt-6">
          <div className="text-center text-red-600 space-y-4">
            <AlertTriangle className="w-8 h-8 mx-auto" aria-hidden="true" />
            <div>
              <p className="font-medium">AI Analysis Unavailable</p>
              <p className="text-sm">{error}</p>
              {retryCount > 0 && (
                <p className="text-xs text-red-500 mt-1">
                  Attempt {retryCount} of 3
                </p>
              )}
            </div>
            {onRetry && retryCount < 3 && (
              <Button
                onClick={onRetry}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-600 hover:bg-red-50"
                aria-label="Retry AI analysis"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Retry Analysis
              </Button>
            )}
            {retryCount >= 3 && (
              <p className="text-xs text-red-500">
                Maximum retry attempts reached. Please try again later or continue without AI analysis.
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
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
            AI Analysis in Progress...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-slate-300 mb-4">
              Analyzing your cards with advanced AI algorithms...
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-4 bg-slate-700 rounded animate-pulse flex-1" />
                <span className="text-xs text-slate-400">Storyline</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-4 bg-slate-700 rounded animate-pulse w-3/4" />
                <span className="text-xs text-slate-400">Risk Assessment</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 bg-slate-700 rounded animate-pulse w-1/2" />
                <span className="text-xs text-slate-400">Timing</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 bg-slate-700 rounded animate-pulse w-1/3" />
                <span className="text-xs text-slate-400">Action</span>
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
          <Zap className="w-5 h-5 text-blue-400" />
          AI-Powered Interpretation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Storyline */}
        <section aria-labelledby="storyline-heading">
          <h3 id="storyline-heading" className="font-semibold text-white mb-2 text-lg">The Reading</h3>
          <p className="text-slate-300 leading-relaxed">{aiReading.storyline}</p>
        </section>

        {/* Risk and Timing */}
        <section aria-labelledby="insights-heading" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <h4 className="text-xs font-medium text-amber-400 uppercase tracking-wide">Risk</h4>
              <p className="text-sm text-slate-300">{aiReading.risk}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <h4 className="text-xs font-medium text-blue-400 uppercase tracking-wide">Timing</h4>
              <p className="text-sm text-slate-300">{aiReading.timing}</p>
            </div>
          </div>
        </section>

        {/* Action */}
        <section aria-labelledby="action-heading" className="border-t border-slate-700 pt-4">
          <div className="flex items-center justify-between">
            <h4 id="action-heading" className="text-sm font-medium text-slate-400">Recommended Action:</h4>
            <Badge variant="secondary" className="bg-blue-600 text-white font-bold text-lg px-3 py-1" aria-label={`Recommended action: ${aiReading.action}`}>
              {aiReading.action.toUpperCase()}
            </Badge>
          </div>
        </section>
      </CardContent>
    </Card>
  )
}