import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Spade,
  Heart,
  Diamond,
  Club,
  Globe,
  Lightbulb,
  Calendar
} from 'lucide-react'

const timeAssociations = [
  { card: "The Rider", time: "Days to 1 week", description: "Quick movement, immediate action" },
  { card: "The Clover", time: "Days to 1 week", description: "Short-term luck and opportunities" },
  { card: "The Ship", time: "2-4 weeks", description: "Journeys and travel, moderate time" },
  { card: "The House", time: "1-3 months", description: "Long-term stability and building" },
  { card: "The Tree", time: "6 months to years", description: "Growth, health, long-term development" },
  { card: "The Clouds", time: "Uncertain timing", description: "Confusion delays progress" },
  { card: "The Mountain", time: "3-6 months", description: "Obstacles cause delays" },
  { card: "The Stork", time: "2-4 weeks", description: "Change and transition period" },
  { card: "The Sun", time: "Soon, positive timing", description: "Success comes quickly" },
  { card: "The Moon", time: "1-2 months", description: "Emotional cycles, creative timing" }
]

const playingCardAssociations = [
  {
    suit: "Hearts",
    icon: Heart,
    color: "text-primary",
    bgColor: "bg-muted",
    meaning: "Emotions, relationships, intuition, water energy",
    cards: ["Rider (9♥)", "Ship (7♥)", "House (6♥)", "Tree (4♥)", "Clouds (Queen♥)", "Snake (8♥)", "Coffin (9♥)", "Bouquet (10♥)", "Scythe (6♥)", "Birds (7♥)", "Child (Jack♥)", "Fox (8♥)", "Bear (Queen♥)", "Stars (6♥)", "Stork (10♥)", "Dog (King♥)", "Tower (6♥)", "Garden (King♥)", "Mountain (8♥)", "Crossroads (7♥)", "Mice (9♥)", "Heart (Ace♥)", "Ring (10♥)", "Book (7♥)", "Letter (King♥)", "Gentleman (King♥)", "Lady (Queen♥)", "Lilies (9♥)", "Sun (Ace♥)", "Moon (Queen♥)", "Key (8♥)", "Fish (King♥)", "Anchor (9♥)", "Cross (7♥)"]
  },
  {
    suit: "Clubs",
    icon: Club,
    color: "text-primary",
    bgColor: "bg-muted",
    meaning: "Material world, home, family, earth energy",
    cards: ["Rider (9♣)", "Clover (7♣)", "Ship (8♣)", "House (King♣)", "Tree (10♣)", "Clouds (King♣)", "Snake (Queen♣)", "Coffin (8♣)", "Bouquet (Queen♣)", "Scythe (Jack♣)", "Whip (10♣)", "Birds (9♣)", "Child (6♣)", "Fox (7♣)", "Bear (10♣)", "Stars (8♣)", "Stork (9♣)", "Dog (Jack♣)", "Tower (8♣)", "Garden (Queen♣)", "Mountain (7♣)", "Crossroads (6♣)", "Mice (8♣)", "Heart (7♣)", "Ring (9♣)", "Book (Jack♣)", "Letter (7♣)", "Gentleman (King♣)", "Lady (Queen♣)", "Lilies (10♣)", "Sun (7♣)", "Moon (8♣)", "Key (6♣)", "Fish (9♣)", "Anchor (10♣)", "Cross (6♣)"]
  },
  {
    suit: "Diamonds",
    icon: Diamond,
    color: "text-primary",
    bgColor: "bg-muted",
    meaning: "Communication, creativity, action, air energy",
    cards: ["Rider (Jack♦)", "Clover (8♦)", "Ship (6♦)", "House (9♦)", "Tree (Ace♦)", "Clouds (7♦)", "Snake (Ace♦)", "Coffin (7♦)", "Bouquet (9♦)", "Scythe (8♦)", "Whip (King♦)", "Birds (10♦)", "Child (9♦)", "Fox (6♦)", "Bear (7♦)", "Stars (9♦)", "Stork (8♦)", "Dog (Ace♦)", "Tower (10♦)", "Garden (Jack♦)", "Mountain (6♦)", "Crossroads (8♦)", "Mice (7♦)", "Heart (8♦)", "Ring (6♦)", "Book (Queen♦)", "Letter (8♦)", "Gentleman (Jack♦)", "Lady (Jack♦)", "Lilies (8♦)", "Sun (6♦)", "Moon (9♦)", "Key (7♦)", "Fish (8♦)", "Anchor (6♦)", "Cross (9♦)"]
  },
  {
    suit: "Spades",
    icon: Spade,
    color: "text-primary",
    bgColor: "bg-muted",
    meaning: "Thoughts, planning, challenges, fire energy",
    cards: ["Rider (8♠)", "Clover (6♠)", "Ship (9♠)", "House (7♠)", "Tree (Queen♠)", "Clouds (Jack♠)", "Snake (10♠)", "Coffin (6♠)", "Bouquet (8♠)", "Scythe (9♠)", "Whip (7♠)", "Birds (Queen♠)", "Child (10♠)", "Fox (9♠)", "Bear (6♠)", "Stars (10♠)", "Stork (7♠)", "Dog (Queen♠)", "Tower (9♠)", "Garden (7♠)", "Mountain (9♠)", "Crossroads (10♠)", "Mice (6♠)", "Heart (9♠)", "Ring (8♠)", "Book (6♠)", "Letter (9♠)", "Gentleman (7♠)", "Lady (8♠)", "Lilies (7♠)", "Sun (8♠)", "Moon (7♠)", "Key (9♠)", "Fish (7♠)", "Anchor (8♠)", "Cross (10♠)"]
  }
]

