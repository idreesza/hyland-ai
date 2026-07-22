'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Platform {
  id: string
  name: string
  company: string
  best_for: string
  api_available: boolean
  self_hostable: boolean
  free_tier: string
  pricing_api: string
  hosting_options: string[]
  context_window: string
  multimodal: boolean
  open_weights: boolean
  license: string
  hyland_score: number
  description: string
  quick_start: string
  affiliate_link: string
}

export default function Home() {
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [filter, setFilter] = useState('all')
const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('platforms').select('*').order('hyland_score', { ascending: false })
      .then(({ data }) => { setPlatforms(data || []); setLoading(false) })
  }, [])

  const filtered = platforms.filter(p => {
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'free' ? p.free_tier :
      filter === 'self-hosted' ? p.self_hostable :
      filter === 'open' ? p.open_weights :
      true
    
    const matchesSearch = 
      search === '' ? true :
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.company.toLowerCase().includes(search.toLowerCase()) ||
      p.best_for.toLowerCase().includes(search.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-cyan-400 text-xl">Loading Hyland...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <div className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Hyland.ai
          </h1>
          <p className="text-slate-400 text-xl max-w-2xl">
            The complete directory of AI platforms. What's free, what's self-hostable, 
            where to run it — all in one place.
          </p>
        </div>
      </div>

{/* Search Bar */}
<div className="mb-4">
  <input
    type="text"
    placeholder="Search platforms, companies, use cases..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
  />
</div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Platforms' },
            { key: 'free', label: 'Free Tier' },
            { key: 'self-hosted', label: 'Self-Hostable' },
            { key: 'open', label: 'Open Weights' }
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === f.key
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        
        <p className="text-slate-500 text-sm mt-2">
          Showing {filtered.length} of {platforms.length} platforms
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <div 
              key={p.id} 
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-cyan-500/50 transition group"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-xl font-semibold text-white group-hover:text-cyan-400 transition">
                    {p.name}
                  </h2>
                  <p className="text-slate-500 text-sm">{p.company}</p>
                </div>
                <span className="bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded text-xs font-mono font-bold">
                  {p.hyland_score}
                </span>
              </div>

              {/* Description */}
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                {p.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {p.self_hostable && (
                  <span className="bg-green-500/10 text-green-400 px-2 py-1 rounded text-xs font-medium">
                    Self-Hostable
                  </span>
                )}
                {p.api_available && (
                  <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs font-medium">
                    API
                  </span>
                )}
                {p.open_weights && (
                  <span className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded text-xs font-medium">
                    Open Weights
                  </span>
                )}
                {p.free_tier && (
                  <span className="bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded text-xs font-medium">
                    Free Tier
                  </span>
                )}
                {p.multimodal && (
                  <span className="bg-pink-500/10 text-pink-400 px-2 py-1 rounded text-xs font-medium">
                    Multimodal
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Best for:</span>
                  <span className="text-slate-300 text-right">{p.best_for}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  <span className="text-slate-500">Context:</span>
                  <span className="text-slate-300">{p.context_window}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  <span className="text-slate-500">API Pricing:</span>
                  <span className="text-slate-300">{p.pricing_api}</span>
                </div>
              </div>

              {/* Hosting Options */}
              {p.hosting_options && p.hosting_options.length > 0 && (
                <div className="mb-4">
                  <p className="text-slate-500 text-xs mb-2 uppercase tracking-wider">Where to Host</p>
                  <div className="flex flex-wrap gap-1">
                    {p.hosting_options.map((host, i) => (
                      <span key={i} className="bg-slate-800 text-slate-400 px-2 py-1 rounded text-xs">
                        {host}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Start */}
              {p.quick_start && (
                <div className="bg-slate-950 rounded-lg p-3 mb-4">
                  <p className="text-slate-500 text-xs mb-1 uppercase tracking-wider">Quick Start</p>
                  <code className="text-green-400 text-xs font-mono break-all">
                    {p.quick_start}
                  </code>
                </div>
              )}

              {/* CTA */}
              {p.affiliate_link && (
                <a
                  href={p.affiliate_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-cyan-600 hover:bg-cyan-500 text-white py-2.5 rounded-lg text-sm font-semibold transition"
                >
                  Try {p.name} →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}