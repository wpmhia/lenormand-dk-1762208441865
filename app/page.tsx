import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles,
  Users,
  ArrowRight,
  Star,
  Heart,
  Shield
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20 slide-in-up">
          <div className="text-center lg:text-left space-y-8">
            <Badge className="mb-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 border-blue-500/30 px-6 py-3 text-sm font-semibold tracking-wide uppercase" variant="secondary">
              ✨ AI-Powered Lenormand Analysis
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-12 text-white leading-tight">
              Lenormand
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Intelligence
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto lg:mx-0 leading-relaxed font-light">
              Advanced AI interpretation of traditional Lenormand cards.
              Get personalized insights with machine learning-powered analysis of the 36-card deck.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <Link href="/read/new">
                <Button size="lg" className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl shadow-blue-500/25 font-semibold text-lg transition-all duration-300 hover:scale-105">
                  ✨ Start AI Reading
                </Button>
              </Link>
              <Link href="/cards">
                <Button variant="outline" size="lg" className="px-10 py-4 border-2 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-500 font-semibold text-lg transition-all duration-300">
                  🔮 Explore Cards
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-xl"></div>
              <img
                src="/images/hero-image.jpg"
                alt="Hero Image"
                className="relative w-full max-w-xs sm:max-w-sm h-auto object-cover rounded-lg shadow-2xl border border-slate-700"
              />
            </div>
          </div>
        </div>



        {/* Reading Types */}
        <div className="mb-20 fade-in-scale">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-center mb-4 text-white">AI Reading Options</h2>
            <p className="text-center text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">Choose your analysis depth and unlock the wisdom of the cards</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/read/new">
                <Card className="hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer group border border-slate-700 hover:border-blue-500/50 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm min-h-[160px] hover:scale-105">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 group-hover:text-blue-400 text-lg text-white font-semibold">
                      <Star className="w-5 h-5 text-blue-400" />
                      Quick Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                      Past, Present, Future
                    </p>
                    <div className="flex items-center text-slate-400 text-sm font-medium">
                      3 Cards <ArrowRight className="w-4 h-4 ml-2 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/read/new">
                <Card className="hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer group border border-slate-700 hover:border-purple-500/50 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm min-h-[160px] hover:scale-105">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 group-hover:text-purple-400 text-lg text-white font-semibold">
                      <Heart className="w-5 h-5 text-purple-400" />
                      Deep Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                      Extended Reading with Challenges
                    </p>
                    <div className="flex items-center text-slate-400 text-sm font-medium">
                      5 Cards <ArrowRight className="w-4 h-4 ml-2 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/read/new">
                <Card className="hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 cursor-pointer group border border-slate-700 hover:border-green-500/50 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm min-h-[160px] hover:scale-105">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 group-hover:text-green-400 text-lg text-white font-semibold">
                      <Shield className="w-5 h-5 text-green-400" />
                      Comprehensive
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                      Life Overview Analysis
                    </p>
                    <div className="flex items-center text-slate-400 text-sm font-medium">
                      9 Cards <ArrowRight className="w-4 h-4 ml-2 text-green-400" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/read/new">
                <Card className="hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-300 cursor-pointer group border border-slate-700 hover:border-yellow-500/50 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm min-h-[160px] hover:scale-105">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 group-hover:text-yellow-400 text-lg text-white font-semibold">
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                      Grand Tableau
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                      Complete Deck Analysis
                    </p>
                    <div className="flex items-center text-slate-400 text-sm font-medium">
                      36 Cards <ArrowRight className="w-4 h-4 ml-2 text-yellow-400" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-20 slide-in-left">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-center mb-4 text-white">What Our Users Say</h2>
            <p className="text-center text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">Join thousands who have discovered clarity through AI-powered Lenormand readings</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-slate-700 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 text-base leading-relaxed italic">
                  "Lenormand Intelligence has helped me make many important decisions. The AI analysis provides accurate insights and confidence about the future."
                </p>
                <div className="font-semibold text-white text-lg">Sarah L.</div>
                <div className="text-sm text-slate-400">New York</div>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 text-base leading-relaxed italic">
                  "The AI-powered analysis helps me understand my circumstances better. It's both insightful and practical, providing concrete guidance."
                </p>
                <div className="font-semibold text-white text-lg">Emma W.</div>
                <div className="text-sm text-slate-400">London</div>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 text-base leading-relaxed italic">
                  "The AI accuracy is impressive. Whether for relationships or work, the insights have been invaluable. It's become an essential tool."
                </p>
                <div className="font-semibold text-white text-lg">Michael R.</div>
                <div className="text-sm text-slate-400">Toronto</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20 slide-in-up">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-center mb-4 text-white">Frequently Asked Questions</h2>
            <p className="text-center text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">Everything you need to know about AI-powered Lenormand readings</p>
          </div>
          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="border-slate-700 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-white font-semibold">What is Lenormand vs Tarot?</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-slate-300 text-base leading-relaxed">
                  Lenormand uses 36 cards with specific symbols for practical, everyday matters. Unlike Tarot's 78 cards and spiritual themes, Lenormand provides direct, specific guidance ideal for AI analysis.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-white font-semibold">Benefits of AI-powered readings?</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-slate-300 text-base leading-relaxed">
                  24/7 access with instant AI analysis. Advanced algorithms ensure true randomness while providing deeper insights through machine learning pattern recognition.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-white font-semibold">How to get a free reading?</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-slate-300 text-base leading-relaxed">
                  Click "Start AI Reading" above. Focus on your question and let our algorithms select and analyze your cards. No signup or payment required.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-white font-semibold">Accuracy of AI readings?</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-slate-300 text-base leading-relaxed">
                  AI readings are highly accurate, providing consistent analysis based on traditional meanings enhanced by machine learning pattern recognition.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-slate-900/50 to-slate-800/30 backdrop-blur-sm rounded-2xl p-12 border border-slate-700 fade-in-scale shadow-2xl">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Experience AI-Powered Insight
          </h2>
          <p className="text-slate-300 mb-8 text-xl max-w-2xl mx-auto leading-relaxed">
            Join thousands using advanced Lenormand analysis to unlock the wisdom of the cards
          </p>
          <Link href="/read/new">
            <Button size="lg" className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl shadow-blue-500/25 font-semibold text-lg transition-all duration-300 hover:scale-105">
              Start Your Analysis
              <ArrowRight className="w-5 h-5 ml-3" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-gradient-to-t from-slate-950 to-slate-900 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <p className="text-slate-400 mb-6 text-lg font-light">
              © 2024 Lenormand Intelligence - AI-Powered Lenormand Analysis
            </p>
            <div className="flex gap-8 justify-center text-sm">
              <Link href="/read/new" className="text-slate-400 hover:text-blue-400 transition-colors font-medium">
                New Analysis
              </Link>
              <Link href="/cards" className="text-slate-400 hover:text-purple-400 transition-colors font-medium">
                Explore Cards
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
