"use client"

import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ReadingViewer } from '@/components/ReadingViewer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, Share2 } from 'lucide-react'
import { Reading } from '@/lib/types'
import { getCards, decodeReadingFromUrl } from '@/lib/data'

interface PageProps {
  params: {
    encoded: string
  }
}

export default function SharedReadingPage({ params }: PageProps) {
  const [reading, setReading] = useState<Reading | null>(null)
  const [allCards, setAllCards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cardsData, decodedData] = await Promise.all([
          getCards(),
          Promise.resolve(decodeReadingFromUrl(params.encoded))
        ])

        if (!decodedData || !decodedData.cards || !decodedData.layoutType) {
          notFound()
          return
        }

        // Create a complete reading object
        const reading: Reading = {
          id: 'shared',
          title: decodedData.title || 'Shared Reading',
          question: decodedData.question,
          layoutType: decodedData.layoutType,
          cards: decodedData.cards,
          slug: 'shared',
          isPublic: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }

        setAllCards(cardsData)
        setReading(reading)
      } catch (error) {
        console.error('Error loading shared reading:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.encoded])

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      alert('Reading link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!reading) {
    notFound()
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Shared Lenormand Reading</h1>
          <Badge variant="secondary" className="text-sm">
            {reading.layoutType} Cards
          </Badge>
        </div>
        
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Shared Reading
          </div>
          
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            Anonymous
          </div>
          
          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>

      <ReadingViewer
        reading={reading}
        allCards={allCards}
        showShareButton={true}
        onShare={handleShare}
      />

      <div className="mt-12 text-center text-sm text-gray-500">
        <p>
          This is a shared Lenormand reading. 
          Create your own reading at{' '}
          <a href="/read/new" className="text-blue-600 hover:underline">
            Lenormand.dk
          </a>
        </p>
      </div>
    </div>
  )
}