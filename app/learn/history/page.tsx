import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  MapPin,
  User,
  Crown,
  BookOpen,
  Sparkles
} from 'lucide-react'

export default function HistoryPage() {
  const timeline = [
    {
      year: "1790s",
      title: "Marie Anne Adelaide Lenormand",
      description: "The famous French fortune teller begins her career, gaining fame for her accurate predictions and readings for Napoleon Bonaparte.",
      icon: User,
      color: "from-amber-500 to-rose-500"
    },
    {
      year: "Early 1800s",
      title: "The Petit Lenormand",
      description: "The first Lenormand decks appear, based on Marie Lenormand's system. These early decks feature simple, symbolic imagery.",
      icon: BookOpen,
      color: "from-purple-500 to-indigo-500"
    },
    {
      year: "1840s-1860s",
      title: "Golden Age of Cartomancy",
      description: "Lenormand becomes extremely popular in Europe, especially in France and Germany. Various schools of interpretation develop.",
      icon: Crown,
      color: "from-emerald-500 to-teal-500"
    },
    {
      year: "Modern Era",
      title: "Global Renaissance",
      description: "Lenormand experiences a worldwide revival, with contemporary artists creating beautiful new decks and innovative interpretations.",
      icon: Sparkles,
      color: "from-rose-500 to-pink-500"
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
                Module 2 of 6
              </Badge>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Beginner
              </Badge>
            </div>
            <Link href="/learn/reading-basics">
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
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-amber-900 dark:text-amber-100 mb-4">
            History & Origins
          </h1>
          <p className="text-lg text-amber-800 dark:text-amber-200 max-w-2xl mx-auto">
            Journey through time to discover how Lenormand divination evolved from 18th century France to become a global phenomenon.
          </p>
          <div className="flex items-center justify-center mt-4 space-x-4 text-sm text-amber-700 dark:text-amber-300">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              20 minutes
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              Beginner Level
            </div>
          </div>
        </div>

        {/* Marie Lenormand */}
        <Card className="mb-8 border-amber-400/20 dark:border-amber-400/30 bg-gradient-to-br from-white via-amber-50/50 to-rose-50 dark:from-slate-950 dark:via-amber-950/40 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="text-2xl text-amber-900 dark:text-amber-100 flex items-center">
              <User className="w-6 h-6 mr-3 text-amber-600" />
              Marie Anne Adelaide Lenormand
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-amber-800 dark:text-amber-200 leading-relaxed">
              Born in 1772 in Alençon, France, Marie Anne Adelaide Lenormand was one of the most famous fortune tellers of the 18th and 19th centuries. Her extraordinary accuracy and high-profile clientele made her a legend in her time.
            </p>
            <p className="text-amber-800 dark:text-amber-200 leading-relaxed">
              Among her famous clients were Napoleon Bonaparte, Empress Josephine, and many other figures of French aristocracy. Her predictions were said to be remarkably accurate, and               she became known as &ldquo;the Sibyl of the Faubourg Saint-Germain.&rdquo;
            </p>
            <div className="bg-amber-100 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-amber-900 dark:text-amber-100 text-sm italic">
                &ldquo;Lenormand predicted Napoleon&apos;s defeat at Waterloo and his exile to St. Helena. She also foresaw the restoration of the monarchy and the fall of Charles X.&rdquo;
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Historical Timeline */}
        <Card className="mb-8 border-purple-400/20 dark:border-purple-400/30 bg-gradient-to-br from-white via-purple-50/50 to-indigo-50 dark:from-slate-950 dark:via-purple-950/40 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-900 dark:text-purple-100 flex items-center">
              <Clock className="w-6 h-6 mr-3 text-purple-600" />
              The Evolution of Lenormand
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {timeline.map((event, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${event.color} flex items-center justify-center flex-shrink-0 mt-1`}>
                    <event.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                        {event.year}
                      </Badge>
                      <h4 className="font-semibold text-purple-900 dark:text-purple-100">
                        {event.title}
                      </h4>
                    </div>
                    <p className="text-purple-800 dark:text-purple-200 text-sm leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cultural Evolution */}
        <Card className="mb-8 border-emerald-400/20 dark:border-emerald-400/30 bg-gradient-to-br from-white via-emerald-50/50 to-teal-50 dark:from-slate-950 dark:via-emerald-950/40 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="text-2xl text-emerald-900 dark:text-emerald-100 flex items-center">
              <MapPin className="w-6 h-6 mr-3 text-emerald-600" />
              Cultural Schools of Thought
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">French School</h4>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  Emphasizes elegance and sophistication. Focuses on courtly imagery and aristocratic symbolism. Known for its poetic interpretations.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">German School</h4>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  Practical and straightforward. Emphasizes everyday symbolism and concrete meanings. Known for systematic approaches.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">Contemporary School</h4>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  Blends traditional wisdom with modern interpretations. Incorporates diverse cultural perspectives and innovative symbolism.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">Playing Card Associations</h4>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  Links Lenormand cards to traditional playing cards (clubs, hearts, diamonds, spades) for additional layers of meaning.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modern Revival */}
        <Card className="mb-8 border-rose-400/20 dark:border-rose-400/30 bg-gradient-to-br from-white via-rose-50/50 to-pink-50 dark:from-slate-950 dark:via-rose-950/40 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="text-2xl text-rose-900 dark:text-rose-100 flex items-center">
              <Sparkles className="w-6 h-6 mr-3 text-rose-600" />
              The Modern Renaissance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-rose-800 dark:text-rose-200 leading-relaxed">
              In recent decades, Lenormand has experienced a remarkable revival. Contemporary artists and spiritual practitioners have created beautiful new decks that honor traditional meanings while incorporating diverse cultural perspectives.
            </p>
            <p className="text-rose-800 dark:text-rose-200 leading-relaxed">
              Today, Lenormand is practiced worldwide, with readers from every culture adding their unique interpretations and symbolism. This diversity has enriched the system, making it more inclusive and accessible to modern seekers.
            </p>
            <div className="bg-rose-100 dark:bg-rose-900/20 p-4 rounded-lg border border-rose-200 dark:border-rose-800">
              <p className="text-rose-900 dark:text-rose-100 text-sm">
                <strong>Did you know?</strong> Lenormand cards are experiencing their greatest popularity since the 19th century, with new decks being created by artists from around the world.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-amber-200/50 dark:border-slate-700/50">
          <Link href="/learn/introduction">
            <Button variant="outline" className="border-amber-600/50 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Introduction
            </Button>
          </Link>
          <Link href="/learn/reading-basics">
            <Button className="bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 hover:from-purple-700 hover:via-indigo-600 hover:to-blue-700 text-white">
              Continue to Reading Basics
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}