"use client"

import { useState } from 'react'
import { Reading, ReadingCard, Card as CardType } from '@/lib/types'
import { getCardById, getCombinationMeaning, getLinearAdjacentCards, getGrandTableauAdjacentCards } from '@/lib/data'
import { Card } from './Card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardModal } from './CardModal'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Share2, Calendar, Info } from 'lucide-react'

interface ReadingViewerProps {
  reading: Reading
  allCards: CardType[]
  showShareButton?: boolean
  onShare?: () => void
  showReadingHeader?: boolean
}

interface PositionInfo {
  label: string
  meaning: string
}

const getPositionInfo = (position: number, layoutType: number): PositionInfo => {
  const positions: Record<number, Record<number, PositionInfo>> = {
    3: {
      0: { label: "Past", meaning: "Influences from your past that shaped your current situation" },
      1: { label: "Present", meaning: "Your current circumstances and immediate challenges" },
      2: { label: "Future", meaning: "Potential outcome based on your current path" }
    },
    5: {
      0: { label: "Past", meaning: "Past influences affecting your situation" },
      1: { label: "Present", meaning: "Your current circumstances and challenges" },
      2: { label: "Future", meaning: "Future influences and potential developments" },
      3: { label: "Challenge", meaning: "Obstacles you may need to overcome" },
      4: { label: "Advice", meaning: "Guidance for navigating your situation" }
    },
    9: {
      0: { label: "Center", meaning: "The core of your situation or question" },
      1: { label: "Top", meaning: "Your goals, aspirations, and conscious desires" },
      2: { label: "Bottom", meaning: "Foundation, subconscious influences, and roots" },
      3: { label: "Left", meaning: "Past influences and what's receding" },
      4: { label: "Right", meaning: "Future influences and what's approaching" },
      5: { label: "Top-Left", meaning: "External influences and environment" },
      6: { label: "Top-Right", meaning: "Your hopes, fears, and expectations" },
      7: { label: "Bottom-Left", meaning: "Your internal state and emotions" },
      8: { label: "Bottom-Right", meaning: "Final outcome and resolution" }
    }
  }

  return positions[layoutType]?.[position] || { label: `Position ${position + 1}`, meaning: "" }
}

const getGrandTableauPosition = (index: number): { x: number; y: number; label: string } => {
  const row = Math.floor(index / 4)
  const col = index % 4
  
  const houseCards = [
    "House", "Mice", "Fox", "Bear", "Stars", "Stork", "Dog", "Tower",
    "Garden", "Mountain", "Paths", "Mice", "Heart", "Ring", "Book", "Letter"
  ]
  
  return {
    x: col,
    y: row,
    label: houseCards[index] || `Position ${index + 1}`
  }
}

