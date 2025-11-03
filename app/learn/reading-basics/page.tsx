import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  ArrowRight,
  Target,
  Shuffle,
  Eye,
  MessageSquare,
  RotateCcw,
  BookOpen
} from 'lucide-react'

export default function ReadingBasicsPage() {
  const differences = [
    {
      feature: "Reversals",
      lenormand: "No reversals - meanings are built into each card",
      tarot: "Reversals add complexity and nuance",
      icon: RotateCcw
    },
    {
      feature: "Reading Style",
      lenormand: "Read as sentences in card order",
      tarot: "Intuitive interpretation of symbols",
      icon: MessageSquare
    },
    {
      feature: "Symbolism",
      lenormand: "Concrete, everyday symbols",
      tarot: "Archetypal, esoteric symbolism",
      icon: Eye
    },
    {
      feature: "Focus",
      lenormand: "Practical guidance and timing",
      tarot: "Spiritual growth and transformation",
      icon: Target
    }
  ]

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
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Module 3 of 6
              </Badge>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Beginner
              </Badge>
            </div>
            <Link href="/learn/card-meanings">
              <Button variant="ghost" size="sm" className="text-amber-700 dark:text-amber-300 hover:text-amber-600 dark:hover:text-amber-400">
                Next Module
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Module Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-amber-900 dark:text-amber-100 mb-4">
            How to Read Lenormand
          </h1>
          <p className="text-lg text-amber-800 dark:text-amber-200 max-w-2xl mx-auto">
            Master the fundamental techniques of Lenormand divination. Learn how to read cards as meaningful sentences.
          </p>
          <div className="flex items-center justify-center mt-4 space-x-4 text-sm text-amber-700 dark:text-amber-300">
            <div className="flex items-center">
              <Target className="w-4 h-4 mr-1" />
              25 minutes
            </div>
            <div className="flex items-center">
              <BookOpen className="w-4 h-4 mr-1" />
              Beginner Level
            </div>
          </div>
        </div>

        {/* Key Differences */}
        <Card className="mb-8 border-purple-400/20 dark:border-purple-400/30 bg-gradient-to-br from-white via-purple-50/50 to-indigo-50 dark:from-slate-950 dark:via-purple-950/40 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-900 dark:text-purple-100 flex items-center">
              <Eye className="w-6 h-6 mr-3 text-purple-600" />
              Lenormand vs. Tarot: Key Differences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {differences.map((diff, index) => (
                <div key={index} className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center mb-2">
                    <diff.icon className="w-5 h-5 text-purple-600 mr-2" />
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100">{diff.feature}</h4>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-purple-800 dark:text-purple-200">Lenormand:</span>
                      <p className="text-purple-700 dark:text-purple-300 mt-1">{diff.lenormand}</p>
                    </div>
                    <div>
                      <span className="font-medium text-purple-800 dark:text-purple-200">Tarot:</span>
                      <p className="text-purple-700 dark:text-purple-300 mt-1">{diff.tarot}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reading as Sentences */}
        <Card className="mb-8 border-emerald-400/20 dark:border-emerald-400/30 bg-gradient-to-br from-white via-emerald-50/50 to-teal-50 dark:from-slate-950 dark:via-emerald-950/40 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="text-2xl text-emerald-900 dark:text-emerald-100 flex items-center">
              <MessageSquare className="w-6 h-6 mr-3 text-emerald-600" />
              Reading Cards as Sentences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-emerald-800 dark:text-emerald-200 leading-relaxed">
              The most distinctive feature of Lenormand reading is treating card meanings as words in a sentence. Unlike Tarot&apos;s symbolic interpretation, Lenormand cards are read in sequence to form coherent messages.
            </p>

            <div className="bg-emerald-100 dark:bg-emerald-900/20 p-6 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-3">Example: Three-Card Spread</h4>
              <div className="space-y-3">
                <div className="text-center">
                  <div className="inline-flex items-center space-x-4 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-2">
                        <span className="text-white font-bold">1</span>
                      </div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">The Rider</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">News, Messages</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center mb-2">
                        <span className="text-white font-bold">2</span>
                      </div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">The Snake</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Deception, Wisdom</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-2">
                        <span className="text-white font-bold">3</span>
                      </div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">The Bouquet</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Gift, Celebration</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-emerald-900 dark:text-emerald-100 font-medium">Possible Interpretations:</p>
                  <ul className="space-y-1 text-sm text-emerald-800 dark:text-emerald-200">
                    <li>• &ldquo;News about deception brings a gift&rdquo; - Warning about deceptive news that leads to something positive</li>
                    <li>• &ldquo;A message reveals hidden wisdom as a gift&rdquo; - Learning something valuable from a communication</li>
                    <li>• &ldquo;Quick changes bring celebration&rdquo; - Positive changes happening soon</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Reading Steps */}
        <Card className="mb-8 border-amber-400/20 dark:border-amber-400/30 bg-gradient-to-br from-white via-amber-50/50 to-rose-50 dark:from-slate-950 dark:via-amber-950/40 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="text-2xl text-amber-900 dark:text-amber-100 flex items-center">
              <Shuffle className="w-6 h-6 mr-3 text-amber-600" />
              Basic Reading Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900 dark:text-amber-100">Prepare Your Space</h4>
                  <p className="text-amber-800 dark:text-amber-200 text-sm mt-1">
                    Find a quiet, comfortable space. Clear your mind and focus on your question or situation.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900 dark:text-amber-100">Shuffle Intuitively</h4>
                  <p className="text-amber-800 dark:text-amber-200 text-sm mt-1">
                    Shuffle the cards while thinking about your question. When you feel ready, stop shuffling.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900 dark:text-amber-100">Draw Your Cards</h4>
                  <p className="text-amber-800 dark:text-amber-200 text-sm mt-1">
                    Draw cards in the spread pattern you&apos;re using. Place them face up in order.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900 dark:text-amber-100">Read as a Sentence</h4>
                  <p className="text-amber-800 dark:text-amber-200 text-sm mt-1">
                    Read the card meanings in sequence to form a coherent message or story.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">5</span>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900 dark:text-amber-100">Trust Your Intuition</h4>
                  <p className="text-amber-800 dark:text-amber-200 text-sm mt-1">
                    While meanings are concrete, your intuition helps connect the dots and find personal relevance.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Spreads */}
        <Card className="mb-8 border-rose-400/20 dark:border-rose-400/30 bg-gradient-to-br from-white via-rose-50/50 to-pink-50 dark:from-slate-950 dark:via-rose-950/40 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="text-2xl text-rose-900 dark:text-rose-100 flex items-center">
              <Target className="w-6 h-6 mr-3 text-rose-600" />
              Popular Beginner Spreads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-rose-800 dark:text-rose-200">3-Card Spread</h4>
                <p className="text-sm text-rose-700 dark:text-rose-300">
                  Past → Present → Future. Simple and effective for quick insights.
                </p>
                <div className="text-xs text-rose-600 dark:text-rose-400">
                  Best for: Daily guidance, quick answers
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-rose-800 dark:text-rose-200">5-Card Spread</h4>
                <p className="text-sm text-rose-700 dark:text-rose-300">
                  Situation → Challenge → Advice → Outcome → Timing.
                </p>
                <div className="text-xs text-rose-600 dark:text-rose-400">
                  Best for: Detailed problem-solving
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-rose-800 dark:text-rose-200">9-Card Spread</h4>
                <p className="text-sm text-rose-700 dark:text-rose-300">
                  Comprehensive life overview with detailed insights.
                </p>
                <div className="text-xs text-rose-600 dark:text-rose-400">
                  Best for: Major life decisions
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-rose-800 dark:text-rose-200">36-Card Grand Tableau</h4>
                <p className="text-sm text-rose-700 dark:text-rose-300">
                  Complete reading using all cards for maximum detail.
                </p>
                <div className="text-xs text-rose-600 dark:text-rose-400">
                  Best for: Advanced practitioners
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-amber-200/50 dark:border-slate-700/50">
          <Link href="/learn/history">
            <Button variant="outline" className="border-amber-600/50 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to History
            </Button>
          </Link>
          <Link href="/learn/card-meanings">
            <Button className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 hover:from-emerald-700 hover:via-teal-600 hover:to-cyan-700 text-white">
              Continue to Card Meanings
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}