const culturalInterpretations = [
  {
    culture: "French Tradition",
    description: "Elegant and sophisticated, focuses on courtly imagery and aristocratic symbolism",
    characteristics: ["Poetic interpretations", "Emphasis on social status", "Refined symbolism"]
  },
  {
    culture: "German Tradition",
    description: "Practical and straightforward, emphasizes everyday symbolism and concrete meanings",
    characteristics: ["Direct meanings", "Focus on daily life", "Systematic approaches"]
  },
  {
    culture: "Contemporary",
    description: "Blends traditional wisdom with modern interpretations and diverse cultural perspectives",
    characteristics: ["Inclusive symbolism", "Personal intuition", "Cultural adaptation"]
  },
  {
    culture: "Hoodoo/ATR",
    description: "Strong playing card associations, focuses on practical magic and spiritual work",
    characteristics: ["Playing card focus", "Practical application", "Spiritual work"]
  }
]

export default function AdvancedPage() {
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
              <Badge className="bg-muted text-muted-foreground">
                Module 6 of 6
              </Badge>
              <Badge className="bg-muted text-muted-foreground">
                Advanced
              </Badge>
            </div>
            <div className="w-24"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Module Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Advanced Concepts
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Master the deeper layers of Lenormand: time associations, playing card connections, and cultural interpretations.
          </p>
          <div className="flex items-center justify-center mt-4 space-x-4 text-sm text-primary">
            <div className="flex items-center">
              <Lightbulb className="w-4 h-4 mr-1" />
              35 minutes
            </div>
            <div className="flex items-center">
              <Globe className="w-4 h-4 mr-1" />
              Advanced Level
            </div>
          </div>
        </div>

        {/* Time Associations */}
        <Card className="mb-8 border-border bg-card">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground flex items-center">
              <Clock className="w-6 h-6 mr-3 text-primary" />
              Time Associations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Many Lenormand cards have traditional associations with timing. While not every reading requires precise time predictions, these associations can provide valuable context about when events may occur.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {timeAssociations.map((item, index) => (
                <div key={index} className="bg-muted p-4 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-foreground">{item.card}</h4>
                    <Badge className="bg-muted text-muted-foreground">
                      {item.time}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-muted p-4 rounded-lg border border-border mt-6">
              <h4 className="font-semibold text-foreground mb-2">Important Notes:</h4>
              <ul className="text-muted-foreground text-sm space-y-1">
                <li>• Time associations are traditional guidelines, not absolute predictions</li>
                <li>• Context from surrounding cards can modify timing</li>
                <li>• Some cards (like Clouds) indicate uncertain or delayed timing</li>
                <li>• Use intuition alongside traditional associations</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Playing Card Associations */}
        <Card className="mb-8 border-border bg-card">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground flex items-center">
              <Spade className="w-6 h-6 mr-3 text-primary" />
              Playing Card Associations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Lenormand cards have traditional associations with playing cards (suits and numbers). These connections can add deeper layers of meaning and are particularly important in Hoodoo and other African Traditional Religions.
            </p>

            <div className="grid gap-6">
              {playingCardAssociations.map((suit, index) => (
                <div key={index} className={`p-6 rounded-lg border ${suit.bgColor}`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <suit.icon className={`w-8 h-8 ${suit.color}`} />
                    <div>
                      <h3 className={`text-xl font-semibold ${suit.color.replace('-600', '-900')} dark:text-foreground`}>
                        {suit.suit}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {suit.meaning}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-primary dark:text-primary/80">
                    <p className="mb-2"><strong>Associated Lenormand cards:</strong></p>
                    <p className="leading-relaxed">
                      {suit.cards.slice(0, 12).join(', ')}...
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-muted p-4 rounded-lg border border-border mt-6">
              <h4 className="font-semibold text-foreground mb-2">How to Use Playing Cards:</h4>
              <ul className="text-muted-foreground text-sm space-y-1">
                <li>• Add playing card associations for additional context</li>
                <li>• Particularly useful in Hoodoo and ATR practices</li>
                <li>• Can provide numerological insights</li>
                <li>• Helps with more precise timing and energy readings</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Cultural Interpretations */}
        <Card className="mb-8 border-border bg-card">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground flex items-center">
              <Globe className="w-6 h-6 mr-3 text-primary" />
              Cultural Interpretations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-card-foreground leading-relaxed mb-6">
              Lenormand has evolved differently across cultures. Understanding these various schools of thought can enrich your readings and help you choose the approach that resonates most with your practice.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {culturalInterpretations.map((culture, index) => (
                <div key={index} className="bg-muted p-6 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {culture.culture}
                  </h3>
                  <p className="text-card-foreground text-sm mb-4">
                    {culture.description}
                  </p>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2 text-sm">Characteristics:</h4>
                    <ul className="space-y-1">
                      {culture.characteristics.map((char, charIndex) => (
                        <li key={charIndex} className="text-muted-foreground text-sm flex items-center">
                          <span className="text-primary mr-2">•</span>
                          {char}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Advanced Practice Tips */}
        <Card className="mb-8 border-border bg-card">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground flex items-center">
              <Lightbulb className="w-6 h-6 mr-3 text-primary" />
              Advanced Practice Techniques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-card-foreground">Study Card Combinations</h4>
                    <p className="text-muted-foreground text-sm mt-1">
                      Learn how cards modify each other when they appear together. Some combinations create entirely new meanings.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-card-foreground">Practice Grand Tableau</h4>
                    <p className="text-muted-foreground text-sm mt-1">
                      Master the 36-card Grand Tableau for comprehensive readings. Start with simple questions and work up to complex ones.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-card-foreground">Explore Cultural Contexts</h4>
                    <p className="text-muted-foreground text-sm mt-1">
                      Study different cultural approaches to Lenormand. Incorporate elements that resonate with your background and practice.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-card-foreground">Develop Your Style</h4>
                    <p className="text-muted-foreground text-sm mt-1">
                      As you gain experience, develop your own associations and techniques. Lenormand is a living tradition that evolves with its practitioners.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Completion */}
        <Card className="mb-8 border-border bg-card">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              🎉 Course Complete!
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Congratulations! You&apos;ve completed the comprehensive Lenormand Wisdom Course. You now have the knowledge and tools to begin your journey as a Lenormand reader.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/read/new">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Start Your First Reading
                </Button>
              </Link>
              <Link href="/cards">
                <Button variant="outline" className="border-border text-card-foreground hover:bg-muted">
                  Explore the Cards
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-border">
          <Link href="/learn/spreads">
            <Button variant="outline" className="border-border text-card-foreground hover:bg-muted">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Spreads
            </Button>
          </Link>
          <Link href="/read/new">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Start Reading Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}