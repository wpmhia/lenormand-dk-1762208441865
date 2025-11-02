"use client"

import { useCallback, useMemo } from 'react'
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  Panel,
} from 'reactflow'
import 'reactflow/dist/style.css'

import { Card, ReadingCard } from '@/lib/types'
import { CardRelationship } from '@/app/api/readings/relationships/route'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card as UICard, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Network, Eye, EyeOff } from 'lucide-react'

interface CardRelationshipVisualizerProps {
  cards: ReadingCard[]
  allCards: Card[]
  relationships: CardRelationship[]
  summary: string
  isLoading?: boolean
  error?: string | null
}

// Custom node component for cards
function CardNode({ data }: { data: { card: ReadingCard; fullCard: Card } }) {
  const { card, fullCard } = data

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg hover:shadow-xl transition-shadow cursor-pointer min-w-[120px]">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-slate-700 rounded flex items-center justify-center">
                <img
                  src={`/data/images/cards/${String(card.id).padStart(2, '0')}-${fullCard.name.toLowerCase()}.png`}
                  alt={fullCard.name}
                  className="w-full h-full object-cover rounded"
                  onError={(e) => {
                    // Fallback to text if image fails
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.nextElementSibling!.textContent = fullCard.name
                  }}
                />
                <span className="text-xs text-slate-300 hidden">{fullCard.name}</span>
              </div>
              <div className="text-xs font-medium text-slate-200">
                {fullCard.name}
              </div>
              {card.reversed && (
                <Badge variant="secondary" className="text-xs mt-1 bg-amber-600">
                  Rev
                </Badge>
              )}
              <div className="text-xs text-slate-400 mt-1">
                Pos {card.position}
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="max-w-xs">
            <div className="font-semibold">{fullCard.name}</div>
            <div className="text-sm text-slate-300 mt-1">{fullCard.uprightMeaning}</div>
            {card.reversed && (
              <div className="text-sm text-amber-400 mt-1">Reversed</div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Node types for React Flow
const nodeTypes = {
  cardNode: CardNode,
}

interface CardRelationshipVisualizerProps {
  cards: ReadingCard[]
  allCards: Card[]
  relationships: CardRelationship[]
  summary: string
  isLoading?: boolean
  error?: string | null
}

export function CardRelationshipVisualizer({
  cards,
  allCards,
  relationships,
  summary,
  isLoading = false,
  error = null
}: CardRelationshipVisualizerProps) {
  // Create nodes from cards
  const initialNodes: Node[] = useMemo(() => {
    return cards.map((card, index) => {
      const fullCard = allCards.find(c => c.id === card.id)
      if (!fullCard) return null

      // Position cards in a circle or grid based on layout
      const angle = (index / cards.length) * 2 * Math.PI
      const radius = 200
      const x = 400 + radius * Math.cos(angle)
      const y = 300 + radius * Math.sin(angle)

      return {
        id: card.id.toString(),
        type: 'cardNode',
        position: { x, y },
        data: { card, fullCard },
        draggable: true,
      }
    }).filter(Boolean) as Node[]
  }, [cards, allCards])

  // Create edges from relationships
  const initialEdges: Edge[] = useMemo(() => {
    return relationships.map((rel, index) => {
      // Map strength to edge styling
      const strengthStyles = {
        weak: { stroke: '#64748b', strokeWidth: 1 },
        moderate: { stroke: '#3b82f6', strokeWidth: 2 },
        strong: { stroke: '#10b981', strokeWidth: 3 },
        conflicting: { stroke: '#ef4444', strokeWidth: 2, strokeDasharray: '5,5' },
      }

      const typeColors = {
        supportive: '#10b981',
        challenging: '#ef4444',
        neutral: '#64748b',
        amplifying: '#f59e0b',
      }

      return {
        id: `edge-${rel.fromCardId}-${rel.toCardId}-${index}`,
        source: rel.fromCardId.toString(),
        target: rel.toCardId.toString(),
        type: 'smoothstep',
        style: strengthStyles[rel.strength],
        label: rel.type,
        labelStyle: { fontSize: '10px', fill: typeColors[rel.type] },
        data: { explanation: rel.explanation },
      }
    })
  }, [relationships])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  if (error) {
    return (
      <UICard className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <Network className="w-8 h-8 mx-auto mb-2" />
            <p className="font-medium">Relationship Analysis Unavailable</p>
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </UICard>
    )
  }

  if (isLoading) {
    return (
      <UICard className="border-slate-700 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            Analyzing Relationships...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-slate-300">
            AI is analyzing card connections and relationships...
          </div>
        </CardContent>
      </UICard>
    )
  }

  if (relationships.length === 0) {
    return (
      <UICard className="border-slate-700 bg-slate-900/50">
        <CardContent className="pt-6">
          <div className="text-center text-slate-400">
            <Network className="w-8 h-8 mx-auto mb-2" />
            <p>No relationship data available</p>
            <p className="text-sm mt-1">Try refreshing or check your AI configuration</p>
          </div>
        </CardContent>
      </UICard>
    )
  }

  return (
    <UICard className="border-slate-700 bg-slate-900/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Network className="w-5 h-5 text-blue-400" />
          Card Relationship Map
        </CardTitle>
        {summary && (
          <p className="text-sm text-slate-300">{summary}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full border border-slate-600 rounded-lg overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
          >
            <Controls className="bg-slate-800 border-slate-600" />
            <Background color="#1e293b" gap={20} />
            <MiniMap
              nodeColor="#3b82f6"
              maskColor="rgba(15, 23, 42, 0.8)"
              className="bg-slate-800 border-slate-600"
            />
            <Panel position="top-right" className="bg-slate-800 border border-slate-600 rounded p-2">
              <div className="text-xs text-slate-300 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-green-500"></div>
                  <span>Strong</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-blue-500"></div>
                  <span>Moderate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-slate-500"></div>
                  <span>Weak</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-red-500 border-dashed border-t"></div>
                  <span>Conflicting</span>
                </div>
              </div>
            </Panel>
          </ReactFlow>
        </div>

        <div className="mt-4 text-xs text-slate-400">
          <p>💡 <strong>Tip:</strong> Drag cards to rearrange. Hover over connections for explanations.</p>
        </div>
      </CardContent>
    </UICard>
  )
}