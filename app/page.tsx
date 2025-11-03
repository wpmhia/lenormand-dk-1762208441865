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
    <div className="min-h-screen aged-paper relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-24 h-24 bg-amber-900/10 rounded-full blur-2xl"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-amber-800/08 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 left-1/4 w-32 h-32 bg-amber-900/06 rounded-full blur-2xl"></div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20 max-w-4xl">
        <div className="text-center mb-16 gentle-fade-in">
          <h1 className="text-5xl md:text-6xl font-serif mb-8 text-amber-900 leading-tight">
            Lenormand Wisdom
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-amber-800 max-w-2xl mx-auto leading-relaxed font-light">
            Ancient guidance for modern souls. Let the cards reveal what your heart already knows.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/read/new">
              <Button size="lg" className="px-10 py-4 bg-amber-800 hover:bg-amber-900 text-amber-100 font-medium text-lg transition-colors duration-300 rounded-lg border-2 border-amber-900">
                Begin Your Reading
              </Button>
            </Link>
            <Link href="/cards">
              <Button variant="outline" size="lg" className="px-10 py-4 border-2 border-amber-700 text-amber-800 hover:bg-amber-50 font-medium text-lg transition-colors duration-300 rounded-lg">
                Explore the Cards
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Reading Types */}
      <div className="container mx-auto px-6 py-20 max-w-6xl">
        <div className="mb-20 fade-in-scale relative">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 via-transparent to-purple-500/5 rounded-3xl"></div>
          <div className="text-center mb-12 relative z-10">
            <h2 className="text-4xl font-bold text-center mb-4 text-white relative">
              Choose Your Path
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-rose-400 to-purple-400 rounded-full"></div>
            </h2>
            <p className="text-center text-slate-200 text-lg max-w-2xl mx-auto leading-relaxed italic">Select the depth of insight that calls to you</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              <Link href="/read/new">
                <Card className="hover:shadow-2xl hover:shadow-rose-500/20 transition-all duration-500 cursor-pointer group border border-rose-400/20 hover:border-rose-400/60 bg-gradient-to-br from-slate-900/60 via-rose-950/20 to-slate-800/40 backdrop-blur-sm min-h-[160px] hover:scale-105 rounded-2xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="pb-4 relative z-10">
                    <CardTitle className="flex items-center gap-3 group-hover:text-rose-300 text-lg text-white font-semibold">
                      <Star className="w-5 h-5 text-rose-400 group-hover:animate-pulse" />
                      Quick Analysis
                    </CardTitle>
                  </CardHeader>
                   <CardContent className="pt-0 relative z-10">
                     <p className="text-sm text-slate-200 mb-4 leading-relaxed italic">
                        Journey through time&apos;s tapestry
                     </p>
                     <div className="flex items-center text-rose-300/80 text-sm font-medium">
                       3 Cards <ArrowRight className="w-4 h-4 ml-2 text-rose-400 group-hover:translate-x-1 transition-transform duration-300" />
                     </div>
                   </CardContent>
                </Card>
              </Link>

              <Link href="/read/new">
                <Card className="hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 cursor-pointer group border border-amber-400/20 hover:border-amber-400/60 bg-gradient-to-br from-slate-900/60 via-amber-950/20 to-slate-800/40 backdrop-blur-sm min-h-[160px] hover:scale-105 rounded-2xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="pb-4 relative z-10">
                    <CardTitle className="flex items-center gap-3 group-hover:text-amber-300 text-lg text-white font-semibold">
                      <Heart className="w-5 h-5 text-amber-400 group-hover:animate-pulse" />
                      Deep Analysis
                    </CardTitle>
                  </CardHeader>
                   <CardContent className="pt-0 relative z-10">
                     <p className="text-sm text-slate-200 mb-4 leading-relaxed italic">
                       Deep exploration with hidden insights
                     </p>
                     <div className="flex items-center text-amber-300/80 text-sm font-medium">
                       5 Cards <ArrowRight className="w-4 h-4 ml-2 text-amber-400 group-hover:translate-x-1 transition-transform duration-300" />
                     </div>
                   </CardContent>
                </Card>
              </Link>

              <Link href="/read/new">
                <Card className="hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 cursor-pointer group border border-emerald-400/20 hover:border-emerald-400/60 bg-gradient-to-br from-slate-900/60 via-emerald-950/20 to-slate-800/40 backdrop-blur-sm min-h-[160px] hover:scale-105 rounded-2xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="pb-4 relative z-10">
                    <CardTitle className="flex items-center gap-3 group-hover:text-emerald-300 text-lg text-white font-semibold">
                      <Shield className="w-5 h-5 text-emerald-400 group-hover:animate-pulse" />
                      Comprehensive
                    </CardTitle>
                  </CardHeader>
                   <CardContent className="pt-0 relative z-10">
                     <p className="text-sm text-slate-200 mb-4 leading-relaxed italic">
                        Complete life&apos;s grand design
                     </p>
                     <div className="flex items-center text-emerald-300/80 text-sm font-medium">
                       9 Cards <ArrowRight className="w-4 h-4 ml-2 text-emerald-400 group-hover:translate-x-1 transition-transform duration-300" />
                     </div>
                   </CardContent>
                </Card>
              </Link>

              <Link href="/read/new">
                <Card className="hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 cursor-pointer group border border-purple-400/20 hover:border-purple-400/60 bg-gradient-to-br from-slate-900/60 via-purple-950/20 to-slate-800/40 backdrop-blur-sm min-h-[160px] hover:scale-105 rounded-2xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="pb-4 relative z-10">
                    <CardTitle className="flex items-center gap-3 group-hover:text-purple-300 text-lg text-white font-semibold">
                      <Sparkles className="w-5 h-5 text-purple-400 group-hover:animate-pulse" />
                      Grand Tableau
                    </CardTitle>
                  </CardHeader>
                   <CardContent className="pt-0 relative z-10">
                     <p className="text-sm text-slate-200 mb-4 leading-relaxed italic">
                       The complete mystical revelation
                     </p>
                     <div className="flex items-center text-purple-300/80 text-sm font-medium">
                       36 Cards <ArrowRight className="w-4 h-4 ml-2 text-purple-400 group-hover:translate-x-1 transition-transform duration-300" />
                     </div>
                   </CardContent>
                </Card>
              </Link>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container mx-auto px-6 py-20 max-w-6xl">
        <div className="mb-20 slide-in-left relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-rose-500/5 rounded-3xl"></div>
          <div className="text-center mb-12 relative z-10">
            <h2 className="text-4xl font-bold text-center mb-4 text-white relative">
              Voices of Discovery
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-purple-400 to-rose-400 rounded-full"></div>
            </h2>
            <p className="text-center text-slate-200 text-lg max-w-2xl mx-auto leading-relaxed italic">Join those who have found deeper understanding through mystical guidance</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
            <Card className="border-rose-400/20 bg-gradient-to-br from-slate-900/60 via-rose-950/20 to-slate-800/40 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-500 rounded-2xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-8 relative z-10">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-rose-400 text-rose-400 group-hover:animate-pulse" />
                  ))}
                </div>
                <p className="text-slate-200 mb-6 text-base leading-relaxed italic">
                   &ldquo;Each reading feels like a conversation with ancient wisdom. The insights resonate deeply, guiding me with clarity and understanding.&rdquo;
                </p>
                <div className="font-semibold text-rose-200 text-lg">Sarah L.</div>
                <div className="text-sm text-rose-300/60">New York</div>
              </CardContent>
            </Card>

            <Card className="border-amber-400/20 bg-gradient-to-br from-slate-900/60 via-amber-950/20 to-slate-800/40 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 rounded-2xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-8 relative z-10">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400 group-hover:animate-pulse" />
                  ))}
                </div>
                <p className="text-slate-200 mb-6 text-base leading-relaxed italic">
                   &ldquo;The cards speak to me in ways I never imagined. Each reading unfolds like a personal revelation, offering wisdom that feels profoundly true.&rdquo;
                </p>
                <div className="font-semibold text-amber-200 text-lg">Emma W.</div>
                <div className="text-sm text-amber-300/60">London</div>
              </CardContent>
            </Card>

            <Card className="border-purple-400/20 bg-gradient-to-br from-slate-900/60 via-purple-950/20 to-slate-800/40 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 rounded-2xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-8 relative z-10">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-purple-400 text-purple-400 group-hover:animate-pulse" />
                  ))}
                </div>
                <p className="text-slate-200 mb-6 text-base leading-relaxed italic">
                   &ldquo;There&apos;s a magic in these readings that transcends technology. The guidance feels intuitive, wise, and deeply connected to my journey.&rdquo;
                </p>
                <div className="font-semibold text-purple-200 text-lg">Michael R.</div>
                <div className="text-sm text-purple-300/60">Toronto</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-6 py-20 max-w-4xl">
        <div className="mb-20 slide-in-up relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-rose-500/5 rounded-3xl"></div>
          <div className="text-center mb-12 relative z-10">
            <h2 className="text-4xl font-bold text-center mb-4 text-white relative">
              Wisdom & Guidance
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-40 h-0.5 bg-gradient-to-r from-amber-400 to-rose-400 rounded-full"></div>
            </h2>
            <p className="text-center text-slate-200 text-lg max-w-2xl mx-auto leading-relaxed italic">Answers to illuminate your journey</p>
          </div>
          <div className="max-w-4xl mx-auto space-y-6 relative z-10">
            <Card className="border-rose-400/20 bg-gradient-to-br from-slate-900/60 via-rose-950/20 to-slate-800/40 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-500 rounded-2xl overflow-hidden relative group">
               <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <CardHeader className="pb-4 relative z-10">
                 <CardTitle className="text-lg text-rose-200 font-semibold">The Essence of Lenormand</CardTitle>
               </CardHeader>
               <CardContent className="pt-0 relative z-10">
                 <p className="text-slate-200 text-base leading-relaxed italic">
                    Lenormand speaks in the language of everyday symbols &mdash; 36 cards that mirror life&apos;s practical wisdom. Where Tarot explores the soul&apos;s depths, Lenormand illuminates the path ahead with clarity and precision.
                 </p>
               </CardContent>
            </Card>

            <Card className="border-amber-400/20 bg-gradient-to-br from-slate-900/60 via-amber-950/20 to-slate-800/40 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 rounded-2xl overflow-hidden relative group">
               <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <CardHeader className="pb-4 relative z-10">
                 <CardTitle className="text-lg text-amber-200 font-semibold">The AI Advantage</CardTitle>
               </CardHeader>
               <CardContent className="pt-0 relative z-10">
                 <p className="text-slate-200 text-base leading-relaxed italic">
                   Ancient wisdom meets modern insight. Our AI companions are available whenever intuition calls, blending traditional meanings with sophisticated pattern recognition for guidance that feels both timeless and profoundly personal.
                 </p>
               </CardContent>
            </Card>

            <Card className="border-emerald-400/20 bg-gradient-to-br from-slate-900/60 via-emerald-950/20 to-slate-800/40 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 rounded-2xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="pb-4 relative z-10">
                <CardTitle className="text-lg text-emerald-200 font-semibold">How to get a free reading?</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 relative z-10">
                <p className="text-slate-200 text-base leading-relaxed italic">
                   Click &ldquo;Start AI Reading&rdquo; above. Focus on your question and let our algorithms select and analyze your cards. No signup or payment required.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-400/20 bg-gradient-to-br from-slate-900/60 via-purple-950/20 to-slate-800/40 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 rounded-2xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="pb-4 relative z-10">
                <CardTitle className="text-lg text-purple-200 font-semibold">Accuracy of AI readings?</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 relative z-10">
                <p className="text-slate-200 text-base leading-relaxed italic">
                  AI readings are highly accurate, providing consistent analysis based on traditional meanings enhanced by machine learning pattern recognition.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-20 max-w-4xl">
        <div className="text-center bg-gradient-to-r from-slate-900/60 via-rose-950/20 to-slate-800/40 backdrop-blur-sm rounded-3xl p-12 border border-rose-400/20 fade-in-scale shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-amber-400/5 to-purple-500/10 rounded-3xl"></div>
          <div className="absolute top-4 left-4 w-16 h-16 bg-rose-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-4 right-4 w-12 h-12 bg-purple-500/20 rounded-full blur-lg animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6 text-white relative">
              Begin Your Mystical Journey
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-48 h-0.5 bg-gradient-to-r from-rose-400 via-amber-300 to-purple-400 rounded-full"></div>
            </h2>
            <p className="text-slate-200 mb-8 text-xl max-w-2xl mx-auto leading-relaxed italic">
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
      <footer className="border-t border-rose-400/20 bg-gradient-to-t from-slate-950 via-rose-950/10 to-slate-900 py-12 relative overflow-hidden">
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
    </div>
  )
}