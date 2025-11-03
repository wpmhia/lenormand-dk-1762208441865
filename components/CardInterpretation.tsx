"use client"

import { ReadingCard, Card as CardType } from '@/lib/types'
import { getCardById } from '@/lib/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, RotateCcw } from 'lucide-react'

interface CardInterpretationProps {
  cards: ReadingCard[]
  allCards: CardType[]
  layoutType: number
  question: string
}

interface PositionInfo {
  title: string
  description: string
}

const getPositionInfo = (position: number, layoutType: number): PositionInfo => {
  if (layoutType === 3) {
    const positions = [
      { title: "Past", description: "What has led to your current situation" },
      { title: "Present", description: "Your current circumstances and energies" },
      { title: "Future", description: "What is likely to develop" }
    ]
    return positions[position] || { title: `Position ${position + 1}`, description: "" }
  } else if (layoutType === 5) {
    const positions = [
      { title: "Past", description: "Events that have shaped your situation" },
      { title: "Present", description: "Your current state of being" },
      { title: "Challenge", description: "Obstacles or lessons to overcome" },
      { title: "Action", description: "Steps you can take to move forward" },
      { title: "Outcome", description: "Potential result if current path continues" }
    ]
    return positions[position] || { title: `Position ${position + 1}`, description: "" }
  } else if (layoutType === 9) {
    const positions = [
      { title: "Past Influences", description: "Distant past affecting the situation" },
      { title: "Recent Past", description: "Immediate past events" },
      { title: "Present Situation", description: "Current circumstances" },
      { title: "Near Future", description: "Immediate developments" },
      { title: "Distant Future", description: "Long-term outcome" },
      { title: "Your Role", description: "How you are contributing" },
      { title: "External Influences", description: "Others' impact on the situation" },
      { title: "Hopes & Fears", description: "Your emotional investment" },
      { title: "Final Outcome", description: "Ultimate resolution" }
    ]
    return positions[position] || { title: `Position ${position + 1}`, description: "" }
  } else {
    // Grand Tableau or other layouts
    return { title: `Card ${position + 1}`, description: "" }
  }
}

export function CardInterpretation({ cards, allCards, layoutType, question }: CardInterpretationProps) {
  const getCardMeaning = (card: ReadingCard): string => {
    const fullCard = getCardById(allCards, card.id)
    if (!fullCard) return "Card meaning not found"
    
    return card.reversed ? (fullCard.reversedMeaning || fullCard.uprightMeaning) : fullCard.uprightMeaning
  }

  const getCardKeywords = (card: ReadingCard): string[] => {
    const fullCard = getCardById(allCards, card.id)
    return fullCard?.keywords || []
  }

  return (
    <Card className="border-slate-700 bg-slate-900/50 slide-in-left">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400/80" />
          Traditional Card Meanings
        </CardTitle>
        <p className="text-slate-400 text-sm">
          Classic Lenormand interpretations for your question: &quot;{question}&quot;
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {cards.map((card, index) => {
          const fullCard = getCardById(allCards, card.id)
          const positionInfo = getPositionInfo(index, layoutType)
          const meaning = getCardMeaning(card)
          const keywords = getCardKeywords(card)
          
          return (
            <div 
              key={`${card.id}-${index}`} 
              className="border border-slate-700 rounded-lg p-4 bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl" aria-hidden="true">
                    {fullCard?.emoji || '🃏'}
                  </div>
                  <div>
                    <h3 className="text-white font-medium flex items-center gap-2">
                      {fullCard?.name || 'Unknown Card'}
                      {card.reversed && (
                        <Badge variant="secondary" className="text-xs">
                          <RotateCcw className="w-3 h-3 mr-1" />
                          Reversed
                        </Badge>
                      )}
                    </h3>
                    <p className="text-amber-400 text-sm font-medium">
                      {positionInfo.title}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-slate-400 border-slate-600">
                  #{card.id}
                </Badge>
              </div>
              
              {positionInfo.description && (
                <p className="text-slate-400 text-xs mb-2 italic">
                  {positionInfo.description}
                </p>
              )}
              
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                {meaning}
              </p>
              
              {keywords.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {keywords.map((keyword, keywordIndex) => (
                    <Badge 
                      key={keywordIndex} 
                      variant="secondary" 
                      className="text-xs bg-slate-700/50 text-slate-300 border-slate-600"
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )
        })}
        
        <div className="mt-6 p-4 bg-amber-950/20 border border-amber-400/20 rounded-lg">
          <p className="text-amber-200 text-sm leading-relaxed">
            <strong>Traditional Wisdom:</strong> These classic interpretations provide the foundation for understanding your reading. 
            The AI analysis above weaves these individual meanings into a cohesive narrative tailored to your specific question.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}