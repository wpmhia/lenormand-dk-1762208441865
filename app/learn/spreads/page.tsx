import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Target,
  Users,
  TrendingUp,
  Clock,
  MapPin
} from 'lucide-react'

const spreads = [
  {
    name: "3-Card Past-Present-Future",
    description: "Classic timeline spread for understanding progression",
    layout: "Past → Present → Future",
    useCase: "General guidance, life overview",
    difficulty: "Beginner",
    positions: [
      { name: "Past", description: "What has led to the current situation" },
      { name: "Present", description: "Current circumstances and energies" },
      { name: "Future", description: "Likely outcome or direction" }
    ]
  },
  {
    name: "5-Card Situation Spread",
    description: "Detailed analysis of a specific situation",
    layout: "Situation → Challenge → Advice → Outcome → Timing",
    useCase: "Problem-solving, decision making",
    difficulty: "Intermediate",
    positions: [
      { name: "Situation", description: "Current state of affairs" },
      { name: "Challenge", description: "Obstacles or difficulties" },
      { name: "Advice", description: "Guidance for moving forward" },
      { name: "Outcome", description: "Likely result of current path" },
      { name: "Timing", description: "When to expect developments" }
    ]
  },
  {
    name: "9-Card Celtic Cross Style",
    description: "Comprehensive life reading inspired by Tarot",
    layout: "Present → Challenge → Past → Future → Above → Below → Advice → External → Hopes/Fears",
    useCase: "Major life decisions, deep insight",
    difficulty: "Advanced",
    positions: [
      { name: "Present", description: "Current situation" },
      { name: "Challenge", description: "What crosses you" },
      { name: "Past", description: "Foundation of the situation" },
      { name: "Future", description: "What is coming" },
      { name: "Above", description: "Conscious influences" },
      { name: "Below", description: "Unconscious influences" },
      { name: "Advice", description: "Recommended action" },
      { name: "External", description: "Outside influences" },
      { name: "Hopes/Fears", description: "Inner motivations" }
    ]
  },
  {
    name: "Relationship Spread",
    description: "Understanding romantic or interpersonal dynamics",
    layout: "You → Partner → Relationship → Challenge → Advice → Outcome",
    useCase: "Love, friendships, partnerships",
    difficulty: "Intermediate",
    positions: [
      { name: "You", description: "Your energy in the relationship" },
      { name: "Partner", description: "Their energy and perspective" },
      { name: "Relationship", description: "The connection between you" },
      { name: "Challenge", description: "Issues to address" },
      { name: "Advice", description: "How to improve the situation" },
      { name: "Outcome", description: "Future of the relationship" }
    ]
  }
]

const techniques = [
  {
    name: "Card Pairing",
    description: "Reading cards in pairs to understand relationships",
    icon: Users,
    examples: [
      "Rider + Letter = Important message or news",
      "Heart + Ring = Committed relationship",
      "Snake + Book = Hidden knowledge or secrets"
    ]
  },
  {
    name: "Directional Flow",
    description: "Following the energy flow from left to right",
    icon: TrendingUp,
    examples: [
      "Mountain → Sun = Overcoming obstacles leads to success",
      "Clouds → Key = Confusion finds clarity",
      "Coffin → Stork = Ending leads to new beginning"
    ]
  },
  {
    name: "Knights Move",
    description: "Reading cards in an L-shaped pattern like a chess knight",
    icon: Target,
    examples: [
      "Card 1 → Card 6 → Card 11 (in a 3x4 grid)",
      "Card 2 → Card 7 → Card 12",
      "Reveals underlying patterns and connections"
    ]
  },
  {
    name: "Time Associations",
    description: "Using cards to indicate timing of events",
    icon: Clock,
    examples: [
      "Rider = Days or very soon",
      "Ship = Weeks or months",
      "House = Months or years",
      "Tree = Years or long-term"
    ]
  }
]

