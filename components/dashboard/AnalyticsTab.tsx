'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { BarChart2, TrendingUp, MousePointerClick, Trophy } from 'lucide-react'

interface LinkStat {
  id: string
  title: string
  clicks: number
}

interface DailyClick {
  date: string
  clicks: number
}

type Range = '7' | '30' | '90'

interface Props {
  userId: string
}

export default function AnalyticsTab({ userId }: Props) {
  const [range, setRange] = useState<Range>('30')
  const [linkStats, setLinkStats] = useState<LinkStat[]>([])
  const [dailyClicks, setDailyClicks] = useState<DailyClick[]>([])
  const [totalClicks, setTotalClicks] = useState(0)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      // Fetch link totals
      const { data: links } = await supabase
        .from('links')
        .select('id, title, clicks')
        .eq('user_id', userId)
        .order('clicks', { ascending: false })

      if (links) {
        setLinkStats(links)
        setTotalClicks(links.reduce((sum, l) => sum + l.clicks, 0))
      }

      // Fetch daily click events for selected range
      const since = new Date()
      since.setDate(since.getDate() - parseInt(range))

      const { data: events } = await supabase
        .from('link_click_events')
        .select('clicked_at')
        .eq('user_id', userId)
        .gte('clicked_at', since.toISOString())

      if (events) {
        // Group by date
        const counts: Record<string, number> = {}

        // Pre-fill all dates in range with 0
        for (let i = parseInt(range) - 1; i >= 0; i--) {
          const d = new Date()
          d.setDate(d.getDate() - i)
          const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          counts[key] = 0
        }

        // Count events per day
        events.forEach(e => {
          const key = new Date(e.clicked_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          if (key in counts) counts[key]++
        })

        setDailyClicks(Object.entries(counts).map(([date, clicks]) => ({ date, clicks })))
      }

      setLoading(false)
    }

    fetchData()
  }, [userId, range])

  const topLink = linkStats[0]
  const rangeClicks = dailyClicks.reduce((sum, d) => sum + d.clicks, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-white/30 text-sm">Loading analytics…</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-lg font-bold text-white">Analytics</h2>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl border border-white/10 bg-white/5">
          <div className="flex items-center gap-2 mb-2">
            <MousePointerClick size={16} className="text-purple-400" />
            <span className="text-white/50 text-xs uppercase tracking-wider">Total clicks</span>
          </div>
          <p className="font-display text-3xl font-bold text-white">{totalClicks.toLocaleString()}</p>
        </div>

        <div className="p-4 rounded-2xl border border-white/10 bg-white/5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-purple-400" />
            <span className="text-white/50 text-xs uppercase tracking-wider">Last {range} days</span>
          </div>
          <p className="font-display text-3xl font-bold text-white">{rangeClicks.toLocaleString()}</p>
        </div>

        <div className="p-4 rounded-2xl border border-white/10 bg-white/5">
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 size={16} className="text-purple-400" />
            <span className="text-white/50 text-xs uppercase tracking-wider">Total links</span>
          </div>
          <p className="font-display text-3xl font-bold text-white">{linkStats.length}</p>
        </div>

        <div className="p-4 rounded-2xl border border-white/10 bg-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={16} className="text-purple-400" />
            <span className="text-white/50 text-xs uppercase tracking-wider">Top link</span>
          </div>
          <p className="font-display text-sm font-bold text-white truncate">
            {topLink ? topLink.title : '—'}
          </p>
          {topLink && (
            <p className="text-white/40 text-xs mt-1">{topLink.clicks.toLocaleString()} clicks</p>
          )}
        </div>
      </div>

      {/* Range selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-white/50 text-xs uppercase tracking-wider">Clicks over time</h3>
        <div className="flex rounded-xl bg-white/5 p-1">
          {(['7', '30', '90'] as Range[]).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                range === r ? 'bg-purple-600 text-white' : 'text-white/40 hover:text-white'
              }`}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      {/* Line chart */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        {rangeClicks === 0 ? (
          <div className="flex items-center justify-center h-40 text-white/20 text-sm">
            No clicks in this period yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={dailyClicks}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="date"
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval={range === '7' ? 0 : range === '30' ? 4 : 13}
              />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0e0e1a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '12px',
                }}
                cursor={{ stroke: 'rgba(167,139,250,0.3)' }}
              />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#a78bfa"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#a78bfa' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bar chart — clicks per link */}
      {linkStats.length > 0 && (
        <>
          <h3 className="text-white/50 text-xs uppercase tracking-wider">Clicks per link</h3>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            {totalClicks === 0 ? (
              <div className="flex items-center justify-center h-40 text-white/20 text-sm">
                No clicks yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={Math.max(linkStats.length * 40, 120)}>
                <BarChart
                  data={linkStats}
                  layout="vertical"
                  margin={{ left: 0, right: 16 }}
                >
                  <XAxis
                    type="number"
                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="title"
                    tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    width={120}
                    tickFormatter={v => v.length > 16 ? v.slice(0, 16) + '…' : v}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0e0e1a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '12px',
                    }}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Bar
                    dataKey="clicks"
                    fill="#7c3aed"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </>
      )}
    </div>
  )
}
