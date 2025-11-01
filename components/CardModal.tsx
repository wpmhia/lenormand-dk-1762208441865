"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card as CardType } from '@/lib/types'
import { X } from 'lucide-react'

interface CardModalProps {
  card: CardType
  reversed?: boolean
  onClose: () => void
}

export function CardModal({ card, reversed = false, onClose }: CardModalProps) {
  const combos = Array.isArray(card.combos) ? card.combos : []

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
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
        </DialogHeader>

        <div className="space-y-6">
          {/* Card Image */}
          <div className="flex justify-center">
            <div className="relative w-48 h-64 bg-white border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden">
              <img
                src={card.imageUrl || ''}
                alt={card.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector('.fallback-content')) {
                    const fallback = document.createElement('div');
                    fallback.className = 'fallback-content absolute inset-0 bg-gradient-to-br from-indigo-400 to-indigo-600 flex flex-col items-center justify-center text-white p-4';
                    fallback.innerHTML = `
                      <div class="text-4xl mb-2">✦</div>
                      <div class="text-lg font-bold text-center">${card.name}</div>
                    `;
                    parent.appendChild(fallback);
                  }
                }}
              />
              {reversed && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                  R
                </div>
              )}
            </div>
          </div>

          {/* Keywords */}
          <div>
            <h3 className="font-semibold mb-2">Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {card.keywords.map((keyword, index) => (
                <Badge key={index} variant="secondary">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Meaning */}
          <div>
            <h3 className="font-semibold mb-2">
              {reversed ? 'Reversed Meaning' : 'Upright Meaning'}
            </h3>
            <p className="text-gray-700">
              {reversed && card.reversedMeaning 
                ? card.reversedMeaning 
                : card.uprightMeaning
              }
            </p>
          </div>

          {/* Combinations */}
          {combos.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Card Combinations</h3>
                <div className="space-y-2">
                  {combos.map((combo: any, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-12 h-16 bg-white border border-gray-300 rounded flex items-center justify-center text-xs font-bold">
                        {combo.withCardId}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          Card {combo.withCardId}
                        </div>
                        <div className="text-sm text-gray-600">
                          {combo.meaning}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Card Info */}
          <Separator />
          <div className="text-sm text-gray-500">
            <div>Card Number: {card.number}</div>
            <div>Lenormand Card #{card.id} of 36</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}