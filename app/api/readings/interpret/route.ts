import { NextRequest, NextResponse } from 'next/server'

// Simple API route - static response for testing
export async function POST(request: NextRequest) {
  // Return static response for testing
  return NextResponse.json({
    reading: "The cards suggest a period of reflection and new opportunities. Trust your intuition as you navigate this path."
  })
}