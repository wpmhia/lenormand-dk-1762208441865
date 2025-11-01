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
          'relative bg-gradient-to-br from-indigo-600 to-purple-700 rounded-lg shadow-lg cursor-pointer transform transition-all duration-200 hover:scale-105 flex items-center justify-center',
          sizeClasses[size],
          className
        )}
        onClick={handleCardClick}
      >
        <div className="text-white font-bold text-center">
          <div className="text-2xl mb-1">✦</div>
          <div>Lenormand</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        className={cn(
          'relative bg-white border-2 border-gray-300 rounded-lg shadow-lg cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl',
          sizeClasses[size],
          reversed && 'rotate-180',
          className
        )}
        onClick={handleCardClick}
      >
        <div className="absolute top-1 left-1 font-bold text-gray-700">
          {card.id}
        </div>
        <div className="flex flex-col items-center justify-center h-full p-2">
          <div className="text-lg font-bold text-center mb-1">
            {card.name}
          </div>
          <div className="text-xs text-gray-600 text-center">
            {card.keywords.slice(0, 2).join(', ')}
          </div>
        </div>
        {reversed && (
          <div className="absolute bottom-1 right-1 text-xs text-red-500 font-bold">
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