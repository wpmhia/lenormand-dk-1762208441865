import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles,
  Users,
  ArrowRight,
  Heart,
  Shield
} from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 relative overflow-hidden" role="main">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-12 slide-in-up relative">
          <div className="text-center lg:text-left space-y-8 relative z-10">

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 text-amber-900 dark:text-amber-100 leading-tight relative">
              <span className="relative inline-block">
                Lenormand
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 rounded-full opacity-80"></div>
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-rose-700 to-purple-700 dark:from-amber-400 dark:via-rose-400 dark:to-purple-400 animate-pulse">
                Intelligence
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-amber-800 dark:text-amber-200 mb-8 max-w-3xl mx-auto lg:mx-0 leading-relaxed font-light">
              Discover the ancient wisdom of Lenormand through AI-enhanced intuition.
              <span className="text-amber-700 block mt-2">Experience personalized guidance where technology meets mystical insight.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <Link href="/read/new">
                <Button size="lg" className="px-12 py-5 bg-gradient-to-r from-amber-600 via-rose-500 to-purple-600 hover:from-amber-700 hover:via-rose-600 hover:to-purple-700 text-white shadow-2xl shadow-amber-500/30 font-semibold text-lg transition-all duration-700 hover:scale-105 rounded-full border border-amber-400/20 backdrop-blur-sm mystical-float">
                  ✨ Begin Your Journey
                </Button>
              </Link>
              <Link href="/cards">
                <Button variant="outline" size="lg" className="px-12 py-5 border-2 border-amber-600/50 dark:border-amber-400/50 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/20 hover:border-amber-700/70 dark:hover:border-amber-400/70 font-semibold text-lg transition-all duration-700 hover:scale-105 rounded-full backdrop-blur-sm gentle-pulse shadow-lg shadow-amber-500/20 dark:shadow-amber-500/30">
                  🔮 Explore the Cards
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end relative z-10">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 via-rose-400/20 to-purple-500/30 rounded-2xl blur-2xl breathing-glow opacity-60 group-hover:opacity-80 transition-opacity duration-1000"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-rose-400/10 to-purple-600/10 rounded-2xl blur-xl animate-pulse"></div>
              <img
                src="/images/hero-image.jpg"
                alt="Hero Image"
                className="relative w-full max-w-xs sm:max-w-sm h-auto object-cover rounded-2xl shadow-2xl border border-amber-400/20 backdrop-blur-sm transition-all duration-700 group-hover:scale-105 group-hover:rotate-1"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Reading Types */}
      <div className="container mx-auto px-6 py-20 max-w-6xl">
        <div className="mb-12 fade-in-scale relative">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 via-transparent to-purple-500/5 rounded-3xl"></div>
          <div className="text-center mb-12 relative z-10">
            <h2 className="text-4xl font-bold text-center mb-4 text-amber-900 dark:text-amber-100 relative">
              Choose Your Path
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-rose-600 to-purple-600 rounded-full"></div>
            </h2>
            <p className="text-center text-amber-800 dark:text-amber-200 text-lg max-w-2xl mx-auto leading-relaxed">Select the depth of insight that calls to you</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              <Link href="/read/new">
                <Card className="hover:shadow-2xl hover:shadow-rose-500/20 dark:hover:shadow-rose-500/30 transition-all duration-500 cursor-pointer group border border-rose-400/20 dark:border-rose-400/30 hover:border-rose-400/60 dark:hover:border-rose-400/70 bg-gradient-to-br from-white via-rose-50/50 to-amber-50 dark:from-slate-950 dark:via-rose-950/40 dark:to-slate-900 backdrop-blur-sm min-h-[160px] hover:scale-105 rounded-2xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="pb-4 relative z-10">
                    <CardTitle className="flex items-center gap-3 group-hover:text-rose-200 dark:group-hover:text-rose-200 text-lg text-slate-800 dark:text-white font-semibold">
                      <Sparkles className="w-5 h-5 text-rose-300 group-hover:animate-pulse" />
                      Quick Analysis
                    </CardTitle>
                  </CardHeader>
                   <CardContent className="pt-0 relative z-10">
                      <p className="text-sm text-slate-600 dark:text-amber-100 mb-4 leading-relaxed">
                         Journey through time&apos;s tapestry
                      </p>
                      <div className="flex items-center text-rose-700 dark:text-rose-200 text-sm font-medium">
                        3 Cards <ArrowRight className="w-4 h-4 ml-2 text-rose-300 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                   </CardContent>
                </Card>
              </Link>

              <Link href="/read/new">
                <Card className="hover:shadow-2xl hover:shadow-amber-500/20 dark:hover:shadow-amber-500/30 transition-all duration-500 cursor-pointer group border border-amber-400/20 dark:border-amber-400/30 hover:border-amber-400/60 dark:hover:border-amber-400/70 bg-gradient-to-br from-white via-amber-50/50 to-rose-50 dark:from-slate-950 dark:via-amber-950/40 dark:to-slate-900 backdrop-blur-sm min-h-[160px] hover:scale-105 rounded-2xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="pb-4 relative z-10">
                    <CardTitle className="flex items-center gap-3 group-hover:text-amber-200 dark:group-hover:text-amber-200 text-lg text-slate-800 dark:text-white font-semibold">
                      <Heart className="w-5 h-5 text-amber-300 group-hover:animate-pulse" />
                      Deep Analysis
                    </CardTitle>
                  </CardHeader>
                   <CardContent className="pt-0 relative z-10">
                      <p className="text-sm text-slate-600 dark:text-amber-100 mb-4 leading-relaxed">
                        Deep exploration with hidden insights
                      </p>
                      <div className="flex items-center text-amber-700 dark:text-amber-200 text-sm font-medium">
                        5 Cards <ArrowRight className="w-4 h-4 ml-2 text-amber-300 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                   </CardContent>
                </Card>
              </Link>

              <Link href="/read/new">
                <Card className="hover:shadow-2xl hover:shadow-emerald-500/20 dark:hover:shadow-emerald-500/30 transition-all duration-500 cursor-pointer group border border-emerald-400/20 dark:border-emerald-400/30 hover:border-emerald-400/60 dark:hover:border-emerald-400/70 bg-gradient-to-br from-white via-emerald-50/50 to-teal-50 dark:from-slate-950 dark:via-emerald-950/40 dark:to-slate-900 backdrop-blur-sm min-h-[160px] hover:scale-105 rounded-2xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="pb-4 relative z-10">
                    <CardTitle className="flex items-center gap-3 group-hover:text-emerald-200 dark:group-hover:text-emerald-200 text-lg text-slate-800 dark:text-white font-semibold">
                      <Shield className="w-5 h-5 text-emerald-300 group-hover:animate-pulse" />
                      Comprehensive
                    </CardTitle>
                  </CardHeader>
                   <CardContent className="pt-0 relative z-10">
                      <p className="text-sm text-slate-600 dark:text-amber-100 mb-4 leading-relaxed">
                         Complete life&apos;s grand design
                      </p>
                      <div className="flex items-center text-emerald-700 dark:text-emerald-200 text-sm font-medium">
                        9 Cards <ArrowRight className="w-4 h-4 ml-2 text-emerald-300 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                   </CardContent>
                </Card>
              </Link>

              <Link href="/read/new">
                <Card className="hover:shadow-2xl hover:shadow-purple-500/20 dark:hover:shadow-purple-500/30 transition-all duration-500 cursor-pointer group border border-purple-400/20 dark:border-purple-400/30 hover:border-purple-400/60 dark:hover:border-purple-400/70 bg-gradient-to-br from-white via-purple-50/50 to-indigo-50 dark:from-slate-950 dark:via-purple-950/40 dark:to-slate-900 backdrop-blur-sm min-h-[160px] hover:scale-105 rounded-2xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="pb-4 relative z-10">
                    <CardTitle className="flex items-center gap-3 group-hover:text-purple-200 dark:group-hover:text-purple-200 text-lg text-slate-800 dark:text-white font-semibold">
                      <Sparkles className="w-5 h-5 text-purple-300 group-hover:animate-pulse" />
                      Grand Tableau
                    </CardTitle>
                  </CardHeader>
                   <CardContent className="pt-0 relative z-10">
                      <p className="text-sm text-slate-600 dark:text-amber-100 mb-4 leading-relaxed">
                        The complete mystical revelation
                      </p>
                      <div className="flex items-center text-purple-700 dark:text-purple-200 text-sm font-medium">
                        36 Cards <ArrowRight className="w-4 h-4 ml-2 text-purple-300 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                   </CardContent>
                </Card>
              </Link>
          </div>
        </div>
      </div>

      

      {/* FAQ Section */}
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-12 slide-in-up relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-rose-500/5 rounded-3xl"></div>
          <div className="text-center mb-12 relative z-10">
            <h2 className="text-4xl font-bold text-center mb-4 text-amber-900 dark:text-amber-100 relative">
              Wisdom & Guidance
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-40 h-0.5 bg-gradient-to-r from-amber-600 to-rose-600 rounded-full"></div>
            </h2>
            <p className="text-center text-amber-800 dark:text-amber-200 text-lg max-w-2xl mx-auto leading-relaxed">Answers to illuminate your journey</p>
          </div>
          <div className="max-w-4xl mx-auto space-y-6 relative z-10">
            <Card className="border-rose-400/20 dark:border-rose-400/30 bg-gradient-to-br from-white via-rose-50/50 to-amber-50 dark:from-slate-950 dark:via-rose-950/40 dark:to-slate-900 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:shadow-rose-500/10 dark:hover:shadow-rose-500/20 transition-all duration-500 rounded-2xl overflow-hidden relative group">
               <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="pb-4 relative z-10">
                  <CardTitle className="text-lg text-rose-700 dark:text-rose-200 font-semibold">The Essence of Lenormand</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 relative z-10">
                  <p className="text-slate-700 dark:text-slate-200 text-base leading-relaxed italic">
                    Lenormand speaks in the language of everyday symbols &mdash; 36 cards that mirror life&apos;s practical wisdom. Where Tarot explores the soul&apos;s depths, Lenormand illuminates the path ahead with clarity and precision.
                 </p>
               </CardContent>
            </Card>

            <Card className="border-amber-400/20 dark:border-amber-400/30 bg-gradient-to-br from-white via-amber-50/50 to-rose-50 dark:from-slate-950 dark:via-amber-950/40 dark:to-slate-900 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 dark:hover:shadow-amber-500/20 transition-all duration-500 rounded-2xl overflow-hidden relative group">
               <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="pb-4 relative z-10">
                  <CardTitle className="text-lg text-amber-700 dark:text-amber-200 font-semibold">The AI Advantage</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 relative z-10">
                  <p className="text-slate-700 dark:text-slate-200 text-base leading-relaxed italic">
                   Ancient wisdom meets modern insight. Our AI companions are available whenever intuition calls, blending traditional meanings with sophisticated pattern recognition for guidance that feels both timeless and profoundly personal.
                 </p>
               </CardContent>
            </Card>

            <Card className="border-emerald-400/20 dark:border-emerald-400/30 bg-gradient-to-br from-white via-emerald-50/50 to-teal-50 dark:from-slate-950 dark:via-emerald-950/40 dark:to-slate-900 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/20 transition-all duration-500 rounded-2xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="pb-4 relative z-10">
                <CardTitle className="text-lg text-emerald-700 dark:text-emerald-200 font-semibold">How to get a free reading?</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 relative z-10">
                <p className="text-slate-700 dark:text-slate-200 text-base leading-relaxed italic">
                   Click &ldquo;Start AI Reading&rdquo; above. Focus on your question and let our algorithms select and analyze your cards. No signup or payment required.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-400/20 dark:border-purple-400/30 bg-gradient-to-br from-white via-purple-50/50 to-indigo-50 dark:from-slate-950 dark:via-purple-950/40 dark:to-slate-900 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:shadow-purple-500/10 dark:hover:shadow-purple-500/20 transition-all duration-500 rounded-2xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="pb-4 relative z-10">
                <CardTitle className="text-lg text-purple-700 dark:text-purple-200 font-semibold">Accuracy of AI readings?</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 relative z-10">
                <p className="text-slate-700 dark:text-slate-200 text-base leading-relaxed italic">
                  AI readings are highly accurate, providing consistent analysis based on traditional meanings enhanced by machine learning pattern recognition.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="text-center bg-gradient-to-r from-white via-rose-50/50 to-amber-50 dark:from-slate-950 dark:via-rose-950/40 dark:to-slate-900 backdrop-blur-sm rounded-3xl p-8 border border-rose-400/20 dark:border-rose-400/30 fade-in-scale shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-amber-400/5 to-purple-500/10 rounded-3xl"></div>
          <div className="absolute top-4 left-4 w-16 h-16 bg-rose-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-4 right-4 w-12 h-12 bg-purple-500/20 rounded-full blur-lg animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6 text-slate-800 dark:text-white relative">
              Begin Your Mystical Journey
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-48 h-0.5 bg-gradient-to-r from-rose-400 via-amber-300 to-purple-400 rounded-full"></div>
            </h2>
            <p className="text-slate-600 dark:text-amber-100 mb-8 text-xl max-w-2xl mx-auto leading-relaxed">
              Let the cards reveal what your soul already knows
            </p>
            <Link href="/read/new">
              <Button size="lg" className="px-12 py-5 bg-gradient-to-r from-rose-600 via-amber-500 to-purple-600 hover:from-rose-700 hover:via-amber-600 hover:to-purple-700 text-white shadow-2xl shadow-rose-500/30 font-semibold text-lg transition-all duration-700 hover:scale-105 rounded-full border border-rose-400/20 backdrop-blur-sm mystical-float">
                Discover Your Path
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-rose-400/20 bg-gradient-to-t from-slate-950 via-rose-950/30 to-slate-900 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 via-transparent to-purple-500/5"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <p className="text-rose-200/80 mb-6 text-lg font-light italic">
              © 2024 Lenormand Intelligence - Mystical Card Wisdom
            </p>
            <div className="flex gap-8 justify-center text-sm">
              <Link href="/read/new" className="text-rose-300/60 hover:text-rose-200 transition-colors font-medium hover:scale-105 transition-transform duration-300">
                New Analysis
              </Link>
              <Link href="/cards" className="text-purple-300/60 hover:text-purple-200 transition-colors font-medium hover:scale-105 transition-transform duration-300">
                Explore Cards
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}