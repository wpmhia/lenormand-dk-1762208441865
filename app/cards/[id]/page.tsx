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
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!card) {
    notFound()
    return null
  }

  const combos = Array.isArray(card.combos) ? card.combos : []

  const getCardName = (cardId: number) => {
    const foundCard = allCards.find(c => c.id === cardId)
    return foundCard?.name || `Card ${cardId}`
  }

  const currentIndex = allCards.findIndex(c => c.id === card.id)
  const previousCard = currentIndex > 0 ? allCards[currentIndex - 1] : null
  const nextCard = currentIndex < allCards.length - 1 ? allCards[currentIndex + 1] : null

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/cards">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cards
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          {previousCard && (
            <Link href={`/cards/${previousCard.id}`}>
              <Button variant="outline" size="sm">
                ← {previousCard.name}
              </Button>
            </Link>
          )}
          <Badge className="bg-purple-600/20 text-purple-200 border-purple-500/30" variant="secondary">
            {card.id} / 36
          </Badge>
          {nextCard && (
            <Link href={`/cards/${nextCard.id}`}>
              <Button variant="outline" size="sm">
                {nextCard.name} →
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Card Header */}
      <div className="text-center mb-8">
        <div className="inline-block mb-4">
          <div className="w-48 h-72 card-mystical rounded-xl shadow-2xl overflow-hidden relative mystical-glow border border-purple-500/30">
            <img
              src={card.imageUrl || ''}
              alt={card.name}
              className="w-full h-full object-contain bg-white"
            />
          </div>
        </div>
        <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mystical-glow">{card.name}</h1>
        <p className="text-purple-300 text-lg">Lenormand Card #{card.id}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Keywords */}
          <Card>
            <CardHeader>
              <CardTitle>Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {card.keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upright Meaning */}
          <Card>
            <CardHeader>
              <CardTitle>Upright Meaning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {card.uprightMeaning}
              </p>
            </CardContent>
          </Card>

          {/* Reversed Meaning */}
          {card.reversedMeaning && (
            <Card>
              <CardHeader>
                <CardTitle>Reversed Meaning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {card.reversedMeaning}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Combinations */}
          {combos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Card Combinations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {combos.map((combo, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-16 bg-white border border-gray-300 rounded flex items-center justify-center text-xs font-bold">
                          {combo.withCardId}
                        </div>
                        <div className="text-xs text-center mt-1 font-medium">
                          {getCardName(combo.withCardId)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm mb-1">
                          {card.name} + {getCardName(combo.withCardId)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {combo.meaning}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/read/new">
                <Button className="w-full">
                  New Reading with this Card
                </Button>
              </Link>
              <Link href="/cards">
                <Button variant="outline" className="w-full">
                  Browse All Cards
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card Info */}
          <Card>
            <CardHeader>
              <CardTitle>Card Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Card Number:</span>
                <span className="font-medium">{card.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sequence:</span>
                <span className="font-medium">{card.number}</span>
              </div>
              <Separator />
              <div className="pt-2">
                <p className="text-gray-600 mb-2">In traditional Lenormand:</p>
                <p className="text-xs">
                  This card is part of traditional 36-card Lenormand deck,
                  used for divination and cartomancy since 19th century.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Related Cards */}
          <Card>
            <CardHeader>
              <CardTitle>Related Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {combos.slice(0, 5).map((combo, index: number) => (
                  <Link
                    key={index}
                    href={`/cards/${combo.withCardId}`}
                    className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-12 bg-white border border-gray-300 rounded flex items-center justify-center text-xs font-bold">
                      {combo.withCardId}
                    </div>
                    <span className="text-sm">{getCardName(combo.withCardId)}</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}