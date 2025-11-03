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
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/20",
    meaning: "Emotions, relationships, intuition, water energy",
    cards: ["Rider (9♥)", "Ship (7♥)", "House (6♥)", "Tree (4♥)", "Clouds (Queen♥)", "Snake (8♥)", "Coffin (9♥)", "Bouquet (10♥)", "Scythe (6♥)", "Birds (7♥)", "Child (Jack♥)", "Fox (8♥)", "Bear (Queen♥)", "Stars (6♥)", "Stork (10♥)", "Dog (King♥)", "Tower (6♥)", "Garden (King♥)", "Mountain (8♥)", "Crossroads (7♥)", "Mice (9♥)", "Heart (Ace♥)", "Ring (10♥)", "Book (7♥)", "Letter (King♥)", "Gentleman (King♥)", "Lady (Queen♥)", "Lilies (9♥)", "Sun (Ace♥)", "Moon (Queen♥)", "Key (8♥)", "Fish (King♥)", "Anchor (9♥)", "Cross (7♥)"]
  },
  {
    suit: "Clubs",
    icon: Club,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20",
    meaning: "Material world, home, family, earth energy",
    cards: ["Rider (9♣)", "Clover (7♣)", "Ship (8♣)", "House (King♣)", "Tree (10♣)", "Clouds (King♣)", "Snake (Queen♣)", "Coffin (8♣)", "Bouquet (Queen♣)", "Scythe (Jack♣)", "Whip (10♣)", "Birds (9♣)", "Child (6♣)", "Fox (7♣)", "Bear (10♣)", "Stars (8♣)", "Stork (9♣)", "Dog (Jack♣)", "Tower (8♣)", "Garden (Queen♣)", "Mountain (7♣)", "Crossroads (6♣)", "Mice (8♣)", "Heart (7♣)", "Ring (9♣)", "Book (Jack♣)", "Letter (7♣)", "Gentleman (King♣)", "Lady (Queen♣)", "Lilies (10♣)", "Sun (7♣)", "Moon (8♣)", "Key (6♣)", "Fish (9♣)", "Anchor (10♣)", "Cross (6♣)"]
  },
  {
    suit: "Diamonds",
    icon: Diamond,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
    meaning: "Communication, creativity, action, air energy",
    cards: ["Rider (Jack♦)", "Clover (8♦)", "Ship (6♦)", "House (9♦)", "Tree (Ace♦)", "Clouds (7♦)", "Snake (Ace♦)", "Coffin (7♦)", "Bouquet (9♦)", "Scythe (8♦)", "Whip (King♦)", "Birds (10♦)", "Child (9♦)", "Fox (6♦)", "Bear (7♦)", "Stars (9♦)", "Stork (8♦)", "Dog (Ace♦)", "Tower (10♦)", "Garden (Jack♦)", "Mountain (6♦)", "Crossroads (8♦)", "Mice (7♦)", "Heart (8♦)", "Ring (6♦)", "Book (Queen♦)", "Letter (8♦)", "Gentleman (Jack♦)", "Lady (Jack♦)", "Lilies (8♦)", "Sun (6♦)", "Moon (9♦)", "Key (7♦)", "Fish (8♦)", "Anchor (6♦)", "Cross (9♦)"]
  },
  {
    suit: "Spades",
    icon: Spade,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/20",
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* Navigation */}
      <div className="sticky top-14 z-40 border-b border-amber-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/learn">
              <Button variant="ghost" size="sm" className="text-amber-700 dark:text-amber-300 hover:text-amber-600 dark:hover:text-amber-400">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Course
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                Module 6 of 6
              </Badge>
              <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
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
            <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-amber-900 dark:text-amber-100 mb-4">
            Advanced Concepts
          </h1>
          <p className="text-lg text-amber-800 dark:text-amber-200 max-w-2xl mx-auto">
            Master the deeper layers of Lenormand: time associations, playing card connections, and cultural interpretations.
          </p>
          <div className="flex items-center justify-center mt-4 space-x-4 text-sm text-amber-700 dark:text-amber-300">
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
        <Card className="mb-8 border-indigo-400/20 dark:border-indigo-400/30 bg-gradient-to-br from-white via-indigo-50/50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="text-2xl text-indigo-900 dark:text-indigo-100 flex items-center">
              <Clock className="w-6 h-6 mr-3 text-indigo-600" />
              Time Associations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-indigo-800 dark:text-indigo-200 leading-relaxed mb-6">
              Many Lenormand cards have traditional associations with timing. While not every reading requires precise time predictions, these associations can provide valuable context about when events may occur.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {timeAssociations.map((item, index) => (
                <div key={index} className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-indigo-900 dark:text-indigo-100">{item.card}</h4>
                    <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                      {item.time}
                    </Badge>
                  </div>
                  <p className="text-indigo-700 dark:text-indigo-300 text-sm">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-indigo-100 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800 mt-6">
              <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">Important Notes:</h4>
              <ul className="text-indigo-800 dark:text-indigo-200 text-sm space-y-1">
                <li>• Time associations are traditional guidelines, not absolute predictions</li>
                <li>• Context from surrounding cards can modify timing</li>
                <li>• Some cards (like Clouds) indicate uncertain or delayed timing</li>
                <li>• Use intuition alongside traditional associations</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Playing Card Associations */}
        <Card className="mb-8 border-emerald-400/20 dark:border-emerald-400/30 bg-gradient-to-br from-white via-emerald-50/50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="text-2xl text-emerald-900 dark:text-emerald-100 flex items-center">
              <Spade className="w-6 h-6 mr-3 text-emerald-600" />
              Playing Card Associations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-emerald-800 dark:text-emerald-200 leading-relaxed mb-6">
              Lenormand cards have traditional associations with playing cards (suits and numbers). These connections can add deeper layers of meaning and are particularly important in Hoodoo and other African Traditional Religions.
            </p>

            <div className="grid gap-6">
              {playingCardAssociations.map((suit, index) => (
                <div key={index} className={`p-6 rounded-lg border ${suit.bgColor}`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <suit.icon className={`w-8 h-8 ${suit.color}`} />
                    <div>
                      <h3 className={`text-xl font-semibold ${suit.color.replace('text-', 'text-').replace('-600', '-900')} dark:text-emerald-100`}>
                        {suit.suit}
                      </h3>
                      <p className="text-emerald-700 dark:text-emerald-300 text-sm">
                        {suit.meaning}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-emerald-600 dark:text-emerald-400">
                    <p className="mb-2"><strong>Associated Lenormand cards:</strong></p>
                    <p className="leading-relaxed">
                      {suit.cards.slice(0, 12).join(', ')}...
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-emerald-100 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800 mt-6">
              <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">How to Use Playing Cards:</h4>
              <ul className="text-emerald-800 dark:text-emerald-200 text-sm space-y-1">
                <li>• Add playing card associations for additional context</li>
                <li>• Particularly useful in Hoodoo and ATR practices</li>
                <li>• Can provide numerological insights</li>
                <li>• Helps with more precise timing and energy readings</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Cultural Interpretations */}
        <Card className="mb-8 border-rose-400/20 dark:border-rose-400/30 bg-gradient-to-br from-white via-rose-50/50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="text-2xl text-rose-900 dark:text-rose-100 flex items-center">
              <Globe className="w-6 h-6 mr-3 text-rose-600" />
              Cultural Interpretations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-rose-800 dark:text-rose-200 leading-relaxed mb-6">
              Lenormand has evolved differently across cultures. Understanding these various schools of thought can enrich your readings and help you choose the approach that resonates most with your practice.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {culturalInterpretations.map((culture, index) => (
                <div key={index} className="bg-rose-50 dark:bg-rose-900/20 p-6 rounded-lg border border-rose-200 dark:border-rose-800">
                  <h3 className="text-lg font-semibold text-rose-900 dark:text-rose-100 mb-3">
                    {culture.culture}
                  </h3>
                  <p className="text-rose-800 dark:text-rose-200 text-sm mb-4">
                    {culture.description}
                  </p>
                  <div>
                    <h4 className="font-semibold text-rose-900 dark:text-rose-100 mb-2 text-sm">Characteristics:</h4>
                    <ul className="space-y-1">
                      {culture.characteristics.map((char, charIndex) => (
                        <li key={charIndex} className="text-rose-700 dark:text-rose-300 text-sm flex items-center">
                          <span className="text-rose-500 mr-2">•</span>
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
        <Card className="mb-8 border-purple-400/20 dark:border-purple-400/30 bg-gradient-to-br from-white via-purple-50/50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-900 dark:text-purple-100 flex items-center">
              <Lightbulb className="w-6 h-6 mr-3 text-purple-600" />
              Advanced Practice Techniques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-800 dark:text-purple-200">Study Card Combinations</h4>
                    <p className="text-purple-700 dark:text-purple-300 text-sm mt-1">
                      Learn how cards modify each other when they appear together. Some combinations create entirely new meanings.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-800 dark:text-purple-200">Practice Grand Tableau</h4>
                    <p className="text-purple-700 dark:text-purple-300 text-sm mt-1">
                      Master the 36-card Grand Tableau for comprehensive readings. Start with simple questions and work up to complex ones.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-800 dark:text-purple-200">Explore Cultural Contexts</h4>
                    <p className="text-purple-700 dark:text-purple-300 text-sm mt-1">
                      Study different cultural approaches to Lenormand. Incorporate elements that resonate with your background and practice.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-800 dark:text-purple-200">Develop Your Style</h4>
                    <p className="text-purple-700 dark:text-purple-300 text-sm mt-1">
                      As you gain experience, develop your own associations and techniques. Lenormand is a living tradition that evolves with its practitioners.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Completion */}
        <Card className="mb-8 border-amber-400/20 dark:border-amber-400/30 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/40 dark:via-yellow-950/40 dark:to-orange-950/40">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-4">
              🎉 Course Complete!
            </h3>
            <p className="text-amber-800 dark:text-amber-200 mb-6 max-w-2xl mx-auto">
              Congratulations! You&apos;ve completed the comprehensive Lenormand Wisdom Course. You now have the knowledge and tools to begin your journey as a Lenormand reader.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/read/new">
                <Button className="bg-gradient-to-r from-amber-600 via-rose-500 to-purple-600 hover:from-amber-700 hover:via-rose-600 hover:to-purple-700 text-white">
                  Start Your First Reading
                </Button>
              </Link>
              <Link href="/cards">
                <Button variant="outline" className="border-amber-600/50 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/20">
                  Explore the Cards
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-amber-200/50 dark:border-slate-700/50">
          <Link href="/learn/spreads">
            <Button variant="outline" className="border-amber-600/50 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Spreads
            </Button>
          </Link>
          <Link href="/read/new">
            <Button className="bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-600 hover:from-violet-700 hover:via-purple-600 hover:to-indigo-700 text-white">
              Start Reading Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}