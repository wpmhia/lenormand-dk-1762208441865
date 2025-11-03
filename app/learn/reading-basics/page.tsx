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
               <Badge className="bg-primary/10 text-primary border-primary/30 dark:bg-primary/20 dark:text-primary dark:border-primary/40">
                 Module 3 of 6
               </Badge>
               <Badge className="bg-primary/10 text-primary border-primary/30 dark:bg-primary/20 dark:text-primary dark:border-primary/40">
                 Beginner
               </Badge>
             </div>
            <Link href="/learn/card-meanings">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
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
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How to Read Lenormand
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Master the fundamental techniques of Lenormand divination. Learn how to read cards as meaningful sentences.
          </p>
          <div className="flex items-center justify-center mt-4 space-x-4 text-sm text-primary">
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
        <Card className="mb-8 border-border bg-card">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground flex items-center">
              <Eye className="w-6 h-6 mr-3 text-primary" />
              Lenormand vs. Tarot: Key Differences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {differences.map((diff, index) => (
                <div key={index} className="bg-muted p-4 rounded-lg border border-border">
                  <div className="flex items-center mb-2">
                    <diff.icon className="w-5 h-5 text-primary mr-2" />
                    <h4 className="font-semibold text-foreground">{diff.feature}</h4>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-card-foreground">Lenormand:</span>
                      <p className="text-muted-foreground mt-1">{diff.lenormand}</p>
                    </div>
                    <div>
                      <span className="font-medium text-card-foreground">Tarot:</span>
                      <p className="text-muted-foreground mt-1">{diff.tarot}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reading as Sentences */}
        <Card className="mb-8 border-border bg-card">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground flex items-center">
              <MessageSquare className="w-6 h-6 mr-3 text-primary" />
              Reading Cards as Sentences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              The most distinctive feature of Lenormand reading is treating card meanings as words in a sentence. Unlike Tarot&apos;s symbolic interpretation, Lenormand cards are read in sequence to form coherent messages.
            </p>

            <div className="bg-muted p-6 rounded-lg border border-border">
              <h4 className="font-semibold text-foreground mb-3">Example: Three-Card Spread</h4>
              <div className="space-y-3">
                <div className="text-center">
                  <div className="inline-flex items-center space-x-4 bg-card p-4 rounded-lg shadow-sm">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center mb-2">
                        <span className="text-white font-bold">1</span>
                      </div>
                      <p className="text-sm font-medium text-foreground">The Rider</p>
                      <p className="text-xs text-muted-foreground">News, Messages</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-muted to-muted/80 rounded-lg flex items-center justify-center mb-2">
                        <span className="text-white font-bold">2</span>
                      </div>
                      <p className="text-sm font-medium text-foreground">The Snake</p>
                      <p className="text-xs text-muted-foreground">Deception, Wisdom</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center mb-2">
                        <span className="text-white font-bold">3</span>
                      </div>
                      <p className="text-sm font-medium text-foreground">The Bouquet</p>
                      <p className="text-xs text-muted-foreground">Gift, Celebration</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-foreground font-medium">Possible Interpretations:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
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
        <Card className="mb-8 border-border bg-card">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground flex items-center">
              <Shuffle className="w-6 h-6 mr-3 text-primary" />
              Basic Reading Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Prepare Your Space</h4>
                  <p className="text-muted-foreground text-sm mt-1">
                    Find a quiet, comfortable space. Clear your mind and focus on your question or situation.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Shuffle Intuitively</h4>
                  <p className="text-muted-foreground text-sm mt-1">
                    Shuffle the cards while thinking about your question. When you feel ready, stop shuffling.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Draw Your Cards</h4>
                  <p className="text-muted-foreground text-sm mt-1">
                    Draw cards in the spread pattern you&apos;re using. Place them face up in order.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Read as a Sentence</h4>
                  <p className="text-muted-foreground text-sm mt-1">
                    Read the card meanings in sequence to form a coherent message or story.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">5</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Trust Your Intuition</h4>
                  <p className="text-muted-foreground text-sm mt-1">
                    While meanings are concrete, your intuition helps connect the dots and find personal relevance.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Spreads */}
        <Card className="mb-8 border-border bg-card">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground flex items-center">
              <Target className="w-6 h-6 mr-3 text-primary" />
              Popular Beginner Spreads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-card-foreground">3-Card Spread</h4>
                <p className="text-sm text-muted-foreground">
                  Past → Present → Future. Simple and effective for quick insights.
                </p>
                <div className="text-xs text-primary dark:text-primary/80">
                  Best for: Daily guidance, quick answers
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-card-foreground">5-Card Spread</h4>
                <p className="text-sm text-muted-foreground">
                  Situation → Challenge → Advice → Outcome → Timing.
                </p>
                <div className="text-xs text-primary dark:text-primary/80">
                  Best for: Detailed problem-solving
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-card-foreground">9-Card Spread</h4>
                <p className="text-sm text-muted-foreground">
                  Comprehensive life overview with detailed insights.
                </p>
                <div className="text-xs text-primary dark:text-primary/80">
                  Best for: Major life decisions
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-card-foreground">36-Card Grand Tableau</h4>
                <p className="text-sm text-muted-foreground">
                  Complete reading using all cards for maximum detail.
                </p>
                <div className="text-xs text-primary dark:text-primary/80">
                  Best for: Advanced practitioners
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-border">
          <Link href="/learn/history">
            <Button variant="outline" className="border-border text-card-foreground hover:bg-muted">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to History
            </Button>
          </Link>
          <Link href="/learn/card-meanings">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Continue to Card Meanings
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}