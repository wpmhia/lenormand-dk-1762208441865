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
           'relative card-mystical rounded-xl shadow-2xl cursor-pointer transform transition-all duration-600 hover:scale-110 hover:shadow-3xl hover:rotate-1 flex items-center justify-center border border-purple-500/40 mystical-glow float-animation group focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900',
          sizeClasses[size],
          className
        )}
        onClick={handleCardClick}
        onMouseEnter={() => {
          // Soft bell at 432 Hz, 80 ms, −18 dB - felt, not heard
          // Implementation: playGentleBell()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleCardClick()
          }
        }}
        tabIndex={0}
        role="button"
        aria-label="Lenormand card back. Click to draw or select card"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-blue-900/90 to-slate-900/90 shimmer rounded-xl"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
        <div className="relative text-white text-center z-10 transform group-hover:scale-105 transition-transform duration-300">
          <div className="text-4xl mb-2 opacity-90 mystical-glow animate-pulse">✦</div>
          <div className="text-sm font-bold tracking-wider opacity-90 text-purple-200 group-hover:text-purple-100 transition-colors duration-300">LENORMAND</div>
          <div className="text-xs text-purple-300 mt-1 opacity-70 group-hover:opacity-90 transition-opacity duration-300">MYSTICAL DIVINATION</div>
        </div>
        <div className="absolute inset-0 rounded-xl ring-2 ring-purple-500/20 group-hover:ring-purple-400/60 transition-all duration-300"></div>
      </div>
    )
  }

  return (
    <>
      <div
        className={cn(
          'relative card-mystical rounded-xl shadow-2xl cursor-pointer transform transition-all duration-400 hover:scale-105 hover:shadow-3xl overflow-hidden mystical-glow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900',
          sizeClasses[size],
          reversed && 'rotate-180',
          className
        )}
        onClick={handleCardClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleCardClick()
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`${card.name} card${reversed ? ' (reversed)' : ''}. Click to ${onClick ? 'select' : 'view details'}`}
      >
        {/* Card Image */}
        <div className="relative w-full h-3/4 rounded-t-lg overflow-hidden bg-white">
          <img
            src={card.imageUrl || ''}
            alt={card.name}
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Card Name and Number */}
        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-slate-800 to-slate-700 rounded-b-lg flex flex-col items-center justify-center text-white">
          <div className="text-xs font-bold text-center leading-tight">
            {card.name}
          </div>
          <div className="text-xs text-slate-300">
            #{card.id}
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