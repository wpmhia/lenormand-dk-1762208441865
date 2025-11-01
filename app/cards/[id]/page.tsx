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
      <div className="min-h-screen bg-slate-950">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-slate-300">Loading card...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/cards">
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cards
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:bg-slate-800">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {previousCard && (
            <Link href={`/cards/${previousCard.id}`}>
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                ← {previousCard.name}
              </Button>
            </Link>
          )}
          <Badge className="bg-slate-800 text-slate-200 border-slate-700" variant="secondary">
            {card.id} / 36
          </Badge>
          {nextCard && (
            <Link href={`/cards/${nextCard.id}`}>
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                {nextCard.name} →
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Card Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 text-white">{card.name}</h1>
        <p className="text-slate-400">Card #{card.id}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Keywords */}
          <Card className="border-slate-700 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-white">Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {card.keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="bg-slate-700 text-slate-200">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upright Meaning */}
          <Card className="border-slate-700 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-white">Upright Meaning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 leading-relaxed">
                {card.uprightMeaning}
              </p>
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
            <Card className="border-slate-700 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white">Reversed Meaning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 leading-relaxed">
                  {card.reversedMeaning}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Combinations */}
          {combos.length > 0 && (
            <Card className="border-slate-700 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white">Card Combinations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {combos.map((combo, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-16 bg-slate-700 border border-slate-600 rounded flex items-center justify-center text-xs font-bold text-white">
                          {combo.withCardId}
                        </div>
                        <div className="text-xs text-center mt-1 font-medium text-slate-300">
                          {getCardName(combo.withCardId)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm mb-1 text-white">
                          {card.name} + {getCardName(combo.withCardId)}
                        </div>
                        <div className="text-sm text-slate-300">
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
          <Card className="border-slate-700 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/read/new">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  New Reading with this Card
                </Button>
              </Link>
              <Link href="/cards">
                <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-800">
                  Browse All Cards
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card Info */}
          <Card className="border-slate-700 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-white">Card Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Card Number:</span>
                <span className="font-medium text-white">{card.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sequence:</span>
                <span className="font-medium text-white">{card.number}</span>
              </div>
              <Separator className="bg-slate-700" />
              <div className="pt-2">
                <p className="text-slate-400 mb-2">In traditional Lenormand:</p>
                <p className="text-xs text-slate-300">
                  This card is part of traditional 36-card Lenormand deck,
                  used for divination and cartomancy since 19th century.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Related Cards */}
          <Card className="border-slate-700 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-white">Related Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {combos.slice(0, 5).map((combo, index: number) => (
                  <Link
                    key={index}
                    href={`/cards/${combo.withCardId}`}
                    className="flex items-center gap-2 p-2 rounded hover:bg-slate-800 transition-colors"
                  >
                    <div className="w-8 h-12 bg-slate-700 border border-slate-600 rounded flex items-center justify-center text-xs font-bold text-white">
                      {combo.withCardId}
                    </div>
                    <span className="text-sm text-slate-300">{getCardName(combo.withCardId)}</span>
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