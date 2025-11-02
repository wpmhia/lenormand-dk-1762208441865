"use client"

import { AIReadingResponse } from '@/lib/deepseek'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Clock, Zap } from 'lucide-react'

interface AIReadingDisplayProps {
  aiReading: AIReadingResponse | null
  isLoading?: boolean
  error?: string | null
}

export function AIReadingDisplay({ aiReading, isLoading, error }: AIReadingDisplayProps) {
  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p className="font-medium">AI Analysis Unavailable</p>
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="border-slate-700 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            AI Analysis in Progress...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-slate-700 rounded animate-pulse" />
            <div className="h-4 bg-slate-700 rounded animate-pulse w-3/4" />
            <div className="flex gap-4">
              <div className="h-3 bg-slate-700 rounded animate-pulse w-1/3" />
              <div className="h-3 bg-slate-700 rounded animate-pulse w-1/4" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!aiReading) {
    return (
      <Card className="border-slate-700 bg-slate-900/50">
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
    <Card className="border-slate-700 bg-slate-900/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-400" />
          AI-Powered Interpretation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Storyline */}
        <div>
          <h4 className="font-semibold text-white mb-2">The Reading</h4>
          <p className="text-slate-300 leading-relaxed">{aiReading.storyline}</p>
        </div>

        {/* Risk and Timing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-amber-400 uppercase tracking-wide">Risk</p>
              <p className="text-sm text-slate-300">{aiReading.risk}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-blue-400 uppercase tracking-wide">Timing</p>
              <p className="text-sm text-slate-300">{aiReading.timing}</p>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="border-t border-slate-700 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">Recommended Action:</span>
            <Badge variant="secondary" className="bg-blue-600 text-white font-bold text-lg px-3 py-1">
              {aiReading.action.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}