import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AnimatedCard } from '@/components/AnimatedCard'
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
      color: 'from-primary to-primary/80'
    },
    {
      id: 'history',
      title: 'History & Origins',
      description: 'Explore the fascinating history of Lenormand from 18th century France to modern day',
      icon: Clock,
      duration: '20 min',
      difficulty: 'Beginner',
      color: 'from-primary to-primary/80'
    },
    {
      id: 'reading-basics',
      title: 'How to Read Lenormand',
      description: 'Master the fundamentals of reading Lenormand cards as meaningful sentences',
      icon: Target,
      duration: '25 min',
      difficulty: 'Beginner',
      color: 'from-primary to-primary/80'
    },
    {
      id: 'card-meanings',
      title: 'Card Meanings & Associations',
      description: 'Learn the traditional meanings and symbolic associations of all 36 cards',
      icon: Sparkles,
      duration: '45 min',
      difficulty: 'Intermediate',
      color: 'from-primary to-primary/80'
    },
    {
      id: 'spreads',
      title: 'Spreads & Techniques',
      description: 'Discover powerful spreads and advanced reading techniques',
      icon: Compass,
      duration: '30 min',
      difficulty: 'Intermediate',
      color: 'from-primary to-primary/80'
    },
    {
      id: 'advanced',
      title: 'Advanced Concepts',
      description: 'Time associations, playing cards, and cultural interpretations',
      icon: Lightbulb,
      duration: '35 min',
      difficulty: 'Advanced',
      color: 'from-primary to-primary/80'
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-primary/10 text-primary border-primary/30 dark:bg-primary/20 dark:text-primary dark:border-primary/40'
      case 'Intermediate': return 'bg-muted text-muted-foreground border-border dark:bg-muted/50 dark:text-muted-foreground dark:border-border'
      case 'Advanced': return 'bg-muted text-foreground border-border dark:bg-muted dark:text-foreground dark:border-border'
      default: return 'bg-muted/50 text-muted-foreground border-border/50'
    }
  }

  return (
    <div className="page-layout">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10"></div>
        <div className="relative container mx-auto px-4 py-16 max-w-6xl">
          <div className="text-center space-y-8">
            <Badge className="badge-hero">
              ✨ Master Lenormand Divination
            </Badge>

            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                <span className="relative inline-block">
                  Lenormand
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/60 rounded-full opacity-80"></div>
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/60">
                  Wisdom Course
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Embark on a comprehensive journey through the ancient art of Lenormand divination.
                From beginner fundamentals to advanced techniques, master the 36-card oracle that has guided seekers for centuries.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/learn/introduction">
                 <Button className="btn-learn">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/cards">
                <Button className="btn-learn-outline">
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
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Your Learning Path
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A structured journey from novice to master, designed to build your confidence and intuition step by step.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {modules.map((module, index) => (
            <AnimatedCard key={module.id} delay={index * 0.1} className="cursor-pointer">
              <Card className="hover:shadow-2xl hover:shadow-primary/20 group border border-border hover:border-border/60 bg-card backdrop-blur-sm min-h-[200px] rounded-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${module.color} flex items-center justify-center`}>
                    <module.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge className={getDifficultyColor(module.difficulty)}>
                    {module.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-lg text-card-foreground font-semibold group-hover:text-primary transition-colors">
                  {module.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 relative z-10">
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {module.description}
                </p>
                <div className="flex items-center justify-between">
                   <div className="flex items-center text-sm font-medium">
                     <span className="inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-semibold bg-primary/12 text-primary dark:bg-primary dark:text-primary-foreground ring-1 ring-primary/10 dark:ring-primary/30">
                       <Clock className="w-3 h-3 mr-1" />
                       {module.duration}
                     </span>
                   </div>
                  <Link href={`/learn/${module.id}`}>
                    <Button size="sm" variant="ghost" className="text-primary hover:text-primary/80 hover:bg-muted p-0 h-auto">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
              </Card>
            </AnimatedCard>
          ))}
        </div>

        {/* Why Learn Lenormand */}
        <div className="bg-card backdrop-blur-sm rounded-3xl p-8 border border-border shadow-2xl">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Why Learn Lenormand?
            </h3>
             <p className="text-muted-foreground">
               Discover why Lenormand has captivated diviners for over two centuries
             </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto">
                <Target className="w-8 h-8 text-white" />
              </div>
               <h4 className="font-semibold text-foreground">Direct & Practical</h4>
               <p className="text-sm text-muted-foreground">
                 Unlike Tarot&apos;s esoteric symbolism, Lenormand speaks in everyday language with clear, actionable guidance.
               </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-white" />
              </div>
               <h4 className="font-semibold text-foreground">Emotional Intelligence</h4>
               <p className="text-sm text-muted-foreground">
                 Lenormand helps you understand relationships, emotions, and interpersonal dynamics with remarkable clarity.
               </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-white" />
              </div>
               <h4 className="font-semibold text-foreground">Community Wisdom</h4>
               <p className="text-sm text-muted-foreground">
                 Join a global community of readers who have used Lenormand for guidance, insight, and personal growth.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}