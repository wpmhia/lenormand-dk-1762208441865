import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, ArrowRight, BookOpen } from 'lucide-react'

export default function ReadPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 text-foreground relative">
            Your Lenormand Readings
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-primary to-primary/60 rounded-full"></div>
          </h1>
          <p className="text-muted-foreground text-lg italic">
            Discover wisdom through the ancient cards
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Start New Reading Card */}
          <Card className="border-border bg-card backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-card-foreground text-xl flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Start New Reading
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <p className="text-muted-foreground">
                Begin your journey with the cards. Choose your question and let the wisdom unfold.
              </p>
              <Link href="/read/new">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 rounded-xl py-3 font-semibold transition-all duration-500 hover:scale-105">
                  Begin Your Reading
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Explore Cards Card */}
          <Card className="border-border bg-card backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-card-foreground text-xl flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Explore Cards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <p className="text-muted-foreground">
                Learn about the 36 Lenormand cards, their meanings, and how they interact with each other.
              </p>
              <Link href="/cards">
                <Button variant="outline" className="w-full border-border text-card-foreground hover:bg-muted rounded-xl py-3 font-semibold transition-all duration-300">
                  Browse Card Meanings
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Future: Saved Readings Section */}
        <div className="mt-12">
          <Card className="border-border bg-card backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-card-foreground text-xl">
                Your Reading History
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-muted-foreground mb-4">
                Your saved readings will appear here. Complete a reading to get started.
              </p>
              <div className="text-center py-8">
                <p className="text-muted-foreground italic">
                  No readings yet. Start your first reading above.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}