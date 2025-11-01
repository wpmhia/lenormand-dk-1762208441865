"use client"

import { useState } from 'react'
import { Card as CardType, CardCombo } from '@/lib/types'
import { cn } from '@/lib/utils'
import { CardModal } from './CardModal'

interface CardProps {
  card: CardType
  reversed?: boolean
  onClick?: () => void
  showBack?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Card({ 
  card, 
  reversed = false, 
  onClick, 
  showBack = false, 
  size = 'md',
  className 
}: CardProps) {
  const [showModal, setShowModal] = useState(false)

  const getCardSymbol = (cardName: string): string => {
    const symbols: Record<string, string> = {
      'Rider': '🏇',
      'Clover': '🍀',
      'Ship': '⛵',
      'House': '🏠',
      'Tree': '🌳',
      'Clouds': '☁️',
      'Snake': '🐍',
      'Coffin': '⚰️',
      'Bouquet': '💐',
      'Scythe': '🔪',
      'Whip': '🪢',
      'Birds': '🐦',
      'Child': '👶',
      'Fox': '🦊',
      'Bear': '🐻',
      'Stars': '⭐',
      'Stork': '🦢',
      'Dog': '🐕',
      'Tower': '🏰',
      'Garden': '🌺',
      'Mountain': '⛰️',
      'Paths': '🛤️',
      'Mice': '🐭',
      'Heart': '❤️',
      'Ring': '💍',
      'Book': '📖',
      'Letter': '📧',
      'Gentleman': '👨',
      'Lady': '👩',
      'Lilies': '🌺',
      'Sun': '☀️',
      'Moon': '🌙',
      'Key': '🔑',
      'Fish': '🐟',
      'Anchor': '⚓',
      'Cross': '✝️'
    }
    return symbols[cardName] || '✦'
  }

  const getCardColor = (cardId: number): string => {
    const colors = [
      'from-blue-400 to-blue-600', 'from-green-400 to-green-600', 'from-teal-400 to-teal-600',
      'from-purple-400 to-purple-600', 'from-pink-400 to-pink-600', 'from-red-400 to-red-600',
      'from-orange-400 to-orange-600', 'from-yellow-400 to-yellow-600', 'from-indigo-400 to-indigo-600'
    ]
    return colors[cardId % colors.length]
  }

  const handleCardClick = () => {
    if (onClick) {
      onClick()
    } else {
      setShowModal(true)
    }
  }

  const sizeClasses = {
    sm: 'w-16 h-24 text-xs',
    md: 'w-20 h-28 text-sm',
    lg: 'w-24 h-32 text-base'
  }

  if (showBack) {
    return (
      <div
        className={cn(
          'relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-lg cursor-pointer transform transition-all duration-200 hover:scale-105 flex items-center justify-center border border-slate-700',
          sizeClasses[size],
          className
        )}
        onClick={handleCardClick}
      >
        <div className="text-white text-center">
          <div className="text-3xl mb-1 opacity-80">✦</div>
          <div className="text-xs font-semibold tracking-wider opacity-90">LENORMAND</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        className={cn(
          'relative bg-white border-2 border-gray-300 rounded-lg shadow-lg cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl overflow-hidden',
          sizeClasses[size],
          reversed && 'rotate-180',
          className
        )}
        onClick={handleCardClick}
      >
        {/* Card Image */}
        <div className="relative w-full h-full">
          <img
            src={card.imageUrl || ''}
            alt={card.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to colored background if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent && !parent.querySelector('.fallback-content')) {
                const fallback = document.createElement('div');
                fallback.className = 'fallback-content absolute inset-0 bg-gradient-to-br from-indigo-400 to-indigo-600 flex flex-col items-center justify-center text-white p-2';
                fallback.innerHTML = `
                  <div class="text-2xl mb-1">${getCardSymbol(card.name)}</div>
                  <div class="text-xs font-bold text-center text-white/95 leading-tight">${card.name}</div>
                `;
                parent.appendChild(fallback);
              }
            }}
          />
          
          {/* Card Number Overlay */}
          <div className="absolute top-1 left-1 bg-white/90 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-gray-800 border border-gray-300">
            {card.id}
          </div>
          
          {/* Card Name Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1">
            <div className="text-xs font-bold text-white text-center truncate">
              {card.name}
            </div>
          </div>
        </div>
        
        {reversed && (
          <div className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
            R
          </div>
        )}
      </div>

      {showModal && (
        <CardModal
          card={card}
          reversed={reversed}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}