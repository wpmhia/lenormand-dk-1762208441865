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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center mb-12">
          <Badge className="mb-6 bg-slate-100 text-slate-700 border-slate-200 px-4 py-2 text-sm font-medium" variant="secondary">
            AI-Powered Lenormand Readings
          </Badge>
          <h1 className="text-5xl font-bold mb-6 text-slate-900">
            Lenormand Intelligence
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Advanced AI interpretation of traditional Lenormand cards.
            Get personalized insights with machine learning-powered analysis of the 36-card deck.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/read/new">
              <Button size="lg" className="px-8 bg-slate-900 hover:bg-slate-800 text-white shadow-lg">
                Start AI Reading
              </Button>
            </Link>
            <Link href="/cards">
              <Button variant="outline" size="lg" className="px-8 border-slate-300 text-slate-700 hover:bg-slate-50">
                Explore Cards
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-5 h-5 text-slate-600" />
              </div>
              <CardTitle className="text-slate-900">AI Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm">
                Machine learning algorithms analyze card combinations for deeper insights and patterns.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Share2 className="w-5 h-5 text-slate-600" />
              </div>
              <CardTitle className="text-slate-900">Cloud Sync</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm">
                Secure cloud storage with instant sharing capabilities and reading history.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-5 h-5 text-slate-600" />
              </div>
              <CardTitle className="text-slate-900">Knowledge Base</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm">
                Comprehensive database of card meanings, historical context, and interpretive guidance.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Reading Types */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-3 text-slate-900">AI Reading Options</h2>
          <p className="text-center text-slate-600 mb-6 text-sm">Choose your analysis depth</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
             <Link href="/read/new">
               <Card className="hover:shadow-md transition-all cursor-pointer group border border-slate-200 hover:border-slate-300 bg-white">
                 <CardHeader className="pb-3">
                   <CardTitle className="flex items-center gap-2 group-hover:text-slate-700 text-base text-slate-900">
                     <Star className="w-4 h-4" />
                     Quick Analysis
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="pt-0">
                   <p className="text-xs text-slate-600 mb-2">
                     Past, Present, Future
                   </p>
                   <div className="flex items-center text-slate-500 text-xs">
                     3 Cards <ArrowRight className="w-3 h-3 ml-1" />
                   </div>
                 </CardContent>
               </Card>
             </Link>

             <Link href="/read/new">
               <Card className="hover:shadow-md transition-all cursor-pointer group border border-slate-200 hover:border-slate-300 bg-white">
                 <CardHeader className="pb-3">
                   <CardTitle className="flex items-center gap-2 group-hover:text-slate-700 text-base text-slate-900">
                     <Heart className="w-4 h-4" />
                     Deep Analysis
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="pt-0">
                   <p className="text-xs text-slate-600 mb-2">
                     Extended Reading with Challenges
                   </p>
                   <div className="flex items-center text-slate-500 text-xs">
                     5 Cards <ArrowRight className="w-3 h-3 ml-1" />
                   </div>
                 </CardContent>
               </Card>
             </Link>

             <Link href="/read/new">
               <Card className="hover:shadow-md transition-all cursor-pointer group border border-slate-200 hover:border-slate-300 bg-white">
                 <CardHeader className="pb-3">
                   <CardTitle className="flex items-center gap-2 group-hover:text-slate-700 text-base text-slate-900">
                     <Shield className="w-4 h-4" />
                     Comprehensive
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="pt-0">
                   <p className="text-xs text-slate-600 mb-2">
                     Life Overview Analysis
                   </p>
                   <div className="flex items-center text-slate-500 text-xs">
                     9 Cards <ArrowRight className="w-3 h-3 ml-1" />
                   </div>
                 </CardContent>
               </Card>
             </Link>

             <Link href="/read/new">
               <Card className="hover:shadow-md transition-all cursor-pointer group border border-slate-200 hover:border-slate-300 bg-white">
                 <CardHeader className="pb-3">
                   <CardTitle className="flex items-center gap-2 group-hover:text-slate-700 text-base text-slate-900">
                     <Sparkles className="w-4 h-4" />
                     Grand Tableau
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="pt-0">
                   <p className="text-xs text-slate-600 mb-2">
                     Complete Deck Analysis
                   </p>
                   <div className="flex items-center text-slate-500 text-xs">
                     36 Cards <ArrowRight className="w-3 h-3 ml-1" />
                   </div>
                 </CardContent>
               </Card>
             </Link>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-center mb-6 text-slate-900">User Feedback</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                  "Lenormand Intelligence has helped me make many important decisions. The AI analysis provides accurate insights and confidence about the future."
                </p>
                <div className="font-semibold text-slate-900 text-sm">Sarah L.</div>
                <div className="text-xs text-slate-500">New York</div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                  "The AI-powered analysis helps me understand my circumstances better. It's both insightful and practical, providing concrete guidance."
                </p>
                <div className="font-semibold text-slate-900 text-sm">Emma W.</div>
                <div className="text-xs text-slate-500">London</div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                  "The AI accuracy is impressive. Whether for relationships or work, the insights have been invaluable. It's become an essential tool."
                </p>
                <div className="font-semibold text-slate-900 text-sm">Michael R.</div>
                <div className="text-xs text-slate-500">Toronto</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-center mb-6 text-slate-900">FAQ</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-slate-900">What is Lenormand vs Tarot?</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-slate-600 text-sm">
                  Lenormand uses 36 cards with specific symbols for practical, everyday matters. Unlike Tarot's 78 cards and spiritual themes, Lenormand provides direct, specific guidance ideal for AI analysis.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-slate-900">Benefits of AI-powered readings?</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-slate-600 text-sm">
                  24/7 access with instant AI analysis. Advanced algorithms ensure true randomness while providing deeper insights through machine learning pattern recognition.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-slate-900">How to get a free reading?</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-slate-600 text-sm">
                  Click "Start AI Reading" above. Focus on your question and let our algorithms select and analyze your cards. No signup or payment required.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-slate-900">Accuracy of AI readings?</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-slate-600 text-sm">
                  AI readings are highly accurate, providing consistent analysis based on traditional meanings enhanced by machine learning pattern recognition.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-slate-50 rounded-xl p-8 border border-slate-200">
          <h2 className="text-2xl font-bold mb-3 text-slate-900">
            Experience AI-Powered Insight
          </h2>
          <p className="text-slate-600 mb-6 text-sm">
            Join thousands using advanced Lenormand analysis
          </p>
          <Link href="/read/new">
            <Button size="lg" className="px-6 bg-slate-900 hover:bg-slate-800 text-white shadow-sm">
              Start Your Analysis
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-6">
        <div className="container mx-auto px-4 text-center text-slate-600">
          <p className="mb-3 text-sm">
            © 2024 Lenormand Intelligence - AI-Powered Lenormand Analysis
          </p>
          <div className="flex gap-6 justify-center text-xs">
            <Link href="/cards" className="hover:text-slate-900 transition-colors">
              Knowledge Base
            </Link>
            <Link href="/read/new" className="hover:text-slate-900 transition-colors">
              New Analysis
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
