import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'
import { prisma } from '@/lib/db'

interface PageProps {
  params: {
    id: string
  }
}

async function getCard(id: string) {
  const cardId = parseInt(id)
  if (isNaN(cardId)) {
    return null
  }

  return await prisma.card.findUnique({
    where: { id: cardId },
  })
}

async function getAllCards() {
  return await prisma.card.findMany({
    orderBy: { id: 'asc' },
  })
}

export default async function CardDetailPage({ params }: PageProps) {
  const card = await getCard(params.id)
  
  if (!card) {
    notFound()
  }

  const allCards = await getAllCards()
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
          <Badge variant="secondary">
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
          <div className="w-32 h-44 bg-white border-2 border-gray-300 rounded-lg shadow-lg flex flex-col items-center justify-center p-2">
            <div className="text-2xl font-bold mb-2">{card.id}</div>
            <div className="text-lg font-bold text-center">{card.name}</div>
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2">{card.name}</h1>
        <p className="text-gray-600">Lenormand Card #{card.id}</p>
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
                  {combos.map((combo: any, index: number) => (
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
                  This card is part of the traditional 36-card Lenormand deck,
                  used for divination and cartomancy since the 19th century.
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
                {combos.slice(0, 5).map((combo: any, index: number) => (
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