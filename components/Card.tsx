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
    sm: 'w-20 h-32 text-xs',
    md: 'w-28 h-40 text-sm',
    lg: 'w-36 h-52 text-base'
  }

  if (showBack) {
    return (
      <div
        className={cn(
          'relative card-mystical rounded-xl shadow-2xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-3xl flex items-center justify-center border border-purple-500/30 mystical-glow float-animation',
          sizeClasses[size],
          className
        )}
        onClick={handleCardClick}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-blue-900/80 to-slate-900/80 shimmer"></div>
        <div className="relative text-white text-center z-10">
          <div className="text-4xl mb-2 opacity-90 mystical-glow">✦</div>
          <div className="text-sm font-bold tracking-wider opacity-90 text-purple-200">LENORMAND</div>
          <div className="text-xs text-purple-300 mt-1 opacity-70">MYSTICAL DIVINATION</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        className={cn(
          'relative card-mystical rounded-xl shadow-2xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-3xl overflow-hidden mystical-glow',
          sizeClasses[size],
          reversed && 'rotate-180',
          className
        )}
        onClick={handleCardClick}
      >
        {/* Card Image */}
        <div className="relative w-full h-full rounded-lg overflow-hidden bg-white">
          <img
            src={card.imageUrl || ''}
            alt={card.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback to mystical background if image fails to load
              const target = e.target as HTMLImageElement;
              if (target.style.display !== 'none') {
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent && !parent.querySelector('.fallback-content')) {
                  const fallback = document.createElement('div');
                  fallback.className = 'fallback-content absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-sm flex flex-col items-center justify-center text-white p-4 border border-purple-500/30 rounded-lg';
                  fallback.innerHTML = `
                    <div class="text-3xl mb-2">${getCardSymbol(card.name)}</div>
                    <div class="text-sm font-bold text-center text-white/95">${card.name}</div>
                    <div class="text-xs text-white/70 mt-1">#${card.id}</div>
                  `;
                  parent.appendChild(fallback);
                }
              }
            }}
          />
          
          {/* Mystical Card Number */}
          <div className="absolute top-2 left-2 bg-purple-600/80 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold text-white border border-purple-400/50 shadow-lg">
            {card.id}
          </div>
          
          {/* Card Name Banner */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-2 backdrop-blur-sm">
            <div className="text-sm font-bold text-white text-center tracking-wide">
              {card.name}
            </div>
          </div>
        </div>
        
        {/* Reversed Indicator */}
        {reversed && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-sm font-bold rounded-full w-7 h-7 flex items-center justify-center border-2 border-white shadow-lg mystical-glow">
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