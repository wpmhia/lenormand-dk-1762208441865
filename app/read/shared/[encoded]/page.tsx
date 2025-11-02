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
        return
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-300"></div>
      </div>
    )
  }

  if (!reading) {
    notFound()
    return null
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Shared Lenormand Reading</h1>
          <p className="text-slate-300">{reading.title}</p>
        </div>

        <ReadingViewer
          reading={reading}
          allCards={allCards}
          showShareButton={true}
          onShare={handleShare}
          showReadingHeader={false}
        />
      </div>
    </div>
  )
}