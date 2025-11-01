import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { nanoid } from 'nanoid'

const createReadingSchema = z.object({
  title: z.string().min(1).max(100),
  question: z.string().max(500).optional(),
  layoutType: z.enum(['3', '5', '9', '36']).transform(val => parseInt(val) as 3 | 5 | 9 | 36),
  cards: z.array(z.object({
    id: z.number(),
    position: z.number(),
    reversed: z.boolean(),
    x: z.number().optional(),
    y: z.number().optional(),
  })),
  isPublic: z.boolean().default(false),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { title, question, layoutType, cards, isPublic } = createReadingSchema.parse(body)

    // Generate unique slug
    let slug = nanoid(8)
    const existingSlug = await prisma.reading.findUnique({ where: { slug } })
    if (existingSlug) {
      slug = nanoid(12) // Try longer slug if collision
    }

    const reading = await prisma.reading.create({
      data: {
        title,
        question,
        layoutType,
        cards,
        slug,
        isPublic,
        userId: session?.user?.id || null,
      },
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

    // Update draw statistics
    if (session?.user?.id) {
      for (const card of cards) {
        await prisma.drawStat.upsert({
          where: {
            userId_cardId: {
              userId: session.user.id,
              cardId: card.id,
            },
          },
          update: {
            count: {
              increment: 1,
            },
          },
          create: {
            userId: session.user.id,
            cardId: card.id,
            count: 1,
          },
        })
      }
    }

    return NextResponse.json(reading, { status: 201 })
  } catch (error) {
    console.error('Error creating reading:', error)
    return NextResponse.json(
      { error: 'Failed to create reading' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const publicOnly = searchParams.get('public') === 'true'

    const where = session?.user?.id && !publicOnly
      ? { userId: session.user.id }
      : { isPublic: true }

    const readings = await prisma.reading.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
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

    const total = await prisma.reading.count({ where })

    return NextResponse.json({
      readings,
      total,
      hasMore: offset + readings.length < total,
    })
  } catch (error) {
    console.error('Error fetching readings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch readings' },
      { status: 500 }
    )
  }
}