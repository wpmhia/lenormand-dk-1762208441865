import { describe, it, expect, vi, beforeEach } from 'vitest'
import { isDeepSeekAvailable, parseAIResponse } from '@/lib/deepseek'

// Mock fetch globally
global.fetch = vi.fn()

describe('DeepSeek Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset environment variables
    delete process.env.DEEPSEEK_API_KEY
    delete process.env.DEEPSEEK_BASE_URL
  })

  describe('isDeepSeekAvailable', () => {
    it('returns false when API key is not set', () => {
      expect(isDeepSeekAvailable()).toBe(false)
    })

    it('returns true when API key is set', () => {
      process.env.DEEPSEEK_API_KEY = 'test-key'
      expect(isDeepSeekAvailable()).toBe(true)
    })
  })

  describe('parseAIResponse', () => {
    it('parses structured response correctly', () => {
      const response = `1. Money releases within 24 hours, but FX fees will nibble; expect 98% of original sum.
2. Risk: Delays from banking bureaucracy
3. Timing: Within 48 hours
4. ACT`

      const result = parseAIResponse(response)

      expect(result).toEqual({
        storyline: 'Money releases within 24 hours, but FX fees will nibble; expect 98% of original sum.',
        risk: 'Delays from banking bureaucracy',
        timing: 'Within 48 hours',
        action: 'ACT',
        rawResponse: response
      })
    })

    it('handles unstructured response gracefully', () => {
      const response = 'This is a general reading about your situation. The cards suggest positive changes ahead.'

      const result = parseAIResponse(response)

      expect(result.storyline).toContain('This is a general reading')
      expect(result.risk).toBe('Monitor developments carefully')
      expect(result.timing).toBe('Timing unclear - observe signs')
      expect(result.action).toBe('Observe')
    })

    it('limits storyline length', () => {
      const longStoryline = 'A'.repeat(200)
      const response = `1. ${longStoryline}
2. Risk: Something
3. Timing: Soon
4. ACT`

      const result = parseAIResponse(response)

      expect(result.storyline.length).toBeLessThanOrEqual(150)
    })
  })
})