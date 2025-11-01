"use client"

import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ReadingViewer } from '@/components/ReadingViewer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, Share2 } from 'lucide-react'
import { Reading, ReadingCard } from '@/lib/types'
import { getCards, getReadingBySlug } from '@/lib/data'

interface PageProps {
  params: {
    slug: string
  }
}

export default function ReadingPage({ params }: PageProps) {
  const [reading, setReading] = useState<Reading | null>(null)
  const [allCards, setAllCards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cardsData, readingData] = await Promise.all([
          getCards(),
          Promise.resolve(getReadingBySlug(params.slug))
        ])

        if (!readingData) {
          notFound()
          return
        }

        setAllCards(cardsData)
        setReading(readingData)
      } catch (error) {
        console.error('Error loading reading:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.slug])

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: 'Link copied!',
        description: 'Reading link copied to clipboard',
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-slate-300">Loading reading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-white">Lenormand Reading</h1>
            <Badge variant="secondary" className="bg-slate-800 text-slate-200 border-slate-700 text-sm">
              {reading.layoutType} Cards
            </Badge>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(reading.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            Anonymous
          </div>
          
          {reading.isPublic && (
            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          )}
        </div>
      </div>

      <ReadingViewer
        reading={reading}
        allCards={allCards}
        showShareButton={reading.isPublic}
        onShare={handleShare}
      />

      <div className="mt-12 text-center text-sm text-gray-500">
        <p>
          This is a Lenormand reading. 
          Create your own reading at{' '}
          <a href="/read/new" className="text-blue-600 hover:underline">
            Lenormand.dk
          </a>
        </p>
      </div>
    </div>
  )
}