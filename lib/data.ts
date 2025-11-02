import { Card, Reading, ReadingCard } from './types'

// Load cards from JSON file
export async function getCards(): Promise<Card[]> {
  // For server-side rendering, we need to use a different approach
  if (typeof window === 'undefined') {
    // Server-side - use fs to read the file
    try {
      const fs = await import('fs')
      const path = await import('path')
      const cardsPath = path.join(process.cwd(), 'public', 'data', 'cards.json')
      const data = JSON.parse(fs.readFileSync(cardsPath, 'utf8'))
      console.log('✅ Cards loaded server-side:', data.length, 'cards')
      return data
    } catch (error) {
      console.error('❌ Server-side error loading cards:', error)
      return []
    }
  }
  
  // Client-side - use fetch
  try {
    const response = await fetch('/data/cards.json')
    if (!response.ok) {
      throw new Error(`Failed to load cards: ${response.status} ${response.statusText}`)
    }
    const data = await response.json()
    console.log('✅ Cards loaded client-side:', data.length, 'cards')
    return data
  } catch (error) {
    console.error('❌ Client-side error loading cards:', error)
    return []
  }
}

export function getCardById(cards: Card[], id: number): Card | undefined {
  return cards.find(card => card.id === id)
}

// LocalStorage functions for readings
const STORAGE_KEY = 'lenormand-readings'

export function saveReading(reading: Reading): void {
  if (typeof window === 'undefined') return

  try {
    const readings = getReadings()
    readings.push(reading)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(readings))
    console.log('Reading saved successfully:', reading.id)
  } catch (error) {
    console.error('Failed to save reading to localStorage:', error)
    throw error
  }
}

export function getReadings(): Reading[] {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  
  try {
    const readings = JSON.parse(stored)
    return readings.map((r: any) => ({
      ...r,
      createdAt: new Date(r.createdAt),
      updatedAt: new Date(r.updatedAt)
    }))
  } catch {
    return []
  }
}

export function getReadingBySlug(slug: string): Reading | undefined {
  const readings = getReadings()
  return readings.find(reading => reading.slug === slug)
}

export function deleteReading(slug: string): void {
  if (typeof window === 'undefined') return
  
  const readings = getReadings()
  const filtered = readings.filter(reading => reading.slug !== slug)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

// Generate unique slug
export function generateSlug(): string {
  return Math.random().toString(36).substring(2, 15)
}

// Encode reading data for URL sharing
export function encodeReadingForUrl(reading: Reading): string {
  const data = {
    t: reading.title,
    q: reading.question,
    l: reading.layoutType,
    c: reading.cards.map(card => ({
      i: card.id,
      p: card.position,
      r: card.reversed ? 1 : 0
    }))
  }
  return btoa(JSON.stringify(data)).replace(/[+/=]/g, c => ({
    '+': '-', '/': '_', '=': ''
  })[c] || c)
}

// Decode reading data from URL
export function decodeReadingFromUrl(encoded: string): Partial<Reading> | null {
  try {
    // Reverse the base64 URL encoding
    const base64 = encoded.replace(/[-_]/g, c => ({ '-': '+', '_': '/' })[c] || c)
    const json = atob(base64 + '=='.slice(0, (3 - base64.length % 3) % 3))
    const data = JSON.parse(json)
    
    return {
      title: data.t,
      question: data.q,
      layoutType: data.l,
      cards: data.c.map((card: any) => ({
        id: card.i,
        position: card.p,
        reversed: card.r === 1
      }))
    }
  } catch {
    return null
  }
}

// Create shareable URL for reading
export function createShareableUrl(reading: Reading): string {
  const encoded = encodeReadingForUrl(reading)
  return `${window.location.origin}/read/shared/${encoded}`
}

// Shuffle cards
export function shuffleCards<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Draw cards for reading - ensures complete randomness with no repetition
export function drawCards(cards: Card[], count: number): ReadingCard[] {
  if (count > cards.length) {
    throw new Error(`Cannot draw ${count} cards from a deck of ${cards.length}`)
  }

  // Create a copy of the cards array to avoid modifying the original
  const availableCards = [...cards]
  const drawnCards: Card[] = []

  // Draw cards randomly without replacement for complete uniqueness
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * availableCards.length)
    const drawnCard = availableCards.splice(randomIndex, 1)[0]
    drawnCards.push(drawnCard)
  }

  return drawnCards.map((card, index) => ({
    id: card.id,
    position: index,
    reversed: Math.random() < 0.3 // 30% chance of reversed
  }))
}

// Get combination meaning between two cards
export function getCombinationMeaning(card1: Card, card2: Card): string | null {
  const combos = Array.isArray(card1.combos) ? card1.combos : []
  const combo = combos.find(c => c.withCardId === card2.id)
  return combo?.meaning || null
}

// Get adjacent cards for linear layouts (3, 5, 9 cards)
export function getLinearAdjacentCards(cards: ReadingCard[], currentIndex: number): ReadingCard[] {
  const adjacent: ReadingCard[] = []
  
  // Check if currentIndex is valid
  if (currentIndex < 0 || currentIndex >= cards.length) {
    return adjacent
  }
  
  if (currentIndex > 0) {
    adjacent.push(cards[currentIndex - 1])
  }
  if (currentIndex < cards.length - 1) {
    adjacent.push(cards[currentIndex + 1])
  }
  
  return adjacent
}

// Get adjacent cards for Grand Tableau (36 cards in 9x4 grid)
export function getGrandTableauAdjacentCards(cards: ReadingCard[], currentIndex: number): ReadingCard[] {
  const adjacent: ReadingCard[] = []
  
  // Check if currentIndex is valid
  if (currentIndex < 0 || currentIndex >= 36) {
    return adjacent
  }
  
  const row = Math.floor(currentIndex / 4)
  const col = currentIndex % 4
  
  // Adjacent positions in grid (top, bottom, left, right)
  const adjacentPositions = [
    { r: row - 1, c: col },     // top
    { r: row + 1, c: col },     // bottom
    { r: row, c: col - 1 },     // left
    { r: row, c: col + 1 },     // right
  ].filter(pos => pos.r >= 0 && pos.r < 9 && pos.c >= 0 && pos.c < 4)
  
  adjacentPositions.forEach(pos => {
    const adjIndex = pos.r * 4 + pos.c
    const adjCard = cards.find(card => card.position === adjIndex)
    if (adjCard) adjacent.push(adjCard)
  })
  
  return adjacent
}