export function ReadingViewer({
  reading,
  allCards,
  showShareButton = true,
  onShare,
  showReadingHeader = true
}: ReadingViewerProps) {
  const [selectedCard, setSelectedCard] = useState<{ card: CardType; reversed: boolean } | null>(null)

  const getAdjacentCards = (currentCard: ReadingCard): ReadingCard[] => {
    if (reading.layoutType === 36) {
      return getGrandTableauAdjacentCards(reading.cards, currentCard.position)
    } else {
      const index = reading.cards.findIndex(c => c.position === currentCard.position)
      return getLinearAdjacentCards(reading.cards, index)
    }
  }

  const renderLayout = () => {
    if (reading.layoutType === 36) {
      // Grand Tableau - 9x4 grid
      return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-4xl mx-auto">
          {reading.cards.map((readingCard, index) => {
            const card = getCardById(allCards, readingCard.id)
            if (!card) return null

            const position = getGrandTableauPosition(index)

            return (
              <div key={index} className="flex flex-col items-center space-y-1">
                <div className="text-xs text-center text-gray-600 font-medium">
                  {position.label}
                </div>
                <Card
                  card={card}
                  reversed={readingCard.reversed}
                  size="sm"
                  onClick={() => setSelectedCard({ card, reversed: readingCard.reversed })}
                />
              </div>
            )
          })}
        </div>
      )
    } else {
      // Linear layouts (3, 5, 9 cards)
      return (
        <div className={`grid gap-4 mx-auto ${
          reading.layoutType === 3 ? 'grid-cols-1 sm:grid-cols-3 max-w-4xl' :
          reading.layoutType === 5 ? 'grid-cols-1 sm:grid-cols-3 md:grid-cols-5 max-w-6xl' :
          'grid-cols-1 sm:grid-cols-3 max-w-6xl'
        }`}>
          {reading.cards.map((readingCard, index) => {
            const card = getCardById(allCards, readingCard.id)
            if (!card) return null

            const positionInfo = getPositionInfo(index, reading.layoutType)

            return (
              <TooltipProvider key={index}>
                <div className="flex flex-col items-center space-y-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center space-y-2">
                        <div className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                          {positionInfo.label}
                        </div>
                        <Card
                          card={card}
                          reversed={readingCard.reversed}
                          size="md"
                          onClick={() => setSelectedCard({ card, reversed: readingCard.reversed })}
                          className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs bg-slate-800 border-slate-600 text-slate-100">
                      <div className="space-y-2">
                        <p className="font-semibold">{positionInfo.label}</p>
                        <p className="text-sm">{positionInfo.meaning}</p>
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <Info className="w-3 h-3" />
                          <span>Click card for details</span>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            )
          })}
        </div>
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Reading Header */}
      {showReadingHeader && (
        <div className="text-center space-y-2 slide-in-up">
          <h2 className="text-2xl font-bold">{reading.title}</h2>
          {reading.question && reading.question !== reading.title && (
             <p className="text-gray-600 italic">&ldquo;{reading.question}&rdquo;</p>
          )}
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(reading.createdAt).toLocaleDateString()}
            </div>
            <Badge variant="secondary">
              {reading.layoutType} Cards
            </Badge>
          </div>
        </div>
      )}

      {/* Share Button */}
      {showShareButton && onShare && (
        <div className="flex justify-center slide-in-left">
          <Button onClick={onShare} variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share the Wisdom
          </Button>
        </div>
      )}

      {/* Cards Layout */}
      <div className="py-6 fade-in-scale">
        {renderLayout()}
      </div>

      {/* Card Modal with Combinations */}
      {selectedCard && (
        <CardModal
          card={selectedCard.card}
          reversed={selectedCard.reversed}
          onClose={() => setSelectedCard(null)}
        />
      )}

      {/* Combinations Panel */}
      {selectedCard && (
        <div className="mt-6 p-6 bg-slate-50 rounded-xl slide-in-up border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-semibold text-lg text-slate-800">Card Combinations</h3>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Info className="w-3 h-3" />
              <span>How this card interacts with nearby cards</span>
            </div>
          </div>
          <div className="space-y-3">
            {(() => {
              const readingCard = reading.cards.find(c => c.id === selectedCard.card.id)
              if (!readingCard) return null

              const adjacentCards = getAdjacentCards(readingCard)
              
              if (adjacentCards.length === 0) {
                return (
                  <div className="text-center py-8 text-slate-500">
                    <p className="mb-2">No adjacent cards in this layout</p>
                    <p className="text-sm">In larger spreads, this card would interact with nearby cards</p>
                  </div>
                )
              }
              
              return adjacentCards.map((adjCard, index) => {
                const card = getCardById(allCards, adjCard.id)
                if (!card) return null

                const combination = getCombinationMeaning(selectedCard.card, card)

                return (
                  <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <Card card={selectedCard.card} size="sm" />
                      <span className="text-slate-400 font-medium">+</span>
                      <Card card={card} size="sm" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-700 mb-1">
                        {selectedCard.card.name} + {card.name}
                      </div>
                      <div className="text-sm text-slate-600">
                        {combination || 'These cards work together to create a unique meaning in your reading.'}
                      </div>
                    </div>
                  </div>
                )
              })
            })()}
          </div>
        </div>
      )}
    </div>
  )
}