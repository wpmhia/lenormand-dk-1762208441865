"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { BookOpen, Info, Heart } from 'lucide-react'
import { LenormandGuide } from '@/components/LenormandGuide'

export function Footer() {
  const [showGuide, setShowGuide] = useState(false)

  return (
    <>
      <footer className="border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-slate-400 text-sm">
              © 2024 Lenormand.dk - Danish & English Lenormand Readings
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGuide(true)}
                className="text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                How to Read
              </Button>
              
              <div className="flex items-center gap-1 text-slate-500 text-xs">
                <Info className="w-3 h-3" />
                <span>Made with</span>
                <Heart className="w-3 h-3 text-rose-400" />
                <span>for divination enthusiasts</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

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