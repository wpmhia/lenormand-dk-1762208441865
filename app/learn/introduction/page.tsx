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
                Module 1 of 6
              </Badge>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Beginner
              </Badge>
            </div>
            <Link href="/learn/history">
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
            <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-amber-900 dark:text-amber-100 mb-4">
            Introduction to Lenormand
          </h1>
          <p className="text-lg text-amber-800 dark:text-amber-200 max-w-2xl mx-auto">
            Welcome to the fascinating world of Lenormand divination. Let&apos;s explore what makes this 36-card oracle so special and powerful.
          </p>
          <div className="flex items-center justify-center mt-4 space-x-4 text-sm text-amber-700 dark:text-amber-300">
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
        <Card className="mb-8 border-amber-400/20 dark:border-amber-400/30 bg-gradient-to-br from-white via-amber-50/50 to-rose-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="text-2xl text-amber-900 dark:text-amber-100 flex items-center">
              <Sparkles className="w-6 h-6 mr-3 text-amber-600" />
              What is Lenormand?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-amber-800 dark:text-amber-200 leading-relaxed">
              Lenormand is a form of cartomancy (divination using cards) that originated in 18th century France. Unlike Tarot&apos;s esoteric symbolism, Lenormand speaks in the language of everyday symbols and practical wisdom. Its 36 cards represent concrete concepts, people, and situations that mirror real life.
            </p>
            <p className="text-amber-800 dark:text-amber-200 leading-relaxed">
              Named after the famous French fortune teller Marie Anne Adelaide Lenormand, this system has been used for over two centuries to provide clear, direct guidance on relationships, career, health, and life&apos;s important decisions.
            </p>
          </CardContent>
        </Card>

        {/* Lenormand vs Tarot */}
        <Card className="mb-8 border-purple-400/20 dark:border-purple-400/30 bg-gradient-to-br from-white via-purple-50/50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-900 dark:text-purple-100 flex items-center">
              <Star className="w-6 h-6 mr-3 text-purple-600" />
              Lenormand vs. Tarot
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-purple-800 dark:text-purple-200">Lenormand</h4>
                <ul className="space-y-2 text-sm text-purple-700 dark:text-purple-300">
                  <li>• 36 cards with concrete meanings</li>
                  <li>• No reversals - meanings are built-in</li>
                  <li>• Read as sentences, not individual symbols</li>
                  <li>• Practical, everyday guidance</li>
                  <li>• Focus on timing and relationships</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-purple-800 dark:text-purple-200">Tarot</h4>
                <ul className="space-y-2 text-sm text-purple-700 dark:text-purple-300">
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
        <Card className="mb-8 border-emerald-400/20 dark:border-emerald-400/30 bg-gradient-to-br from-white via-emerald-50/50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="text-2xl text-emerald-900 dark:text-emerald-100 flex items-center">
              <Heart className="w-6 h-6 mr-3 text-emerald-600" />
              Why Learn Lenormand?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Target className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">Direct Answers</h4>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">
                      Get clear, practical guidance without esoteric interpretation
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">Relationship Focus</h4>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">
                      Excel at understanding interpersonal dynamics and emotions
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">Timing Insights</h4>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">
                      Understand when events will occur with remarkable accuracy
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <BookOpen className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">Accessible Learning</h4>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">
                      Master the system quickly with concrete meanings and associations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What You'll Learn */}
        <Card className="mb-8 border-rose-400/20 dark:border-rose-400/30 bg-gradient-to-br from-white via-rose-50/50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="text-2xl text-rose-900 dark:text-rose-100 flex items-center">
              <Star className="w-6 h-6 mr-3 text-rose-600" />
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
                  <h4 className="font-semibold text-rose-800 dark:text-rose-200">History & Origins</h4>
                  <p className="text-sm text-rose-700 dark:text-rose-300">
                    Discover the fascinating story behind Lenormand and its evolution
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-rose-800 dark:text-rose-200">Reading Fundamentals</h4>
                  <p className="text-sm text-rose-700 dark:text-rose-300">
                    Master the art of reading cards as meaningful sentences
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-rose-800 dark:text-rose-200">Card Meanings</h4>
                  <p className="text-sm text-rose-700 dark:text-rose-300">
                    Learn all 36 card meanings and their symbolic associations
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-semibold text-rose-800 dark:text-rose-200">Spreads & Techniques</h4>
                  <p className="text-sm text-rose-700 dark:text-rose-300">
                    Discover powerful spreads and advanced reading methods
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">5</span>
                </div>
                <div>
                  <h4 className="font-semibold text-rose-800 dark:text-rose-200">Advanced Concepts</h4>
                  <p className="text-sm text-rose-700 dark:text-rose-300">
                    Time associations, playing cards, and cultural interpretations
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-amber-200/50 dark:border-slate-700/50">
          <Link href="/learn">
            <Button variant="outline" className="border-amber-600/50 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Course Overview
            </Button>
          </Link>
          <Link href="/learn/history">
            <Button className="bg-gradient-to-r from-amber-600 via-rose-500 to-purple-600 hover:from-amber-700 hover:via-rose-600 hover:to-purple-700 text-white">
              Continue to History
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}