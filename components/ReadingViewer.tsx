"use client"

import { useState } from 'react'
import { Reading, ReadingCard, Card as CardType } from '@/lib/types'
import { getCardById, getCombinationMeaning, getLinearAdjacentCards, getGrandTableauAdjacentCards } from '@/lib/data'
import { Card } from './Card'
import { AnimatedCard } from './AnimatedCard'
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
  threeCardSpreadType?: string
}

interface PositionInfo {
  label: string
  meaning: string
}

const getPositionInfo = (position: number, layoutType: number, threeCardSpreadType?: string): PositionInfo => {
  // Handle different 3-card spread types
  if (layoutType === 3 && threeCardSpreadType) {
    const threeCardPositions: Record<string, Record<number, PositionInfo>> = {
      "past-present-future": {
        0: { label: "Past", meaning: "Influences from your past that shaped your current situation" },
        1: { label: "Present", meaning: "Your current circumstances and immediate challenges" },
        2: { label: "Future", meaning: "Potential outcome based on your current path" }
      },
      "situation-challenge-advice": {
        0: { label: "Situation", meaning: "The current situation or question you face" },
        1: { label: "Challenge", meaning: "Obstacles or difficulties you may encounter" },
        2: { label: "Advice", meaning: "Guidance for how to proceed" }
      },
      "mind-body-spirit": {
        0: { label: "Mind", meaning: "Thoughts, mental state, and intellectual matters" },
        1: { label: "Body", meaning: "Physical health, actions, and material concerns" },
        2: { label: "Spirit", meaning: "Emotional well-being, spiritual growth, and inner wisdom" }
      },
      "yes-no-maybe": {
        0: { label: "Yes", meaning: "Positive influences and supporting factors" },
        1: { label: "No", meaning: "Negative influences and opposing factors" },
        2: { label: "Maybe", meaning: "Neutral factors and possibilities to consider" }
      },
      "general-reading": {
        0: { label: "Card 1", meaning: "First element of your reading" },
        1: { label: "Card 2", meaning: "Second element of your reading" },
        2: { label: "Card 3", meaning: "Third element of your reading" }
      }
    }

    if (threeCardPositions[threeCardSpreadType]) {
      return threeCardPositions[threeCardSpreadType][position] || { label: `Position ${position + 1}`, meaning: "" }
    }
  }

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
       0: { label: "Recent Past - Inner World", meaning: "Thoughts, feelings, and personal resources from your recent past that influence your current situation" },
       1: { label: "Recent Past - Direct Actions", meaning: "Actions you took recently that shaped your current circumstances" },
       2: { label: "Recent Past - Outside World", meaning: "External influences and events from your recent past" },
       3: { label: "Present - Inner World", meaning: "Your current thoughts, feelings, and internal state" },
       4: { label: "Present - Direct Actions", meaning: "Your current actions and the central issue you're facing" },
       5: { label: "Present - Outside World", meaning: "Current external influences, other people, and environmental factors" },
       6: { label: "Near Future - Inner World", meaning: "How your thoughts and feelings will evolve in the near future" },
       7: { label: "Near Future - Direct Actions", meaning: "Actions you'll need to take in the near future" },
       8: { label: "Near Future - Outside World", meaning: "External events and influences approaching in the near future" }
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
  showReadingHeader = true,
  threeCardSpreadType
}: ReadingViewerProps) {
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null)

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
              <AnimatedCard key={index} delay={index * 0.05} className="flex flex-col items-center space-y-1">
                 <div className="text-xs text-center text-muted-foreground/80 font-medium">
                   {position.label}
                 </div>
                  <Card
                    card={card}
                    size="sm"
                    onClick={() => setSelectedCard(card)}
                  />
               </AnimatedCard>
             )
          })}
        </div>
      )
    } else if (reading.layoutType === 9) {
      // 9-card spread: 3x3 grid layout
      return (
        <div className="grid grid-cols-3 gap-4 mx-auto max-w-4xl">
          {reading.cards.map((readingCard, index) => {
            const card = getCardById(allCards, readingCard.id)
            if (!card) return null

            const positionInfo = getPositionInfo(index, reading.layoutType, threeCardSpreadType)

            return (
              <AnimatedCard key={index} delay={index * 0.08} className="flex flex-col items-center space-y-3">
                <TooltipProvider>
                  <div className="flex flex-col items-center space-y-3">
                    <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center space-y-2">
                         <div className="text-sm font-medium text-muted-foreground/90 bg-card/60 px-3 py-1 rounded-full border border-primary/30 backdrop-blur-sm">
                           {positionInfo.label}
                         </div>
                         <Card
                           card={card}
                           size="md"
                           onClick={() => setSelectedCard(card)}
                           className="cursor-pointer hover:shadow-lg"
                         />
                      </div>
                    </TooltipTrigger>
                     <TooltipContent className="max-w-xs bg-card/95 border-primary/30 text-muted-foreground backdrop-blur-sm">
                       <div className="space-y-2">
                         <p className="font-semibold text-muted-foreground">{positionInfo.label}</p>
                         <p className="text-sm text-muted-foreground/80">{positionInfo.meaning}</p>
                         <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
                           <Info className="w-3 h-3" />
                           <span>Click card for details</span>
                         </div>
                       </div>
                     </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              </AnimatedCard>
            )
          })}
        </div>
      )
    } else {
      // Linear layouts (3, 5 cards)
      return (
        <div className={`grid gap-4 mx-auto ${
          reading.layoutType === 3 ? 'grid-cols-1 sm:grid-cols-3 max-w-4xl' :
          reading.layoutType === 5 ? 'grid-cols-1 sm:grid-cols-3 md:grid-cols-5 max-w-6xl' :
          'grid-cols-1 sm:grid-cols-3 max-w-6xl'
        }`}>
          {reading.cards.map((readingCard, index) => {
            const card = getCardById(allCards, readingCard.id)
            if (!card) return null

            const positionInfo = getPositionInfo(index, reading.layoutType, threeCardSpreadType)

            return (
              <AnimatedCard key={index} delay={index * 0.08} className="flex flex-col items-center space-y-3">
                <TooltipProvider>
                  <div className="flex flex-col items-center space-y-3">
                    <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center space-y-2">
                         <div className="text-sm font-medium text-muted-foreground/90 bg-card/60 px-3 py-1 rounded-full border border-primary/30 backdrop-blur-sm">
                           {positionInfo.label}
                         </div>
                         <Card
                           card={card}
                           size="md"
                           onClick={() => setSelectedCard(card)}
                           className="cursor-pointer hover:shadow-lg"
                         />
                      </div>
                    </TooltipTrigger>
                     <TooltipContent className="max-w-xs bg-card/95 border-primary/30 text-muted-foreground backdrop-blur-sm">
                       <div className="space-y-2">
                         <p className="font-semibold text-muted-foreground">{positionInfo.label}</p>
                         <p className="text-sm text-muted-foreground/80">{positionInfo.meaning}</p>
                         <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
                           <Info className="w-3 h-3" />
                           <span>Click card for details</span>
                         </div>
                       </div>
                     </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              </AnimatedCard>
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
           <h2 className="text-3xl font-bold text-foreground relative">
             {reading.title}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-primary to-primary/80 rounded-full"></div>
           </h2>
           {reading.question && reading.question !== reading.title && (
              <p className="text-muted-foreground/80 italic text-lg mt-4">&ldquo;{reading.question}&rdquo;</p>
           )}
           <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground/70 mt-4">
             <div className="flex items-center gap-2">
               <Calendar className="w-4 h-4 text-primary" />
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
           <Button onClick={onShare} variant="outline" size="sm" className="border-primary/30 text-muted-foreground hover:bg-muted/50 hover:border-primary/60 backdrop-blur-sm">
             <Share2 className="w-4 h-4 mr-2" />
             Share Wisdom
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
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}

      {/* Combinations Panel */}
      {selectedCard && (
          <div className="mt-6 p-6 bg-gradient-to-br from-card/60 via-muted/20 to-background/40 rounded-xl slide-in-up border border-primary/20 backdrop-blur-sm">
           <div className="flex items-center gap-2 mb-4">
             <h3 className="font-semibold text-lg text-foreground">Card Combinations</h3>
             <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
               <Info className="w-3 h-3" />
               <span>How this card interacts with nearby cards</span>
             </div>
           </div>
          <div className="space-y-3">
            {(() => {
              const readingCard = reading.cards.find(c => c.id === selectedCard.id)
              if (!readingCard) return null

              const adjacentCards = getAdjacentCards(readingCard)
              
              if (adjacentCards.length === 0) {
                return (
                   <div className="text-center py-8 text-muted-foreground/60">
                     <p className="mb-2 italic">No adjacent cards in this layout</p>
                     <p className="text-sm">In larger spreads, this card would interact with nearby cards</p>
                   </div>
                )
              }
              
              return adjacentCards.map((adjCard, index) => {
                const card = getCardById(allCards, adjCard.id)
                if (!card) return null

                 const combination = getCombinationMeaning(selectedCard, card, readingCard.position, adjCard.position)

                return (
                   <div key={index} className="flex items-center gap-4 p-4 bg-card/40 rounded-lg border border-primary/20 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 backdrop-blur-sm">
                     <div className="flex items-center gap-3">
                        <Card card={selectedCard} size="sm" />
                       <span className="text-primary font-medium text-lg">+</span>
                       <Card card={card} size="sm" />
                     </div>
                     <div className="flex-1">
                       <div className="font-medium text-muted-foreground mb-1">
                          {selectedCard.name} + {card.name}
                       </div>
                       <div className="text-sm text-muted-foreground/80">
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