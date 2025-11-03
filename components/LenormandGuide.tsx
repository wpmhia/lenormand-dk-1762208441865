"use client"

import { useState } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ChevronDown, ChevronUp, BookOpen, HelpCircle, Lightbulb, Target } from 'lucide-react'

interface LenormandGuideProps {
  className?: string
}

export function LenormandGuide({ className }: LenormandGuideProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const questionExamples = [
    { category: "Love & Relationships", examples: [
      "What do I need to know about my relationship with [person]?",
      "How can I improve my love life?",
      "What obstacles are preventing me from finding love?",
      "What does the future hold for my current relationship?"
    ]},
    { category: "Career & Work", examples: [
      "What should I focus on in my career right now?",
      "How can I improve my work situation?",
      "What opportunities are coming my way professionally?",
      "Should I take this job opportunity?"
    ]},
    { category: "Personal Growth", examples: [
      "What do I need to work on within myself?",
      "How can I overcome my current challenges?",
      "What lessons am I meant to learn right now?",
      "What's holding me back from personal growth?"
    ]},
    { category: "General Guidance", examples: [
      "What guidance do the cards have for me today?",
      "What energy surrounds my current situation?",
      "What should I be aware of in the coming weeks?",
      "How can I best navigate my current path?"
    ]}
  ]

  return (
    <div className={`space-y-4 ${className}`}>
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50/80 to-indigo-50/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <BookOpen className="w-5 h-5" />
            How to Read Lenormand Cards
          </CardTitle>
          <p className="text-sm text-blue-600">
            Learn the basics of Lenormand reading to get more accurate insights
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* What are Lenormand Cards */}
          <Collapsible open={openSections.basics} onOpenChange={() => toggleSection('basics')}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-3 hover:bg-blue-100">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  <span className="font-medium">What are Lenormand Cards?</span>
                </div>
                {openSections.basics ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mt-3 p-4 bg-white rounded-lg border border-blue-100">
              <p className="text-sm text-slate-700 leading-relaxed">
                Lenormand cards are a 36-card oracle deck originating from 19th century Europe. Unlike Tarot, 
                Lenormand cards are more direct and practical, focusing on everyday situations and concrete outcomes. 
                Each card has specific meanings that combine to create detailed insights about your life.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-1">Direct & Practical</h4>
                  <p className="text-xs text-blue-600">Focuses on real-life situations and concrete answers</p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <h4 className="font-medium text-indigo-800 mb-1">Combination-Based</h4>
                  <p className="text-xs text-indigo-600">Cards modify each other to create nuanced meanings</p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator className="bg-blue-200" />

          {/* How to Formulate Questions */}
          <Collapsible open={openSections.questions} onOpenChange={() => toggleSection('questions')}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-3 hover:bg-blue-100">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span className="font-medium">How to Formulate Questions</span>
                </div>
                {openSections.questions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mt-3 p-4 bg-white rounded-lg border border-blue-100">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-slate-800 mb-2">Do's ✅</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Be specific and focused</li>
                    <li>• Ask about situations and actions</li>
                    <li>• Use "what," "how," or "when" questions</li>
                    <li>• Focus on yourself and your choices</li>
                    <li>• Keep questions open-ended</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-slate-800 mb-2">Don'ts ❌</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Avoid yes/no questions</li>
                    <li>• Don't ask about others without their consent</li>
                    <li>• Avoid medical, legal, or financial advice</li>
                    <li>• Don't ask the same question repeatedly</li>
                    <li>• Avoid questions about death or specific timing</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <h4 className="font-medium text-amber-800">Example Questions</h4>
                </div>
                <div className="space-y-2">
                  {questionExamples.map((category, index) => (
                    <div key={index} className="space-y-1">
                      <Badge variant="outline" className="text-xs bg-amber-100 border-amber-300 text-amber-800">
                        {category.category}
                      </Badge>
                      <div className="ml-2 space-y-1">
                        {category.examples.slice(0, 2).map((example, i) => (
                          <p key={i} className="text-xs text-slate-600 italic">"{example}"</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator className="bg-blue-200" />

          {/* Understanding Card Positions */}
          <Collapsible open={openSections.positions} onOpenChange={() => toggleSection('positions')}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-3 hover:bg-blue-100">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span className="font-medium">Understanding Card Positions</span>
                </div>
                {openSections.positions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mt-3 p-4 bg-white rounded-lg border border-blue-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <h4 className="font-medium text-slate-800 mb-1">3-Card Spread</h4>
                  <ul className="text-xs text-slate-600 space-y-1">
                    <li><strong>Past:</strong> What led to this</li>
                    <li><strong>Present:</strong> Current situation</li>
                    <li><strong>Future:</strong> Where it's heading</li>
                  </ul>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <h4 className="font-medium text-slate-800 mb-1">5-Card Spread</h4>
                  <ul className="text-xs text-slate-600 space-y-1">
                    <li><strong>Past:</strong> Background</li>
                    <li><strong>Present:</strong> Current state</li>
                    <li><strong>Future:</strong> What's coming</li>
                    <li><strong>Challenge:</strong> Obstacles</li>
                    <li><strong>Advice:</strong> Guidance</li>
                  </ul>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <h4 className="font-medium text-slate-800 mb-1">9-Card Spread</h4>
                  <ul className="text-xs text-slate-600 space-y-1">
                    <li><strong>Center:</strong> Core issue</li>
                    <li><strong>Around:</strong> Influences</li>
                    <li><strong>Corners:</strong> Outcomes</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-slate-600 mt-3">
                <strong>Tip:</strong> Hover over position labels to see detailed explanations of what each position represents in your reading.
              </p>
            </CollapsibleContent>
          </Collapsible>

          <Separator className="bg-blue-200" />

          {/* Reading Tips */}
          <Collapsible open={openSections.tips} onOpenChange={() => toggleSection('tips')}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-3 hover:bg-blue-100">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  <span className="font-medium">Reading Tips & Best Practices</span>
                </div>
                {openSections.tips ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mt-3 p-4 bg-white rounded-lg border border-blue-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-slate-800">Before Reading</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Take a few deep breaths to center yourself</li>
                    <li>• Clear your mind of distractions</li>
                    <li>• Focus on your question while shuffling</li>
                    <li>• Trust your intuition when selecting cards</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-slate-800">During Reading</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Click cards to see detailed meanings</li>
                    <li>• Look at how cards modify each other</li>
                    <li>• Consider the position meanings</li>
                    <li>• Pay attention to your gut feelings</li>
                  </ul>
                </div>
              </div>
              <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800 mb-1">Pro Tip</h4>
                <p className="text-sm text-green-600">
                  Keep a reading journal! Note your questions, cards drawn, and how the reading played out. 
                  This helps you learn patterns and develop your personal connection with the cards.
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>

        </CardContent>
      </Card>
    </div>
  )
}