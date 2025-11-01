"use client"

import { useState } from 'react'
import { Reading, ReadingCard, Card as CardType } from '@/lib/types'
import { getCardById, getCombinationMeaning, getLinearAdjacentCards, getGrandTableauAdjacentCards } from '@/lib/data'
import { Card } from './Card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardModal } from './CardModal'
import { Share2, Calendar, User } from 'lucide-react'

interface ReadingViewerProps {
  reading: Reading
  allCards: CardType[]
  showShareButton?: boolean
  onShare?: () => void
}

interface PositionInfo {
  label: string
  meaning: string
}

const getPositionInfo = (position: number, layoutType: number): PositionInfo => {
  const positions: Record<number, Record<number, PositionInfo>> = {
    3: {
      0: { label: "Past", meaning: "Influences from the past" },
      1: { label: "Present", meaning: "Current situation" },
      2: { label: "Future", meaning: "Potential outcome" }
    },
    5: {
      0: { label: "Past", meaning: "Past influences" },
      1: { label: "Present", meaning: "Current situation" },
      2: { label: "Future", meaning: "Future influences" },
      3: { label: "Challenge", meaning: "Obstacles or challenges" },
      4: { label: "Advice", meaning: "Guidance or advice" }
    },
    9: {
      0: { label: "Center", meaning: "The core situation" },
      1: { label: "Top", meaning: "Goals and aspirations" },
      2: { label: "Bottom", meaning: "Foundation and roots" },
      3: { label: "Left", meaning: "Past influences" },
      4: { label: "Right", meaning: "Future influences" },
      5: { label: "Top-Left", meaning: "External influences" },
      6: { label: "Top-Right", meaning: "Hopes and fears" },
      7: { label: "Bottom-Left", meaning: "Internal state" },
      8: { label: "Bottom-Right", meaning: "Final outcome" }
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
  onShare 
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
        <div className="grid grid-cols-4 gap-2 max-w-4xl mx-auto">
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
        <div className={`flex flex-wrap justify-center gap-4 ${
          reading.layoutType === 9 ? 'max-w-6xl' : 'max-w-2xl'
        }`}>
          {reading.cards.map((readingCard, index) => {
            const card = getCardById(allCards, readingCard.id)
            if (!card) return null

            const positionInfo = getPositionInfo(index, reading.layoutType)

            return (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className="text-center">
                  <Badge variant="outline" className="text-xs">
                    {positionInfo.label}
                  </Badge>
                </div>
                <Card
                  card={card}
                  reversed={readingCard.reversed}
                  size="md"
                  onClick={() => setSelectedCard({ card, reversed: readingCard.reversed })}
                />
                <div className="text-xs text-center text-gray-600 max-w-32">
                  {positionInfo.meaning}
                </div>
              </div>
            )
          })}
        </div>
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Reading Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{reading.title}</h2>
        {reading.question && (
          <p className="text-gray-600 italic">"{reading.question}"</p>
        )}
        <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(reading.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            Anonymous
          </div>
          <Badge variant="secondary">
            {reading.layoutType} Cards
          </Badge>
        </div>
      </div>

      {/* Share Button */}
      {showShareButton && onShare && (
        <div className="flex justify-center">
          <Button onClick={onShare} variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share Reading
          </Button>
        </div>
      )}

      {/* Cards Layout */}
      <div className="py-6">
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
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-3">Card Combinations</h3>
          <div className="space-y-2">
            {(() => {
              const readingCard = reading.cards.find(c => c.id === selectedCard.card.id)
              if (!readingCard) return null

              const adjacentCards = getAdjacentCards(readingCard)
              
              return adjacentCards.map((adjCard, index) => {
                const card = getCardById(allCards, adjCard.id)
                if (!card) return null

                const combination = getCombinationMeaning(selectedCard.card, card)

                return (
                  <div key={index} className="flex items-center gap-3 p-2 bg-white rounded">
                    <div className="flex items-center gap-2">
                      <Card card={selectedCard.card} size="sm" />
                      <span className="text-gray-500">+</span>
                      <Card card={card} size="sm" />
                    </div>
                    <div className="flex-1 text-sm">
                      {combination || 'Standard combination meaning'}
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