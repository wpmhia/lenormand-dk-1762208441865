"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  BookOpen, 
  Share2, 
  TrendingUp,
  Calendar,
  Eye,
  BarChart3,
  Settings,
  Download
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

interface AdminStats {
  overview: {
    totalUsers: number
    totalReadings: number
    publicReadings: number
    publicPercentage: number
    totalDraws: number
    avgReadingsPerUser: number
  }
  recentReadings: Array<{
    id: string
    title: string
    createdAt: string
    isPublic: boolean
    layoutType: number
    user?: {
      name: string | null
      email: string
    }
  }>
  topCards: Array<{
    cardId: number
    count: number
    card: {
      id: number
      name: string
    }
  }>
  topUsers: Array<{
    id: string
    name: string | null
    email: string
    readingCount: number
    totalDraws: number
  }>
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      // Simple admin check - in production, use proper role-based access
      if (!session.user?.email?.includes('admin')) {
        router.push('/')
        return
      }
      fetchStats()
    }
  }, [status, router, session])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading admin dashboard...</div>
      </div>
    )
  }

  if (!session || !session.user?.email?.includes('admin')) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage Lenormand.dk platform and view analytics
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Link href="/me">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              User Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Stats */}
      {stats && (
        <div className="grid md:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overview.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Readings</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overview.totalReadings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Public Readings</CardTitle>
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overview.publicReadings}</div>
              <p className="text-xs text-muted-foreground">
                {stats.overview.publicPercentage}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Draws</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overview.totalDraws}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg/User</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overview.avgReadingsPerUser}</div>
              <p className="text-xs text-muted-foreground">
                readings per user
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.overview.totalUsers > 0 
                  ? Math.round((stats.overview.totalReadings / stats.overview.totalUsers) * 10) / 10
                  : 0
                }
              </div>
              <p className="text-xs text-muted-foreground">
                avg readings
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="recent" className="space-y-6">
        <TabsList>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="cards">Top Cards</TabsTrigger>
          <TabsTrigger value="users">Top Users</TabsTrigger>
        </TabsList>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Readings</CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.recentReadings.length ? (
                <div className="space-y-4">
                  {stats.recentReadings.map((reading) => (
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
                          <Badge variant="outline" className="text-xs">
                            {reading.layoutType} cards
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Users className="w-3 h-3" />
                          {reading.user?.name || reading.user?.email || 'Anonymous'}
                          <span>•</span>
                          <Calendar className="w-3 h-3" />
                          {format(new Date(reading.createdAt), 'MMM d, yyyy HH:mm')}
                        </div>
                      </div>
                      <Link href={`/read/${reading.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No recent readings</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cards">
          <Card>
            <CardHeader>
              <CardTitle>Most Drawn Cards</CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.topCards.length ? (
                <div className="space-y-4">
                  {stats.topCards.map((stat, index) => (
                    <div key={stat.cardId} className="flex items-center gap-3">
                      <div className="text-sm font-medium text-gray-500 w-6">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{stat.card.name}</span>
                          <span className="text-sm text-gray-600">{stat.count} times</span>
                        </div>
                        <Progress 
                          value={(stat.count / stats.topCards[0].count) * 100} 
                          className="h-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No card statistics yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Most Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.topUsers.length ? (
                <div className="space-y-4">
                  {stats.topUsers.map((user, index) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium text-gray-500 w-6">
                          #{index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{user.name || user.email}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{user.readingCount} readings</div>
                        <div className="text-sm text-gray-600">{user.totalDraws} cards drawn</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No user statistics yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}