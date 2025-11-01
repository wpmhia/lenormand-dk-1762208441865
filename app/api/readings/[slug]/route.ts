import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const paramsSchema = z.object({
  slug: z.string(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = paramsSchema.parse(params)

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

    if (!reading) {
      return NextResponse.json(
        { error: 'Reading not found' },
        { status: 404 }
      )
    }

    // Only return if reading is public or user is owner
    if (!reading.isPublic) {
      return NextResponse.json(
        { error: 'Reading is not public' },
        { status: 403 }
      )
    }

    return NextResponse.json(reading)
  } catch (error) {
    console.error('Error fetching reading:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reading' },
      { status: 500 }
    )
  }
}