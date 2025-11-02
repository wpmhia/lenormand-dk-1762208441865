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
              Discover the ancient wisdom of Lenormand through AI-enhanced intuition.
              Experience personalized guidance where technology meets mystical insight.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <Link href="/read/new">
                <Button size="lg" className="px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-purple-700 text-white shadow-2xl shadow-purple-500/25 font-semibold text-lg transition-all duration-600 hover:scale-105 mystical-float">
                  ✨ Begin Your Journey
                </Button>
              </Link>
              <Link href="/cards">
                <Button variant="outline" size="lg" className="px-10 py-4 border-2 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-purple-500 font-semibold text-lg transition-all duration-600 hover:scale-105 gentle-pulse">
                  🔮 Explore the Cards
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-xl breathing-glow"></div>
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
            <h2 className="text-4xl font-bold text-center mb-4 text-white">Choose Your Path</h2>
            <p className="text-center text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">Select the depth of insight that calls to you</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/read/new">
                <Card className="hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-400 cursor-pointer group border border-slate-700 hover:border-blue-500/50 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm min-h-[160px] hover:scale-105">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 group-hover:text-blue-400 text-lg text-white font-semibold">
                      <Star className="w-5 h-5 text-blue-400" />
                      Quick Analysis
                    </CardTitle>
                  </CardHeader>
                   <CardContent className="pt-0">
                     <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                       Journey through time's tapestry
                     </p>
                     <div className="flex items-center text-slate-400 text-sm font-medium">
                       3 Cards <ArrowRight className="w-4 h-4 ml-2 text-blue-400" />
                     </div>
                   </CardContent>
                </Card>
              </Link>

              <Link href="/read/new">
                <Card className="hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-400 cursor-pointer group border border-slate-700 hover:border-purple-500/50 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm min-h-[160px] hover:scale-105">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 group-hover:text-purple-400 text-lg text-white font-semibold">
                      <Heart className="w-5 h-5 text-purple-400" />
                      Deep Analysis
                    </CardTitle>
                  </CardHeader>
                   <CardContent className="pt-0">
                     <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                       Deep exploration with hidden insights
                     </p>
                     <div className="flex items-center text-slate-400 text-sm font-medium">
                       5 Cards <ArrowRight className="w-4 h-4 ml-2 text-purple-400" />
                     </div>
                   </CardContent>
                </Card>
              </Link>

              <Link href="/read/new">
                <Card className="hover:shadow-xl hover:shadow-green-500/10 transition-all duration-400 cursor-pointer group border border-slate-700 hover:border-green-500/50 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm min-h-[160px] hover:scale-105">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 group-hover:text-green-400 text-lg text-white font-semibold">
                      <Shield className="w-5 h-5 text-green-400" />
                      Comprehensive
                    </CardTitle>
                  </CardHeader>
                   <CardContent className="pt-0">
                     <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                       Complete life's grand design
                     </p>
                     <div className="flex items-center text-slate-400 text-sm font-medium">
                       9 Cards <ArrowRight className="w-4 h-4 ml-2 text-green-400" />
                     </div>
                   </CardContent>
                </Card>
              </Link>

              <Link href="/read/new">
                <Card className="hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-400 cursor-pointer group border border-slate-700 hover:border-yellow-500/50 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm min-h-[160px] hover:scale-105">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 group-hover:text-yellow-400 text-lg text-white font-semibold">
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                      Grand Tableau
                    </CardTitle>
                  </CardHeader>
                   <CardContent className="pt-0">
                     <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                       The complete mystical revelation
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
            <h2 className="text-4xl font-bold text-center mb-4 text-white">Voices of Discovery</h2>
            <p className="text-center text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">Join those who have found deeper understanding through mystical guidance</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-slate-700 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-400">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 text-base leading-relaxed italic">
                  "Each reading feels like a conversation with ancient wisdom. The insights resonate deeply, guiding me with clarity and understanding."
                </p>
                <div className="font-semibold text-white text-lg">Sarah L.</div>
                <div className="text-sm text-slate-400">New York</div>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-400">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 text-base leading-relaxed italic">
                  "The cards speak to me in ways I never imagined. Each reading unfolds like a personal revelation, offering wisdom that feels profoundly true."
                </p>
                <div className="font-semibold text-white text-lg">Emma W.</div>
                <div className="text-sm text-slate-400">London</div>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-400">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 text-base leading-relaxed italic">
                  "There's a magic in these readings that transcends technology. The guidance feels intuitive, wise, and deeply connected to my journey."
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
            <h2 className="text-4xl font-bold text-center mb-4 text-white">Wisdom & Guidance</h2>
            <p className="text-center text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">Answers to illuminate your journey</p>
          </div>
          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="border-slate-700 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-400">
               <CardHeader className="pb-4">
                 <CardTitle className="text-lg text-white font-semibold">The Essence of Lenormand</CardTitle>
               </CardHeader>
               <CardContent className="pt-0">
                 <p className="text-slate-300 text-base leading-relaxed">
                   Lenormand speaks in the language of everyday symbols - 36 cards that mirror life's practical wisdom. Where Tarot explores the soul's depths, Lenormand illuminates the path ahead with clarity and precision.
                 </p>
               </CardContent>
            </Card>

            <Card className="border-slate-700 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-400">
               <CardHeader className="pb-4">
                 <CardTitle className="text-lg text-white font-semibold">The AI Advantage</CardTitle>
               </CardHeader>
               <CardContent className="pt-0">
                 <p className="text-slate-300 text-base leading-relaxed">
                   Ancient wisdom meets modern insight. Our AI companions are available whenever intuition calls, blending traditional meanings with sophisticated pattern recognition for guidance that feels both timeless and profoundly personal.
                 </p>
               </CardContent>
            </Card>

            <Card className="border-slate-700 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-400">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-white font-semibold">How to get a free reading?</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-slate-300 text-base leading-relaxed">
                  Click "Start AI Reading" above. Focus on your question and let our algorithms select and analyze your cards. No signup or payment required.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-400">
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
        <div className="text-center bg-gradient-to-r from-slate-900/50 to-slate-800/30 backdrop-blur-sm rounded-2xl p-12 border border-slate-700 fade-in-scale shadow-2xl ethereal-glow">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Begin Your Mystical Journey
          </h2>
          <p className="text-slate-300 mb-8 text-xl max-w-2xl mx-auto leading-relaxed">
            Let the cards reveal what your soul already knows
          </p>
          <Link href="/read/new">
            <Button size="lg" className="px-12 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-purple-700 text-white shadow-2xl shadow-purple-500/25 font-semibold text-lg transition-all duration-600 hover:scale-105 mystical-float">
              Discover Your Path
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
