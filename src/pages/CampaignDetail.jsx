import React, { useState, useEffect } from 'react'
import { getCampaign, getDeliverables, getActivityLogs } from '../services/supabase'

const STATUS_COLORS = {
  draft: '#6b7280', active: '#f59e0b', completed: '#10b981', cancelled: '#ef4444',
  review: '#3b82f6', approved: '#10b981', delivered: '#3b82f6',
}

const TYPE_ICONS = {
  deck: '▦', email_sequence: '✉', seo_audit: '◎', strategy_doc: '◆',
  blog_post: '▤', case_study: '▧', research: '◈', other: '○',
}

function timeAgo(ts) {
  const d = new Date(ts)
  const s = Math.floor((Date.now() - d) / 1000)
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s/60)}m ago`
  if (s < 86400) return `${Math.floor(s/3600)}h ago`
  return `${Math.floor(s/86400)}d ago`
}

export default function CampaignDetail({ campaignId, agents, onBack }) {
  const [campaign, setCampaign] = useState(null)
  const [deliverables, setDeliverables] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!campaignId) return
    Promise.all([
      getCampaign(campaignId),
      getDeliverables(campaignId),
      getActivityLogs(campaignId, 100),
    ]).then(([c, d, l]) => {
      setCampaign(c)
      setDeliverables(d)
      setLogs(l)
      setLoading(false)
    }).catch(e => { console.error(e); setLoading(false) })
  }, [campaignId])

  if (loading) return (
    <div style={{ padding: 64, textAlign: 'center', color: 'var(--text-muted)' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>Loading mission data...</div>
    </div>
  )

  if (!campaign) return (
    <div style={{ padding: 64, textAlign: 'center', color: 'var(--text-muted)' }}>Campaign not found</div>
  )

  const totalCost = logs.reduce((sum, l) => sum + (parseFloat(l.cost_usd) || 0), 0)

  return (
    <div style={{ padding: 32, maxWidth: 1100, margin: '0 auto' }}>
      {/* Back + Header */}
      <button onClick={onBack} style={{
        background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer',
        fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6,
      }}>← Back to Mission Control</button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, marginBottom: 6 }}>{campaign.name}</h1>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Client: {campaign.client}</div>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Mission Cost</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--accent-tars)' }}>${totalCost.toFixed(2)}</div>
          </div>
          <span style={{
            padding: '4px 14px', borderRadius: 20, fontSize: 11, fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: 0.5,
            background: `${STATUS_COLORS[campaign.status]}20`, color: STATUS_COLORS[campaign.status],
            border: `1px solid ${STATUS_COLORS[campaign.status]}40`,
          }}>{campaign.status}</span>
        </div>
      </div>

      {/* Strategy */}
      {campaign.strategy && (
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12,
          padding: 20, marginBottom: 24,
        }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Strategy Brief</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{campaign.strategy}</div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Deliverables */}
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--accent-data)' }}>▦</span> Deliverables ({deliverables.length})
          </h2>
          {deliverables.length === 0 ? (
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12,
              padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13,
            }}>No deliverables yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {deliverables.map(d => (
                <div key={d.id} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10,
                  padding: '14px 18px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 16 }}>{TYPE_ICONS[d.type] || '○'}</span>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{d.name}</span>
                    </div>
                    <span style={{
                      padding: '2px 8px', borderRadius: 12, fontSize: 9, fontWeight: 600,
                      textTransform: 'uppercase',
                      background: `${STATUS_COLORS[d.status]}20`, color: STATUS_COLORS[d.status],
                    }}>{d.status}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {d.type.replace('_', ' ')} · {timeAgo(d.created_at)}
                  </div>
                  {d.url && (
                    <a href={d.url} target="_blank" rel="noopener noreferrer" style={{
                      fontSize: 11, color: 'var(--accent-case)', marginTop: 6, display: 'inline-block',
                      textDecoration: 'none',
                    }}>Download →</a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Timeline */}
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--accent-kipp)' }}>◉</span> Activity Timeline ({logs.length})
          </h2>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12,
            padding: 16, maxHeight: 500, overflowY: 'auto',
          }}>
            {logs.map((log, i) => {
              const agent = agents[log.agent] || { color: '#6b7280' }
              return (
                <div key={log.id} style={{
                  padding: '10px 0', borderBottom: i < logs.length - 1 ? '1px solid var(--border)' : 'none',
                  position: 'relative',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: agent.color, boxShadow: `0 0 4px ${agent.color}60` }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, color: agent.color }}>{log.agent}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{log.action}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {timeAgo(log.created_at)}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', paddingLeft: 14, lineHeight: 1.4 }}>{log.message}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
