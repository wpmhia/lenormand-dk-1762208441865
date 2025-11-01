import { notFound } from 'next/navigation'
import { ReadingViewer } from '@/components/ReadingViewer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, Share2 } from 'lucide-react'
import { prisma } from '@/lib/db'
import { ReadingCard } from '@/lib/types'

interface PageProps {
  params: {
    slug: string
  }
}

async function getReading(slug: string) {
  const reading = await prisma.reading.findUnique({
    where: { slug },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })

  if (!reading || (!reading.isPublic && !reading.userId)) {
    return null
  }

  // Convert null to undefined for type compatibility
  return {
    ...reading,
    userId: reading.userId || undefined,
    question: reading.question || undefined,
    layoutType: reading.layoutType as 3 | 5 | 9 | 36,
    cards: reading.cards as unknown as ReadingCard[],
    user: reading.user || undefined,
  }
}

async function getAllCards() {
  return await prisma.card.findMany({
    orderBy: { id: 'asc' },
  })
}

export default async function ReadingPage({ params }: PageProps) {
  const reading = await getReading(params.slug)
  
  if (!reading) {
    notFound()
  }

  const allCards = await getAllCards()

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      alert('Reading link copied to clipboard!')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Lenormand Reading</h1>
          <Badge variant="secondary" className="text-sm">
            {reading.layoutType} Cards
          </Badge>
        </div>
        
        <div className="flex items-center gap-6 text-sm text-gray-600">
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
            {reading.user?.name || 'Anonymous'}
          </div>
          
          {reading.isPublic && (
            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
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
          This is a public Lenormand reading. 
          Create your own reading at{' '}
          <a href="/read/new" className="text-blue-600 hover:underline">
            Lenormand.dk
          </a>
        </p>
      </div>
    </div>
  )
}