"use client"

import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'
import { Card as CardType } from '@/lib/types'
import { getCards, getCardById } from '@/lib/data'

interface PageProps {
  params: {
    id: string
  }
}

export default function CardDetailPage({ params }: PageProps) {
  const [card, setCard] = useState<CardType | null>(null)
  const [allCards, setAllCards] = useState<CardType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const cardId = parseInt(params.id)
        if (isNaN(cardId)) {
          notFound()
          return
        }

        const cardsData = await getCards()
        const cardData = getCardById(cardsData, cardId)

        if (!cardData) {
          notFound()
          return
        }

        setAllCards(cardsData)
        setCard(cardData)
    } catch (error) {
      console.error('Error loading card:', error)
      notFound()
      return
    } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.id])

  if (loading) {
    return (
      <div className="page-layout">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-amber-900">Loading card...</div>
        </div>
      </div>
    )
  }

  if (!card) {
    return (
      <div className="page-layout">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-amber-900">Card not found</div>
        </div>
      </div>
    )
  }

  const cardIndex = allCards.findIndex(c => c.id === card.id)
  const previousCard = cardIndex > 0 ? allCards[cardIndex - 1] : null
  const nextCard = cardIndex < allCards.length - 1 ? allCards[cardIndex + 1] : null
  const combos = card.combos || []
  const getCardName = (id: number) => allCards.find(c => c.id === id)?.name || `Card ${id}`

  return (
    <div className="page-layout">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-amber-900">{card.name}</h1>
          <p className="text-amber-700">Card #{card.id}</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader>
              <CardTitle className="text-amber-900">Upright Meaning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-900 leading-relaxed">
                {card.uprightMeaning}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}