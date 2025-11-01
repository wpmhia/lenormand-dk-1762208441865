"use client"

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Reading, DrawStat, UserStats } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Share2, 
  Eye, 
  Settings,
  LogOut,
  Plus,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [readings, setReadings] = useState<Reading[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchDashboardData()
    }
  }, [status, router])

  const fetchDashboardData = async () => {
    try {
      const [readingsResponse, statsResponse] = await Promise.all([
        fetch('/api/me/readings'),
        fetch('/api/me/stats')
      ])

      if (readingsResponse.ok) {
        const readingsData = await readingsResponse.json()
        setReadings(readingsData.readings)
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setUserStats(statsData)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMostDrawnCards = () => {
    if (!userStats?.cardDraws) return []
    return [...userStats.cardDraws]
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  const getRecentReadings = () => {
    return readings
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading dashboard...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {session.user?.name}!</h1>
          <p className="text-gray-600">
            Track your Lenormand readings and discover patterns in your card draws
          </p>
        </div>
        
        <div className="flex gap-3">
          <Link href="/read/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Reading
            </Button>
          </Link>
          <Button variant="outline" onClick={() => signOut()}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Readings</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats?.totalReadings || 0}</div>
            <p className="text-xs text-muted-foreground">
              All time readings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cards Drawn</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userStats?.cardDraws.reduce((sum, stat) => sum + stat.count, 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Total cards drawn
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Public Readings</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {readings.filter(r => r.isPublic).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Shared readings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {readings.filter(r => {
                const readingDate = new Date(r.createdAt)
                const now = new Date()
                return readingDate.getMonth() === now.getMonth() && 
                       readingDate.getFullYear() === now.getFullYear()
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Readings this month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Readings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Readings</CardTitle>
              <Link href="/me/readings">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {getRecentReadings().length > 0 ? (
              <div className="space-y-4">
                {getRecentReadings().map((reading) => (
                  <div key={reading.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{reading.title}</h4>
                        {reading.isPublic && (
                          <Badge variant="secondary" className="text-xs">
                            <Share2 className="w-3 h-3 mr-1" />
                            Public
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {reading.question && `"${reading.question.substring(0, 50)}${reading.question.length > 50 ? '...' : ''}"`}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(reading.createdAt), 'MMM d, yyyy')}
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">
                          {reading.layoutType} cards
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/read/${reading.slug}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No readings yet</p>
                <Link href="/read/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Reading
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Most Drawn Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Most Drawn Cards</CardTitle>
          </CardHeader>
          <CardContent>
            {getMostDrawnCards().length > 0 ? (
              <div className="space-y-4">
                {getMostDrawnCards().map((stat, index) => (
                  <div key={stat.card.id} className="flex items-center gap-3">
                    <div className="text-sm font-medium text-gray-500 w-6">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{stat.card.name}</span>
                        <span className="text-sm text-gray-600">{stat.count} times</span>
                      </div>
                      <Progress 
                        value={(stat.count / (userStats?.cardDraws[0]?.count || 1)) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No card statistics yet</p>
                <p className="text-sm text-gray-400">Start doing readings to see your patterns</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/read/new">
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col gap-2">
                <Plus className="w-6 h-6" />
                <span>New Reading</span>
              </Button>
            </Link>
            <Link href="/cards">
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col gap-2">
                <BookOpen className="w-6 h-6" />
                <span>Browse Cards</span>
              </Button>
            </Link>
            <Link href="/me/readings">
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col gap-2">
                <Eye className="w-6 h-6" />
                <span>My Readings</span>
              </Button>
            </Link>
            <Link href="/me/settings">
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col gap-2">
                <Settings className="w-6 h-6" />
                <span>Settings</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}