"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Search,
  Filter,
  Grid3X3,
  List
} from 'lucide-react'
import { useState } from 'react'

const cardMeanings = [
  { number: 1, name: "The Rider", keywords: ["News", "Messages", "Communication", "Speed"], associations: ["Letters", "Visitors", "Quick changes", "News from afar"] },
  { number: 2, name: "The Clover", keywords: ["Luck", "Opportunity", "Happiness", "Risk"], associations: ["Good fortune", "Short-term luck", "Gambling", "Taking chances"] },
  { number: 3, name: "The Ship", keywords: ["Travel", "Journey", "Distance", "Progress"], associations: ["Long journeys", "Moving away", "Business trips", "Progress over time"] },
  { number: 4, name: "The House", keywords: ["Home", "Family", "Security", "Foundation"], associations: ["Family matters", "Property", "Stability", "Long-term planning"] },
  { number: 5, name: "The Tree", keywords: ["Health", "Growth", "Nature", "Longevity"], associations: ["Physical health", "Healing", "Personal growth", "Family tree"] },
  { number: 6, name: "The Clouds", keywords: ["Confusion", "Uncertainty", "Secrets", "Thoughts"], associations: ["Mental fog", "Hidden information", "Doubts", "Indecision"] },
  { number: 7, name: "The Snake", keywords: ["Deception", "Wisdom", "Healing", "Transformation"], associations: ["Betrayal", "Hidden enemies", "Medical issues", "Personal growth"] },
  { number: 8, name: "The Coffin", keywords: ["Endings", "Transformation", "Grief", "Release"], associations: ["Death of situation", "Major change", "Letting go", "New beginnings"] },
  { number: 9, name: "The Bouquet", keywords: ["Gifts", "Celebration", "Beauty", "Gratitude"], associations: ["Presents", "Romance", "Social events", "Appreciation"] },
  { number: 10, name: "The Scythe", keywords: ["Cutting", "Decisions", "Sudden change", "Surgery"], associations: ["Breaking free", "Harvesting", "Sudden events", "Making choices"] },
  { number: 11, name: "The Whip", keywords: ["Conflict", "Arguments", "Discipline", "Repetition"], associations: ["Quarrels", "Physical punishment", "Mental abuse", "Endless cycles"] },
  { number: 12, name: "The Birds", keywords: ["Communication", "Conversation", "Worry", "Thoughts"], associations: ["Phone calls", "Gossip", "Anxiety", "Mental chatter"] },
  { number: 13, name: "The Child", keywords: ["New beginnings", "Innocence", "Youth", "Potential"], associations: ["Children", "New projects", "Fresh starts", "Naivety"] },
  { number: 14, name: "The Fox", keywords: ["Cunning", "Deception", "Intelligence", "Caution"], associations: ["Trickery", "Business dealings", "Street smarts", "Being careful"] },
  { number: 15, name: "The Bear", keywords: ["Strength", "Protection", "Authority", "Wealth"], associations: ["Power", "Leadership", "Financial security", "Mother figure"] },
  { number: 16, name: "The Stars", keywords: ["Hope", "Inspiration", "Spirituality", "Guidance"], associations: ["Dreams", "Intuition", "Divine guidance", "Wishes coming true"] },
  { number: 17, name: "The Stork", keywords: ["Change", "Movement", "New life", "Progress"], associations: ["Pregnancy", "Moving house", "Life transitions", "Positive change"] },
  { number: 18, name: "The Dog", keywords: ["Loyalty", "Friendship", "Trust", "Protection"], associations: ["True friends", "Faithful companion", "Dependability", "Guardianship"] },
  { number: 19, name: "The Tower", keywords: ["Authority", "Government", "Isolation", "Structure"], associations: ["Official matters", "Institutions", "Solitude", "Rigid systems"] },
  { number: 20, name: "The Garden", keywords: ["Public life", "Community", "Gatherings", "Growth"], associations: ["Social events", "Public recognition", "Networking", "Community involvement"] },
  { number: 21, name: "The Mountain", keywords: ["Obstacles", "Challenges", "Patience", "Perspective"], associations: ["Difficulties", "Delays", "High goals", "Overcoming barriers"] },
  { number: 22, name: "The Crossroads", keywords: ["Choices", "Decisions", "Direction", "Opportunity"], associations: ["Multiple paths", "Life choices", "Crossroads in life", "New directions"] },
  { number: 23, name: "The Mice", keywords: ["Loss", "Theft", "Stress", "Small problems"], associations: ["Financial loss", "Worries", "Pests", "Gradual deterioration"] },
  { number: 24, name: "The Heart", keywords: ["Love", "Emotions", "Relationships", "Passion"], associations: ["Romantic love", "Emotional matters", "Deep feelings", "Heart chakra"] },
  { number: 25, name: "The Ring", keywords: ["Commitment", "Contracts", "Cycles", "Partnership"], associations: ["Marriage", "Agreements", "Endless cycles", "Binding agreements"] },
  { number: 26, name: "The Book", keywords: ["Knowledge", "Secrets", "Learning", "Mystery"], associations: ["Education", "Hidden information", "Research", "Confidential matters"] },
  { number: 27, name: "The Letter", keywords: ["Communication", "Documents", "News", "Information"], associations: ["Important mail", "Legal documents", "Messages", "Correspondence"] },
  { number: 28, name: "The Gentleman", keywords: ["Man", "Authority figure", "Partner", "Masculine energy"], associations: ["Husband", "Father", "Boss", "Male friend"] },
  { number: 29, name: "The Lady", keywords: ["Woman", "Feminine energy", "Partner", "Self"], associations: ["Wife", "Mother", "Female friend", "The querent"] },
  { number: 30, name: "The Lilies", keywords: ["Peace", "Harmony", "Purity", "Spirituality"], associations: ["Calm", "Sexual matters", "Peace of mind", "Spiritual growth"] },
  { number: 31, name: "The Sun", keywords: ["Success", "Happiness", "Clarity", "Vitality"], associations: ["Achievement", "Joy", "Good health", "Positive outcomes"] },
  { number: 32, name: "The Moon", keywords: ["Emotions", "Intuition", "Imagination", "Cycles"], associations: ["Feelings", "Psychic abilities", "Creativity", "Night time"] },
  { number: 33, name: "The Key", keywords: ["Solutions", "Answers", "Unlocking", "Success"], associations: ["Finding answers", "Opening doors", "Resolutions", "Master key"] },
  { number: 34, name: "The Fish", keywords: ["Abundance", "Wealth", "Emotions", "Fertility"], associations: ["Money", "Business success", "Emotional depth", "Multiplication"] },
  { number: 35, name: "The Anchor", keywords: ["Stability", "Security", "Patience", "Grounding"], associations: ["Reliability", "Safe harbor", "Long-term commitment", "Being stuck"] },
  { number: 36, name: "The Cross", keywords: ["Burden", "Sacrifice", "Faith", "Destiny"], associations: ["Heavy responsibilities", "Religious matters", "Life lessons", "Karma"] }
]

