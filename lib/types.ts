import { Card } from '@prisma/client'

export type { Card }
export interface CardWithCombos {
  id: number
  name: string
  number: number
  keywords: string[]
  uprightMeaning: string
  reversedMeaning: string | null
  combos: CardCombo[]
  imageUrl: string | null
}

export interface CardCombo {
  withCardId: number
  meaning: string
}

export interface ReadingCard {
  id: number
  position: number
  reversed: boolean
  x?: number
  y?: number
}

export interface Reading {
  id: string
  userId?: string
  title: string
  question?: string
  layoutType: 3 | 5 | 9 | 36
  cards: ReadingCard[]
  slug: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  user?: {
    id: string
    name: string | null
    email: string
  }
}

export interface LayoutConfig {
  name: string
  cardCount: number
  positions: Array<{
    id: string
    x: number
    y: number
    label: string
    meaning: string
  }>
}

export interface DrawStat {
  id: string
  userId?: string
  cardId: number
  count: number
  card: Card
}

export interface UserStats {
  totalReadings: number
  cardDraws: DrawStat[]
  mostDrawnCard: DrawStat | null
  leastDrawnCard: DrawStat | null
}

export interface Locale {
  [key: string]: string | Locale
}

export type Language = 'en' | 'da'