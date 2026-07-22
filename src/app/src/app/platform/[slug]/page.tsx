import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function PlatformPage({ params }: PageProps) {
  const { slug } = await params
  
  const { data: platform } = await supabase
    .from('platforms')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!platform) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <Link href="/" className="text-slate-400 hover:text-cyan-400 text-sm transition">
          ← Back to all platforms
        </Link>
      </div>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-5xl font-bold mb-2">{platform.name}</h1>
            <p className="text-slate-400 text-xl">{platform.company}</p>
          </div>
          <span className="bg-cyan-500/10 text-cyan-400 px-4 py-2 rounded-lg text-2xl font-mono font-bold">
            {platform.hyland_score}
          </span>
        </div>

        <p className="text-slate-300 text-lg leading-relaxed mb-8">
          {platform.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {platform.self_hostable && (
            <span className="bg-green-500/10 text-green-400 px-3 py-1.5 rounded-lg text-sm font-medium">
              Self-Hostable
            </span>
          )}
          {platform.api_available && (
            <span className="bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg text-sm font-medium">
              API Available
            </span>
          )}
          {platform.open_weights && (
            <span className="bg-purple-500/10 text-purple-400 px-3 py-1.5 rounded-lg text-sm font-medium">
              Open Weights
            </span>
          )}
          {platform.free_tier && (
            <span className="bg-yellow-500/10 text-yellow-400 px-3 py-1.5 rounded-lg text-sm font-medium">
              Free Tier
            </span>
          )}
          {platform.multimodal && (
            <span className="bg-pink-500/10 text-pink-400 px-3 py-1.5 rounded-lg text-sm font-medium">
              Multimodal
            </span>
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 text-cyan-400">Platform Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Best For</span>
                  <span className="text-slate-300 text-right">{platform.best_for}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Context Window</span>
                  <span className="text-slate-300">{platform.context_window}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">License</span>
                  <span className="text-slate-300">{platform.license}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 text-cyan-400">Pricing</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">API Pricing</span>
                  <span className="text-slate-300">{platform.pricing_api}</span>
                </div>
                {platform.free_tier && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Free Tier</span>
                    <span className="text-green-400">{platform.free_tier}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 text-cyan-400">Where to Host</h2>
              <div className="flex flex-wrap gap-2">
                {platform.hosting_options?.map((host: string, i: number) => (
                  <span key={i} className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-sm">
                    {host}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 text-cyan-400">Quick Start</h2>
              <div className="bg-slate-950 rounded-lg p-4">
                <code className="text-green-400 text-sm font-mono break-all">
                  {platform.quick_start}
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        {platform.affiliate_link && (
          <a
            href={platform.affiliate_link}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-cyan-600 hover:bg-cyan-500 text-white py-4 rounded-xl text-lg font-semibold transition"
          >
            Try {platform.name} →
          </a>
        )}
      </div>
    </main>
  )
}