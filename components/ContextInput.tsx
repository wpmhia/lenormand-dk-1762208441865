"use client"

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Info } from 'lucide-react'

interface ContextInputProps {
  value: string
  onChange: (value: string) => void
  maxLength?: number
}

export function ContextInput({ value, onChange, maxLength = 200 }: ContextInputProps) {
  const [charCount, setCharCount] = useState(value.length)

  const handleChange = (newValue: string) => {
    if (newValue.length <= maxLength) {
      setCharCount(newValue.length)
      onChange(newValue)
    }
  }

  return (
    <Card className="border-slate-700 bg-slate-900/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-base flex items-center gap-2">
          <Info className="w-4 h-4" />
          Life Context (Optional)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="context" className="text-sm text-slate-300">
            Add background details to get more personalized AI insights
          </Label>
          <Textarea
            id="context"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="e.g., fintech founder, relationship status, career transition, health concerns..."
            className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-400 min-h-[80px] resize-none"
            maxLength={maxLength}
          />
          <div className="text-right text-xs text-slate-400">
            {charCount}/{maxLength}
          </div>
          <p className="text-xs text-slate-500">
            Context helps the AI understand your situation better, leading to more relevant interpretations.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}