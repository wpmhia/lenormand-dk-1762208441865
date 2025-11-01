"use client"

import { useState, useEffect } from 'react'
import { Card as CardType } from '@/lib/types'
import { Card } from '@/components/Card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, Grid, List } from 'lucide-react'
import Link from 'next/link'
import { getCards } from '@/lib/data'

export default function CardsPage() {
  const [cards, setCards] = useState<CardType[]>([])
  const [filteredCards, setFilteredCards] = useState<CardType[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'number' | 'name'>('number')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCards()
  }, [])

  useEffect(() => {
    filterAndSortCards()
  }, [cards, searchTerm, sortBy])

  const fetchCards = async () => {
    try {
      const cardsData = await getCards()
      setCards(cardsData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching cards:', error)
      setLoading(false)
    }
  }

  const filterAndSortCards = () => {
    let filtered = cards

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(card =>
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.keywords.some(keyword => 
          keyword.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        card.uprightMeaning.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'number') {
        return a.id - b.id
      } else {
        return a.name.localeCompare(b.name)
      }
    })

    setFilteredCards(filtered)
  }

  const getAllKeywords = () => {
    const keywords = new Set<string>()
    cards.forEach(card => {
      card.keywords.forEach(keyword => keywords.add(keyword))
    })
    return Array.from(keywords).sort()
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading cards...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Lenormand Cards</h1>
        <p className="text-gray-600">
          Explore the 36 cards of the Lenormand deck and their meanings
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search cards by name, keywords, or meaning..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={sortBy} onValueChange={(value: 'number' | 'name') => setSortBy(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="number">Sort by Number</SelectItem>
              <SelectItem value="name">Sort by Name</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Keyword Pills */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 py-1">Quick filter:</span>
          {getAllKeywords().slice(0, 20).map((keyword) => (
            <Badge
              key={keyword}
              variant="outline"
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => setSearchTerm(keyword)}
            >
              {keyword}
            </Badge>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          Showing {filteredCards.length} of {cards.length} cards
        </p>
      </div>

      {/* Cards Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredCards.map((card) => (
            <Link key={card.id} href={`/cards/${card.id}`}>
              <div className="space-y-2 cursor-pointer group">
                <Card card={card} size="md" className="group-hover:scale-105 transition-transform" />
                <div className="text-center">
                  <div className="font-medium text-sm">{card.name}</div>
                  <div className="text-xs text-gray-500">#{card.id}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCards.map((card) => (
            <Link key={card.id} href={`/cards/${card.id}`}>
              <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <Card card={card} size="sm" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{card.name}</h3>
                    <Badge variant="outline" className="text-xs">#{card.id}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {card.uprightMeaning}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {card.keywords.slice(0, 3).map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                    {card.keywords.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{card.keywords.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {filteredCards.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No cards found matching your search.</p>
          <Button variant="outline" onClick={() => setSearchTerm('')}>
            Clear Search
          </Button>
        </div>
      )}
    </div>
  )
}