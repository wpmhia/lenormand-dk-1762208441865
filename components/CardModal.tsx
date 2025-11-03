"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card as CardType } from '@/lib/types'
import { getCards } from '@/lib/data'
import { X } from 'lucide-react'

interface CardModalProps {
  card: CardType
  reversed?: boolean
  onClose: () => void
}

export function CardModal({ card, reversed = false, onClose }: CardModalProps) {
  const combos = Array.isArray(card.combos) ? card.combos : []
  const [allCards, setAllCards] = useState<any[]>([])

  useEffect(() => {
    getCards().then(setAllCards)
  }, [])

  return (
    <Dialog open={true} onOpenChange={(isOpen) => {
      if (!isOpen) {
        onClose()
      }
    }}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl font-bold">{card.id}.</span>
              <span className="text-xl">{card.name}</span>
              {reversed && (
                <Badge variant="destructive">Reversed</Badge>
              )}
            </DialogTitle>
            <button
              onClick={onClose}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          <DialogDescription>
            Detailed information about the {card.name} Lenormand card
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card Image */}
          <div className="flex justify-center md:justify-start">
            <div className="relative w-56 h-72 card-mystical rounded-xl shadow-2xl overflow-hidden border border-purple-500/30">
              <img
                src={card.imageUrl || ''}
                alt={card.name}
                className="w-full h-full object-contain bg-white"
              />
              {reversed && (
                <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center border-2 border-white shadow-lg">
                  R
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Keywords */}
            <div>
              <h3 className="font-semibold mb-2 text-white">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {card.keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="bg-slate-700 text-slate-200">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator className="bg-slate-700" />

            {/* Meaning */}
            <div>
              <h3 className="font-semibold mb-2 text-white">
                {reversed ? 'Reversed Meaning' : 'Upright Meaning'}
              </h3>
              <p className="text-slate-300">
                {reversed && card.reversedMeaning
                  ? card.reversedMeaning
                  : card.uprightMeaning
                }
              </p>
            </div>

            {/* Combinations */}
            {combos.length > 0 && (
              <>
                <Separator className="bg-slate-700" />
                <div>
                  <h3 className="font-semibold mb-3 text-white">Card Combinations</h3>
                  <div className="space-y-2">
                    {combos.map((combo: any, index: number) => {
                      const comboCard = allCards.find(c => c.id === combo.withCardId)
                      return (
                        <div key={index} className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg">
                          <div className="flex-shrink-0 w-12 h-16 bg-white border border-slate-600 rounded overflow-hidden">
                            {comboCard && (
                              <img
                                src={comboCard.imageUrl || ''}
                                alt={comboCard.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm text-white">
                              {comboCard ? comboCard.name : `Card ${combo.withCardId}`}
                            </div>
                            <div className="text-sm text-slate-300">
                              {combo.meaning}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Card Info */}
            <Separator className="bg-slate-700" />
            <div className="text-sm text-slate-400">
              <div>Card Number: {card.number}</div>
              <div>Lenormand Card #{card.id} of 36</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}