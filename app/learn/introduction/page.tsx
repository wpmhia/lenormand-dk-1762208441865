import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Heart,
  BookOpen,
  Users,
  Star,
  Clock,
  Target
} from 'lucide-react'

export default function IntroductionPage() {
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
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Module 1 of 6
              </Badge>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Beginner
              </Badge>
            </div>
            <Link href="/learn/history">
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
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
           <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Introduction to Lenormand
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Welcome to the fascinating world of Lenormand divination. Let&apos;s explore what makes this 36-card oracle so special and powerful.
          </p>
          <div className="flex items-center justify-center mt-4 space-x-4 text-sm text-primary">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              15 minutes
            </div>
            <div className="flex items-center">
              <Target className="w-4 h-4 mr-1" />
              Beginner Level
            </div>
          </div>
        </div>

        {/* What is Lenormand */}
        <Card className="mb-8 border-border bg-card">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground flex items-center">
              <Sparkles className="w-6 h-6 mr-3 text-primary" />
              What is Lenormand?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Lenormand is a form of cartomancy (divination using cards) that originated in 18th century France. Unlike Tarot&apos;s esoteric symbolism, Lenormand speaks in the language of everyday symbols and practical wisdom. Its 36 cards represent concrete concepts, people, and situations that mirror real life.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Named after the famous French fortune teller Marie Anne Adelaide Lenormand, this system has been used for over two centuries to provide clear, direct guidance on relationships, career, health, and life&apos;s important decisions.
            </p>
          </CardContent>
        </Card>

        {/* Lenormand vs Tarot */}
        <Card className="mb-8 border-border bg-card">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground flex items-center">
              <Star className="w-6 h-6 mr-3 text-primary" />
              Lenormand vs. Tarot
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Lenormand</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 36 cards with concrete meanings</li>
                  <li>• No reversals - meanings are built-in</li>
                  <li>• Read as sentences, not individual symbols</li>
                  <li>• Practical, everyday guidance</li>
                  <li>• Focus on timing and relationships</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Tarot</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 78 cards with archetypal symbolism</li>
                  <li>• Reversals add complexity</li>
                  <li>• Intuitive, psychological readings</li>
                  <li>• Spiritual and esoteric guidance</li>
                  <li>• Focus on personal growth and transformation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why Learn Lenormand */}
        <Card className="mb-8 border-border bg-card">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground flex items-center">
              <Heart className="w-6 h-6 mr-3 text-primary" />
              Why Learn Lenormand?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Target className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Direct Answers</h4>
                    <p className="text-sm text-muted-foreground">
                      Get clear, practical guidance without esoteric interpretation
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Relationship Focus</h4>
                    <p className="text-sm text-muted-foreground">
                      Excel at understanding interpersonal dynamics and emotions
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Timing Insights</h4>
                    <p className="text-sm text-muted-foreground">
                      Understand when events will occur with remarkable accuracy
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <BookOpen className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Accessible Learning</h4>
                    <p className="text-sm text-muted-foreground">
                      Master the system quickly with concrete meanings and associations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What You'll Learn */}
        <Card className="mb-8 border-border bg-card">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground flex items-center">
              <Star className="w-6 h-6 mr-3 text-primary" />
              What You&apos;ll Learn in This Course
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">History & Origins</h4>
                  <p className="text-sm text-muted-foreground">
                    Discover the fascinating story behind Lenormand and its evolution
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Reading Fundamentals</h4>
                  <p className="text-sm text-muted-foreground">
                    Master the art of reading cards as meaningful sentences
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Card Meanings</h4>
                  <p className="text-sm text-muted-foreground">
                    Learn all 36 card meanings and their symbolic associations
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Spreads & Techniques</h4>
                  <p className="text-sm text-muted-foreground">
                    Discover powerful spreads and advanced reading methods
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">5</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Advanced Concepts</h4>
                  <p className="text-sm text-muted-foreground">
                    Time associations, playing cards, and cultural interpretations
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-border">
          <Link href="/learn">
            <Button variant="outline" className="border-border text-card-foreground hover:bg-muted">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Course Overview
            </Button>
          </Link>
          <Link href="/learn/history">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Continue to History
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}