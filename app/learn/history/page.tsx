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
      color: "from-primary to-primary/80"
    },
    {
      year: "Early 1800s",
      title: "The Petit Lenormand",
      description: "The first Lenormand decks appear, based on Marie Lenormand's system. These early decks feature simple, symbolic imagery.",
      icon: BookOpen,
      color: "from-primary to-primary/80"
    },
    {
      year: "1840s-1860s",
      title: "Golden Age of Cartomancy",
      description: "Lenormand becomes extremely popular in Europe, especially in France and Germany. Various schools of interpretation develop.",
      icon: Crown,
      color: "from-primary to-primary/80"
    },
    {
      year: "Modern Era",
      title: "Global Renaissance",
      description: "Lenormand experiences a worldwide revival, with contemporary artists creating beautiful new decks and innovative interpretations.",
      icon: Sparkles,
      color: "from-primary to-primary/80"
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
                 Module 2 of 6
               </Badge>
               <Badge className="bg-primary/10 text-primary border-primary/30 dark:bg-primary/20 dark:text-primary dark:border-primary/40">
                 Beginner
               </Badge>
             </div>
            <Link href="/learn/reading-basics">
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
              <Clock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            History & Origins
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Journey through time to discover how Lenormand divination evolved from 18th century France to become a global phenomenon.
          </p>
          <div className="flex items-center justify-center mt-4 space-x-4 text-sm text-primary">
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
        <Card className="mb-8 border-border bg-card">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground flex items-center">
              <User className="w-6 h-6 mr-3 text-primary" />
              Marie Anne Adelaide Lenormand
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Born in 1772 in Alençon, France, Marie Anne Adelaide Lenormand was one of the most famous fortune tellers of the 18th and 19th centuries. Her extraordinary accuracy and high-profile clientele made her a legend in her time.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Among her famous clients were Napoleon Bonaparte, Empress Josephine, and many other figures of French aristocracy. Her predictions were said to be remarkably accurate, and               she became known as &ldquo;the Sibyl of the Faubourg Saint-Germain.&rdquo;
            </p>
            <div className="bg-muted p-4 rounded-lg border border-border">
              <p className="text-foreground text-sm italic">
                &ldquo;Lenormand predicted Napoleon&apos;s defeat at Waterloo and his exile to St. Helena. She also foresaw the restoration of the monarchy and the fall of Charles X.&rdquo;
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Historical Timeline */}
        <Card className="mb-8 border-border bg-card">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground flex items-center">
              <Clock className="w-6 h-6 mr-3 text-primary" />
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
                      <Badge className="bg-muted text-muted-foreground">
                        {event.year}
                      </Badge>
                      <h4 className="font-semibold text-foreground">
                        {event.title}
                      </h4>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cultural Evolution */}
        <Card className="mb-8 border-border bg-card">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground flex items-center">
              <MapPin className="w-6 h-6 mr-3 text-primary" />
              Cultural Schools of Thought
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">French School</h4>
                <p className="text-sm text-muted-foreground">
                  Emphasizes elegance and sophistication. Focuses on courtly imagery and aristocratic symbolism. Known for its poetic interpretations.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">German School</h4>
                <p className="text-sm text-muted-foreground">
                  Practical and straightforward. Emphasizes everyday symbolism and concrete meanings. Known for systematic approaches.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Contemporary School</h4>
                <p className="text-sm text-muted-foreground">
                  Blends traditional wisdom with modern interpretations. Incorporates diverse cultural perspectives and innovative symbolism.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Playing Card Associations</h4>
                <p className="text-sm text-muted-foreground">
                  Links Lenormand cards to traditional playing cards (clubs, hearts, diamonds, spades) for additional layers of meaning.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modern Revival */}
        <Card className="mb-8 border-border bg-card">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground flex items-center">
              <Sparkles className="w-6 h-6 mr-3 text-primary" />
              The Modern Renaissance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              In recent decades, Lenormand has experienced a remarkable revival. Contemporary artists and spiritual practitioners have created beautiful new decks that honor traditional meanings while incorporating diverse cultural perspectives.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, Lenormand is practiced worldwide, with readers from every culture adding their unique interpretations and symbolism. This diversity has enriched the system, making it more inclusive and accessible to modern seekers.
            </p>
            <div className="bg-muted p-4 rounded-lg border border-border">
              <p className="text-foreground text-sm">
                <strong>Did you know?</strong> Lenormand cards are experiencing their greatest popularity since the 19th century, with new decks being created by artists from around the world.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-border">
          <Link href="/learn/introduction">
            <Button variant="outline" className="border-border text-card-foreground hover:bg-muted">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Introduction
            </Button>
          </Link>
          <Link href="/learn/reading-basics">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Continue to Reading Basics
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}