export default function CardMeaningsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredCards = cardMeanings.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="sticky top-14 z-40 border-b border-border bg-card/80 backdrop-blur">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/learn">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Course
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                Module 4 of 6
              </Badge>
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                Intermediate
              </Badge>
            </div>
            <Link href="/learn/spreads">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                Next Module
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Module Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Card Meanings & Associations
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Master the traditional meanings and symbolic associations of all 36 Lenormand cards.
          </p>
          <div className="flex items-center justify-center mt-4 space-x-4 text-sm text-primary">
            <div className="flex items-center">
              <BookOpen className="w-4 h-4 mr-1" />
              45 minutes
            </div>
            <div className="flex items-center">
              <Filter className="w-4 h-4 mr-1" />
              Intermediate Level
            </div>
          </div>
        </div>

        {/* Search and View Controls */}
        <Card className="mb-8 border-border bg-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search cards by name or keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="flex items-center space-x-2"
                >
                  <Grid3X3 className="w-4 h-4" />
                  <span>Grid</span>
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="flex items-center space-x-2"
                >
                  <List className="w-4 h-4" />
                  <span>List</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {filteredCards.map((card) => (
              <Card key={card.number} className="hover:shadow-lg hover:shadow-primary/20 cursor-pointer group border border-border bg-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-muted text-muted-foreground text-xs">
                      #{card.number}
                    </Badge>
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{card.number}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors">
                    {card.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground mb-1">Keywords:</h4>
                      <div className="flex flex-wrap gap-1">
                        {card.keywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-muted text-muted-foreground">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground mb-1">Associations:</h4>
                      <p className="text-xs text-primary leading-relaxed">
                        {card.associations.join(', ')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3 mb-8">
            {filteredCards.map((card) => (
              <Card key={card.number} className="border border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{card.number}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{card.name}</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {card.keywords.map((keyword, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-muted text-muted-foreground">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-primary">
                        {card.associations.join(', ')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Learning Tips */}
        <Card className="mb-8 border-border bg-card">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-primary" />
              Learning the Cards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-card-foreground">Start with Keywords</h4>
                    <p className="text-sm text-muted-foreground">
                      Focus on the core keywords first. These represent the card&apos;s primary energy.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-card-foreground">Study Associations</h4>
                    <p className="text-sm text-muted-foreground">
                      Learn the symbolic associations. These help you understand how cards interact.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-card-foreground">Practice Daily</h4>
                    <p className="text-sm text-muted-foreground">
                      Review 3-5 cards daily. Repetition builds familiarity and intuition.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-card-foreground">Trust Your Intuition</h4>
                    <p className="text-sm text-muted-foreground">
                      While meanings are concrete, your intuition helps find personal relevance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-border">
          <Link href="/learn/reading-basics">
            <Button variant="outline" className="border-border text-card-foreground hover:bg-muted">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Reading Basics
            </Button>
          </Link>
          <Link href="/learn/spreads">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Continue to Spreads
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}