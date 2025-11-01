"use client"

import { useState, useEffect } from 'react'
import { Card as CardType } from '@/lib/types'
import { Card } from './Card'
import { Button } from '@/components/ui/button'
import { Shuffle, Play } from 'lucide-react'

interface DeckProps {
  cards: CardType[]
  onDraw?: (cards: CardType[]) => void
  drawCount?: number
  allowReversed?: boolean
  showAnimation?: boolean
}

export function Deck({ 
  cards, 
  onDraw, 
  drawCount = 3, 
  allowReversed = false,
  showAnimation = true 
}: DeckProps) {
  const [deck, setDeck] = useState<CardType[]>(cards)
  const [isShuffling, setIsShuffling] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawnCards, setDrawnCards] = useState<Array<{card: CardType, reversed: boolean}>>([])

  useEffect(() => {
    setDeck(cards)
    setDrawnCards([])
  }, [cards])

  const shuffle = () => {
    setIsShuffling(true)
    
    // Fisher-Yates shuffle algorithm
    const shuffled = [...deck]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    
    setDeck(shuffled)
    
    setTimeout(() => {
      setIsShuffling(false)
    }, 500)
  }

  const drawCards = () => {
    if (deck.length < drawCount) {
      return
    }

    setIsDrawing(true)
    
    const newDrawnCards = []
    const remainingDeck = [...deck]
    
    for (let i = 0; i < drawCount; i++) {
      const randomIndex = Math.floor(Math.random() * remainingDeck.length)
      const drawnCard = remainingDeck.splice(randomIndex, 1)[0]
      const reversed = allowReversed && Math.random() < 0.5
      
      newDrawnCards.push({
        card: drawnCard,
        reversed
      })
    }
    
    setDeck(remainingDeck)
    setDrawnCards(newDrawnCards)
    
    setTimeout(() => {
      setIsDrawing(false)
      if (onDraw) {
        onDraw(newDrawnCards.map(item => item.card))
      }
    }, 1000)
  }

  const reset = () => {
    setDeck(cards)
    setDrawnCards([])
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex gap-3 justify-center">
        <Button
          onClick={shuffle}
          disabled={isShuffling || deck.length < drawCount}
          variant="outline"
          size="sm"
        >
          <Shuffle className={`w-4 h-4 mr-2 ${isShuffling ? 'animate-spin' : ''}`} />
          Shuffle
        </Button>
        
        <Button
          onClick={drawCards}
          disabled={isDrawing || deck.length < drawCount}
          size="sm"
        >
          <Play className={`w-4 h-4 mr-2 ${isDrawing ? 'animate-pulse' : ''}`} />
          Draw {drawCount} Cards
        </Button>
        
        {drawnCards.length > 0 && (
          <Button
            onClick={reset}
            variant="outline"
            size="sm"
          >
            Reset
          </Button>
        )}
      </div>

      {/* Deck Display */}
      <div className="flex justify-center">
        <div className="relative">
          {/* Stack effect for remaining cards */}
          {deck.length > 0 && (
            <div className="relative">
              {deck.slice(-3).map((card, index) => (
                <div
                  key={card.id}
                  className="absolute"
                  style={{
                    top: `${index * 2}px`,
                    left: `${index * 2}px`,
                    zIndex: index,
                  }}
                >
                  <Card
                    card={card}
                    showBack={true}
                    size="md"
                    className="cursor-default"
                  />
                </div>
              ))}
              <div className="relative">
                <Card
                  card={deck[deck.length - 1]}
                  showBack={true}
                  size="md"
                  className="cursor-default"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white/90 px-2 py-1 rounded text-sm font-bold">
                    {deck.length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Drawn Cards */}
      {drawnCards.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center">Drawn Cards</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {drawnCards.map((item, index) => (
              <div
                key={`${item.card.id}-${index}`}
                className={`transform transition-all duration-500 ${
                  showAnimation ? 'animate-in slide-in-from-bottom' : ''
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <Card
                  card={item.card}
                  reversed={item.reversed}
                  size="lg"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status */}
      <div className="text-center text-sm text-gray-600">
        {deck.length === 0 && drawnCards.length === 0 && (
          <p>No cards in deck</p>
        )}
        {deck.length > 0 && drawnCards.length === 0 && (
          <p>Ready to draw {drawCount} cards from {deck.length} remaining</p>
        )}
        {drawnCards.length > 0 && (
          <p>Drew {drawnCards.length} cards • {deck.length} remaining</p>
        )}
      </div>
    </div>
  )
}