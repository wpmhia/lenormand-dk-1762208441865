import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Warm up AI connection
    const response = await fetch('https://api.deepseek.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'User-Agent': 'Lenormand-DK/1.0'
      },
      signal: AbortSignal.timeout(5000) // 5 second timeout
    })

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      timestamp: new Date().toISOString(),
      warmed: true
    })
  } catch (error) {
    console.error('Warmup failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      warmed: false
    })
  }
}