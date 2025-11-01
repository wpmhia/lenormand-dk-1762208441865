import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Sparkles, 
  BookOpen, 
  Users, 
  Share2, 
  ArrowRight,
  Star,
  Heart,
  Shield
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16">
          <Badge className="mb-4" variant="secondary">
            <Sparkles className="w-3 h-3 mr-1" />
            Danish & English Lenormand Readings
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Lenormand.dk
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover guidance and insight through the mystical Lenormand cards. 
            Create personalized readings, explore card meanings, and unlock the wisdom of the 36-card deck.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/read/new">
              <Button size="lg" className="px-8">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Your Reading
              </Button>
            </Link>
            <Link href="/cards">
              <Button variant="outline" size="lg" className="px-8">
                <BookOpen className="w-5 h-5 mr-2" />
                Explore Cards
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-indigo-600" />
              </div>
              <CardTitle>Multiple Layouts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Choose from 3-card, 5-card, 9-card, or Grand Tableau spreads for different levels of insight.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Save & Share</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Create an account to save your readings and share insights with others through unique links.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-pink-600" />
              </div>
              <CardTitle>Card Meanings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Explore detailed meanings for all 36 Lenormand cards, including combinations and keywords.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Reading Types */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Choose Your Reading</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/read/new">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 group-hover:text-indigo-600">
                    <Star className="w-5 h-5" />
                    3 Cards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Past, Present, Future
                  </p>
                  <div className="flex items-center text-indigo-600 text-sm">
                    Quick Reading <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/read/new">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 group-hover:text-purple-600">
                    <Heart className="w-5 h-5" />
                    5 Cards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Extended Reading with Challenges
                  </p>
                  <div className="flex items-center text-purple-600 text-sm">
                    Detailed Insight <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/read/new">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 group-hover:text-pink-600">
                    <Shield className="w-5 h-5" />
                    9 Cards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Comprehensive Life Reading
                  </p>
                  <div className="flex items-center text-pink-600 text-sm">
                    Deep Analysis <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/read/new">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 group-hover:text-orange-600">
                    <Sparkles className="w-5 h-5" />
                    Grand Tableau
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Full 36-Card Reading
                  </p>
                  <div className="flex items-center text-orange-600 text-sm">
                    Complete Picture <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Discover What the Cards Hold?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands who find guidance through Lenormand readings
          </p>
          <Link href="/read/new">
            <Button size="lg" variant="secondary" className="px-8">
              Begin Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p className="mb-2">
            © 2024 Lenormand.dk - Danish & English Lenormand Readings
          </p>
          <div className="flex gap-6 justify-center text-sm">
            <Link href="/cards" className="hover:text-indigo-600">
              Card Meanings
            </Link>
            <Link href="/read/new" className="hover:text-indigo-600">
              New Reading
            </Link>
            <Link href="/me" className="hover:text-indigo-600">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
