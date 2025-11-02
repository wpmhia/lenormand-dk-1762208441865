"use client"

import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ReadingViewer } from '@/components/ReadingViewer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, Share2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Reading, ReadingCard } from '@/lib/types'
import { getCards, getReadingBySlug } from '@/lib/data'

interface PageProps {
  params: {
    slug: string
  }
}

export default function ReadingPage({ params }: PageProps) {
  const { toast } = useToast()
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
        return
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

  if (!reading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-slate-300">Reading not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Lenormand Reading</h1>
          <p className="text-slate-300">{reading.title}</p>
        </div>

        <ReadingViewer
          reading={reading}
          allCards={allCards}
          showShareButton={reading.isPublic}
          onShare={handleShare}
          showReadingHeader={false}
        />
      </div>
    </div>
  )
}