export default function SpreadsPage() {
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
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                Module 5 of 6
              </Badge>
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                Intermediate
              </Badge>
            </div>
            <Link href="/learn/advanced">
              <Button variant="ghost" size="sm" className="text-amber-700 dark:text-amber-300 hover:text-amber-600 dark:hover:text-amber-400">
                Next Module
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Module Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <Compass className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-amber-900 dark:text-amber-100 mb-4">
            Spreads & Techniques
          </h1>
          <p className="text-lg text-amber-800 dark:text-amber-200 max-w-2xl mx-auto">
            Discover powerful spreads and advanced reading techniques to enhance your Lenormand practice.
          </p>
          <div className="flex items-center justify-center mt-4 space-x-4 text-sm text-amber-700 dark:text-amber-300">
            <div className="flex items-center">
              <Compass className="w-4 h-4 mr-1" />
              30 minutes
            </div>
            <div className="flex items-center">
              <Target className="w-4 h-4 mr-1" />
              Intermediate Level
            </div>
          </div>
        </div>

        {/* Popular Spreads */}
        <Card className="mb-8 border-emerald-400/20 dark:border-emerald-400/30 bg-gradient-to-br from-white via-emerald-50/50 to-teal-50 dark:from-slate-950 dark:via-emerald-950/40 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="text-2xl text-emerald-900 dark:text-emerald-100 flex items-center">
              <Compass className="w-6 h-6 mr-3 text-emerald-600" />
              Popular Spreads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {spreads.map((spread, index) => (
                <Card key={index} className="border border-emerald-200 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/20">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                          {spread.name}
                        </h3>
                        <p className="text-emerald-800 dark:text-emerald-200 text-sm mb-2">
                          {spread.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-emerald-700 dark:text-emerald-300">
                          <span>Best for: {spread.useCase}</span>
                          <Badge className={
                            spread.difficulty === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                            spread.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          }>
                            {spread.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">Layout:</h4>
                      <p className="text-emerald-800 dark:text-emerald-200 font-medium text-sm">
                        {spread.layout}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-3">Positions:</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {spread.positions.map((position, posIndex) => (
                          <div key={posIndex} className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-white text-xs font-bold">{posIndex + 1}</span>
                            </div>
                            <div>
                              <h5 className="font-medium text-emerald-900 dark:text-emerald-100 text-sm">
                                {position.name}
                              </h5>
                              <p className="text-emerald-700 dark:text-emerald-300 text-xs">
                                {position.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Advanced Techniques */}
        <Card className="mb-8 border-blue-400/20 dark:border-blue-400/30 bg-gradient-to-br from-white via-blue-50/50 to-cyan-50 dark:from-slate-950 dark:via-blue-950/40 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-900 dark:text-blue-100 flex items-center">
              <Target className="w-6 h-6 mr-3 text-blue-600" />
              Advanced Reading Techniques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {techniques.map((technique, index) => (
                <Card key={index} className="border border-blue-200 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/20">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <technique.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                        {technique.name}
                      </h3>
                    </div>

                    <p className="text-blue-800 dark:text-blue-200 text-sm mb-4">
                      {technique.description}
                    </p>

                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 text-sm">Examples:</h4>
                      <ul className="space-y-1">
                        {technique.examples.map((example, exIndex) => (
                          <li key={exIndex} className="text-blue-700 dark:text-blue-300 text-sm flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Grand Tableau Introduction */}
        <Card className="mb-8 border-purple-400/20 dark:border-purple-400/30 bg-gradient-to-br from-white via-purple-50/50 to-indigo-50 dark:from-slate-950 dark:via-purple-950/40 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-900 dark:text-purple-100 flex items-center">
              <MapPin className="w-6 h-6 mr-3 text-purple-600" />
              The Grand Tableau (36-Card Reading)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-purple-800 dark:text-purple-200 leading-relaxed">
              The Grand Tableau is the most comprehensive Lenormand reading, using all 36 cards laid out in a specific pattern. This advanced technique provides deep insights into complex situations and long-term patterns.
            </p>

            <div className="bg-purple-100 dark:bg-purple-900/20 p-6 rounded-lg">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">Traditional Layout:</h4>
              <div className="text-center">
                <div className="inline-block bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                  <div className="grid grid-cols-8 gap-1 text-xs">
                    {Array.from({ length: 36 }, (_, i) => (
                      <div key={i} className="w-6 h-6 bg-purple-200 dark:bg-purple-700 rounded flex items-center justify-center text-purple-800 dark:text-purple-200 font-bold">
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                    8x4 grid formation (3 rows of 8, 1 row of 4 in center)
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">What it reveals:</h4>
                <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
                  <li>• Complete life overview</li>
                  <li>• Long-term patterns and cycles</li>
                  <li>• Hidden influences and connections</li>
                  <li>• Future possibilities and challenges</li>
                  <li>• Spiritual and karmic lessons</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">When to use:</h4>
                <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
                  <li>• Major life decisions</li>
                  <li>• Year-ahead readings</li>
                  <li>• Complex relationship issues</li>
                  <li>• Career and financial planning</li>
                  <li>• Spiritual guidance</li>
                </ul>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="text-purple-900 dark:text-purple-100 text-sm">
                <strong>Note:</strong> The Grand Tableau requires significant experience and can take 1-2 hours to read thoroughly. It&apos;s recommended for advanced practitioners.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Practice Tips */}
        <Card className="mb-8 border-rose-400/20 dark:border-rose-400/30 bg-gradient-to-br from-white via-rose-50/50 to-pink-50 dark:from-slate-950 dark:via-rose-950/40 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="text-2xl text-rose-900 dark:text-rose-100 flex items-center">
              <Target className="w-6 h-6 mr-3 text-rose-600" />
              Practice Your Spreads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold">1</span>
                </div>
                <h4 className="font-semibold text-rose-800 dark:text-rose-200">Start Small</h4>
                <p className="text-sm text-rose-700 dark:text-rose-300">
                  Begin with 3-card spreads to build confidence before moving to larger layouts.
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold">2</span>
                </div>
                <h4 className="font-semibold text-rose-800 dark:text-rose-200">Practice Daily</h4>
                <p className="text-sm text-rose-700 dark:text-rose-300">
                  Regular practice with different spreads helps you understand card interactions.
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold">3</span>
                </div>
                <h4 className="font-semibold text-rose-800 dark:text-rose-200">Keep a Journal</h4>
                <p className="text-sm text-rose-700 dark:text-rose-300">
                  Record your readings and revisit them later to see how accurate your interpretations were.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-amber-200/50 dark:border-slate-700/50">
          <Link href="/learn/card-meanings">
            <Button variant="outline" className="border-amber-600/50 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Card Meanings
            </Button>
          </Link>
          <Link href="/learn/advanced">
            <Button className="bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-600 hover:from-blue-700 hover:via-purple-600 hover:to-indigo-700 text-white">
              Continue to Advanced Concepts
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}