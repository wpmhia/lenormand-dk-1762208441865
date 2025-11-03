"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { BookOpen, Heart, Shield, Sparkles, Eye } from 'lucide-react'
import { LenormandGuide } from '@/components/LenormandGuide'

export function Footer() {
  const [showGuide, setShowGuide] = useState(false)

  return (
    <>
      <footer className="border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            
            {/* Brand Section */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Lenormand Intelligence
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Mystical Card Wisdom for modern seekers. Discover guidance through the ancient art of Lenormand divination.
              </p>
              <div className="flex items-center gap-1 text-slate-500 text-xs">
                <span>Made with</span>
                <Heart className="w-3 h-3 text-rose-400" />
                <span>for divination enthusiasts</span>
              </div>
            </div>

            {/* Navigation Section */}
            <div className="space-y-4">
              <h4 className="text-white font-medium">Navigation</h4>
              <div className="space-y-2">
                <Link 
                  href="/read/new" 
                  className="block text-slate-400 hover:text-slate-200 text-sm transition-colors"
                >
                  New Analysis
                </Link>
                <Link 
                  href="/cards" 
                  className="block text-slate-400 hover:text-slate-200 text-sm transition-colors"
                >
                  Explore Cards
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowGuide(true)}
                  className="text-slate-400 hover:text-slate-200 hover:bg-slate-800 p-0 h-auto justify-start"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  How to Read
                </Button>
              </div>
            </div>

            {/* Legal & Privacy Section */}
            <div className="space-y-4">
              <h4 className="text-white font-medium">Legal & Privacy</h4>
              <div className="space-y-2">
                <Link 
                  href="/privacy" 
                  className="flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  Privacy Policy
                </Link>
                <Link 
                  href="/terms" 
                  className="flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-slate-400 text-sm">
                © 2024 Lenormand.dk - Danish & English Lenormand Readings
              </div>
              
              <div className="text-slate-500 text-xs">
                For entertainment and spiritual guidance purposes only
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Guide Dialog */}
      <Dialog open={showGuide} onOpenChange={setShowGuide}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              How to Read Lenormand Cards
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <LenormandGuide />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}