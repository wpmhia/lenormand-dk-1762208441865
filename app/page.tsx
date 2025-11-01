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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-600/20 text-purple-200 border-purple-500/30" variant="secondary">
            <Sparkles className="w-3 h-3 mr-1" />
            Danish & English Mystical Readings
          </Badge>
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mystical-glow">
            Lenormand.dk
          </h1>
          <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover guidance and insight through the mystical Lenormand cards. 
            Create personalized readings, explore card meanings, and unlock the ancient wisdom of the 36-card deck.
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
                Save your readings locally and share insights with others through unique links.
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
          <h2 className="text-3xl font-bold text-center mb-4">Choose Your Lenormand Reading</h2>
          <p className="text-center text-gray-600 mb-8">Select a spread for your free Lenormand card reading</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/read/new">
              <Card className="hover:shadow-lg transition-all cursor-pointer group border-2 border-transparent hover:border-indigo-200">
                <div className="aspect-[3/4] bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-t-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🏇🍀⛵</div>
                    <div className="text-xs text-indigo-600 font-medium">Past • Present • Future</div>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 group-hover:text-indigo-600 text-lg">
                    <Star className="w-5 h-5" />
                    3 Cards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Past, Present, Future
                  </p>
                  <div className="flex items-center text-indigo-600 text-sm font-medium">
                    Quick Reading <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/read/new">
              <Card className="hover:shadow-lg transition-all cursor-pointer group border-2 border-transparent hover:border-purple-200">
                <div className="aspect-[3/4] bg-gradient-to-br from-purple-50 to-purple-100 rounded-t-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🏇🍀⛵🏠🌳</div>
                    <div className="text-xs text-purple-600 font-medium">Extended Layout</div>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 group-hover:text-purple-600 text-lg">
                    <Heart className="w-5 h-5" />
                    5 Cards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Extended Reading with Challenges
                  </p>
                  <div className="flex items-center text-purple-600 text-sm font-medium">
                    Detailed Insight <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/read/new">
              <Card className="hover:shadow-lg transition-all cursor-pointer group border-2 border-transparent hover:border-pink-200">
                <div className="aspect-[3/4] bg-gradient-to-br from-pink-50 to-pink-100 rounded-t-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🏇🍀⛵🏠🌳☁️</div>
                    <div className="text-xs text-pink-600 font-medium">Life Overview</div>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 group-hover:text-pink-600 text-lg">
                    <Shield className="w-5 h-5" />
                    9 Cards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Comprehensive Life Reading
                  </p>
                  <div className="flex items-center text-pink-600 text-sm font-medium">
                    Deep Analysis <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/read/new">
              <Card className="hover:shadow-lg transition-all cursor-pointer group border-2 border-transparent hover:border-orange-200">
                <div className="aspect-[3/4] bg-gradient-to-br from-orange-50 to-orange-100 rounded-t-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🏇🍀⛵🏠🌳☁️🐍⚰️💐</div>
                    <div className="text-xs text-orange-600 font-medium">Complete Deck</div>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 group-hover:text-orange-600 text-lg">
                    <Sparkles className="w-5 h-5" />
                    Grand Tableau
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Full 36-Card Reading
                  </p>
                  <div className="flex items-center text-orange-600 text-sm font-medium">
                    Complete Picture <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">User Reviews of Lenormand Reading</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-2xl mb-4">⭐⭐⭐⭐⭐</div>
                <p className="text-gray-600 mb-4 italic">
                  "Lenormand Reading has helped me make many important decisions. The readings are always accurate, giving me confidence about the future. It has been especially helpful in guiding my career choices."
                </p>
                <div className="font-semibold">Sarah L.</div>
                <div className="text-sm text-gray-500">New York</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-2xl mb-4">⭐⭐⭐⭐⭐</div>
                <p className="text-gray-600 mb-4 italic">
                  "Through Lenormand Reading, I've learned how to better understand my circumstances. This form of fortune-telling is both mystical and practical, providing concrete guidance."
                </p>
                <div className="font-semibold">Emma W.</div>
                <div className="text-sm text-gray-500">London</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-2xl mb-4">⭐⭐⭐⭐⭐</div>
                <p className="text-gray-600 mb-4 italic">
                  "I'm impressed by the accuracy of Lenormand card readings. Whether it's relationship or work issues, the insights have been invaluable. It has become an important tool in my life."
                </p>
                <div className="font-semibold">Michael R.</div>
                <div className="text-sm text-gray-500">Toronto</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What is Lenormand and how does it differ from Tarot?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Lenormand is a divination system using 36 cards, each with a specific symbol and meaning. Unlike Tarot, which has 78 cards and often deals with spiritual themes, Lenormand focuses on practical, everyday matters. Lenormand readings tend to be more direct and specific, making them ideal for online interpretations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What are the benefits of using an online Lenormand reading service?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Online Lenormand readings offer several advantages: they're accessible 24/7, provide instant results, and allow for privacy and reflection. Our free online Lenormand service uses advanced algorithms to ensure randomness in card selection, mimicking the shuffle and draw process of physical cards.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How can I get a free Lenormand reading online?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our website offers completely free Lenormand readings online. Simply visit our 'Start Reading' page, focus on your question, and select your cards. The system will then provide an interpretation based on the Lenormand tradition. No sign-up or payment is required for these free online Lenormand readings.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How accurate are online Lenormand readings compared to in-person ones?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Online Lenormand readings can be just as accurate as in-person ones. The key to any divination practice is the reader's intention and interpretation. Our free online Lenormand system provides consistent, unbiased readings based on traditional Lenormand meanings, which you can then interpret in the context of your specific situation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center card-mystical rounded-2xl p-12 mystical-glow border border-purple-500/30">
          <h2 className="text-3xl font-bold mb-4 text-purple-100">
            Ready to Discover What the Cards Hold?
          </h2>
          <p className="text-xl mb-8 text-purple-200 opacity-90">
            Join thousands who find guidance through mystical Lenormand readings
          </p>
          <Link href="/read/new">
            <Button size="lg" className="px-8 bg-purple-600 hover:bg-purple-700 text-white border-purple-500 mystical-glow">
              <Sparkles className="w-5 h-5 mr-2" />
              Begin Your Mystical Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-purple-500/30 bg-slate-900/80 py-8 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-purple-300">
          <p className="mb-2">
            © 2024 Lenormand.dk - Mystical Danish & English Lenormand Readings
          </p>
          <div className="flex gap-6 justify-center text-sm">
            <Link href="/cards" className="hover:text-purple-100 transition-colors">
              Card Meanings
            </Link>
            <Link href="/read/new" className="hover:text-purple-100 transition-colors">
              New Reading
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
