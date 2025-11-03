import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen,
  Clock,
  Star,
  ArrowRight,
  Sparkles,
  Heart,
  Users,
  Lightbulb,
  Target,
  Compass
} from 'lucide-react'

export default function LearnPage() {
  const modules = [
    {
      id: 'introduction',
      title: 'Introduction to Lenormand',
      description: 'Discover the ancient wisdom of Lenormand divination and its rich history',
      icon: BookOpen,
      duration: '15 min',
      difficulty: 'Beginner',
      color: 'from-amber-500 to-rose-500'
    },
    {
      id: 'history',
      title: 'History & Origins',
      description: 'Explore the fascinating history of Lenormand from 18th century France to modern day',
      icon: Clock,
      duration: '20 min',
      difficulty: 'Beginner',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 'reading-basics',
      title: 'How to Read Lenormand',
      description: 'Master the fundamentals of reading Lenormand cards as meaningful sentences',
      icon: Target,
      duration: '25 min',
      difficulty: 'Beginner',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'card-meanings',
      title: 'Card Meanings & Associations',
      description: 'Learn the traditional meanings and symbolic associations of all 36 cards',
      icon: Sparkles,
      duration: '45 min',
      difficulty: 'Intermediate',
      color: 'from-rose-500 to-pink-500'
    },
    {
      id: 'spreads',
      title: 'Spreads & Techniques',
      description: 'Discover powerful spreads and advanced reading techniques',
      icon: Compass,
      duration: '30 min',
      difficulty: 'Intermediate',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'advanced',
      title: 'Advanced Concepts',
      description: 'Time associations, playing cards, and cultural interpretations',
      icon: Lightbulb,
      duration: '35 min',
      difficulty: 'Advanced',
      color: 'from-violet-500 to-purple-500'
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    }
  }

  return (
    <div className="page-layout">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-rose-400/5 to-purple-500/10"></div>
        <div className="relative container mx-auto px-4 py-16 max-w-6xl">
          <div className="text-center space-y-8">
            <Badge className="bg-gradient-to-r from-amber-600/40 via-rose-500/40 to-purple-600/40 text-amber-900 dark:text-amber-100 border-amber-600/50 px-6 py-3 text-sm font-semibold tracking-wide uppercase rounded-full backdrop-blur-sm">
              ✨ Master Lenormand Divination
            </Badge>

            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-amber-900 dark:text-amber-100 leading-tight">
                <span className="relative inline-block">
                  Lenormand
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 rounded-full opacity-80"></div>
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-rose-700 to-purple-700 dark:from-amber-400 dark:via-rose-400 dark:to-purple-400">
                  Wisdom Course
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-amber-800 dark:text-amber-200 max-w-3xl mx-auto leading-relaxed">
                Embark on a comprehensive journey through the ancient art of Lenormand divination.
                From beginner fundamentals to advanced techniques, master the 36-card oracle that has guided seekers for centuries.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/learn/introduction">
                <Button size="lg" className="px-8 py-4 bg-gradient-to-r from-amber-600 via-rose-500 to-purple-600 hover:from-amber-700 hover:via-rose-600 hover:to-purple-700 text-white shadow-2xl shadow-amber-500/30 font-semibold text-lg rounded-full border border-amber-400/20">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/cards">
                <Button variant="outline" size="lg" className="px-8 py-4 border-2 border-amber-600/50 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/20 hover:border-amber-700/70 font-semibold text-lg rounded-full">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Explore Cards First
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Course Overview */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-amber-900 dark:text-amber-100 mb-4">
            Your Learning Path
          </h2>
          <p className="text-amber-800 dark:text-amber-200 text-lg max-w-2xl mx-auto">
            A structured journey from novice to master, designed to build your confidence and intuition step by step.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {modules.map((module, index) => (
            <Card key={module.id} className="hover:shadow-2xl hover:shadow-amber-500/20 dark:hover:shadow-amber-500/30 cursor-pointer group border border-amber-400/20 dark:border-amber-400/30 hover:border-amber-400/60 dark:hover:border-amber-400/70 bg-gradient-to-br from-white via-amber-50/50 to-rose-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 backdrop-blur-sm min-h-[200px] rounded-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${module.color} flex items-center justify-center`}>
                    <module.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge className={getDifficultyColor(module.difficulty)}>
                    {module.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-lg text-slate-800 dark:text-white font-semibold group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                  {module.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 relative z-10">
                <p className="text-sm text-slate-600 dark:text-amber-100 mb-4 leading-relaxed">
                  {module.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-amber-700 dark:text-amber-300 text-sm font-medium">
                    <Clock className="w-4 h-4 mr-1" />
                    {module.duration}
                  </div>
                  <Link href={`/learn/${module.id}`}>
                    <Button size="sm" variant="ghost" className="text-amber-700 dark:text-amber-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/20 p-0 h-auto">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Why Learn Lenormand */}
        <div className="bg-gradient-to-r from-white via-amber-50/50 to-rose-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 backdrop-blur-sm rounded-3xl p-8 border border-amber-400/20 dark:border-amber-400/30 shadow-2xl">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-4">
              Why Learn Lenormand?
            </h3>
            <p className="text-amber-800 dark:text-amber-200">
              Discover why Lenormand has captivated diviners for over two centuries
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full flex items-center justify-center mx-auto">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-amber-900 dark:text-amber-100">Direct & Practical</h4>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Unlike Tarot&apos;s esoteric symbolism, Lenormand speaks in everyday language with clear, actionable guidance.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-amber-900 dark:text-amber-100">Emotional Intelligence</h4>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Lenormand helps you understand relationships, emotions, and interpersonal dynamics with remarkable clarity.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-amber-900 dark:text-amber-100">Community Wisdom</h4>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Join a global community of readers who have used Lenormand for guidance, insight, and personal growth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}