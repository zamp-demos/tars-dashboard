import React from 'react'

const STATUS_COLORS = {
  draft: '#6b7280', active: '#f59e0b', completed: '#10b981', cancelled: '#ef4444',
}

const TYPE_LABELS = {
  deck: 'Pitch Deck', email_sequence: 'Email Sequence', seo_audit: 'SEO Audit',
  strategy_doc: 'Strategy', blog_post: 'Blog', case_study: 'Case Study',
  research: 'Research', other: 'Other',
}

function timeAgo(ts) {
  const d = new Date(ts)
  const s = Math.floor((Date.now() - d) / 1000)
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s/60)}m ago`
  if (s < 86400) return `${Math.floor(s/3600)}h ago`
  return `${Math.floor(s/86400)}d ago`
}

export default function Dashboard({ campaigns, agents, activityLogs, onViewCampaign, totalCost }) {
  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700,
          letterSpacing: 1, marginBottom: 4,
        }}>Mission Control</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          TARS AI Autonomous Marketing Agency — All systems operational
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Total Campaigns', value: campaigns.length, color: 'var(--text-primary)' },
          { label: 'Active Missions', value: campaigns.filter(c=>c.status==='active').length, color: '#f59e0b' },
          { label: 'Completed', value: campaigns.filter(c=>c.status==='completed').length, color: '#10b981' },
          { label: 'Total Spend', value: `$${totalCost.toFixed(2)}`, color: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12,
            padding: '20px 24px',
          }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
        {/* Campaigns */}
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--accent-tars)' }}>◈</span> Campaigns
          </h2>
          {campaigns.length === 0 ? (
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12,
              padding: 48, textAlign: 'center', color: 'var(--text-muted)',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 36, marginBottom: 12 }}>◇</div>
              <div style={{ fontSize: 14 }}>No active missions. Say "Hello TARS" to begin.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {campaigns.map(c => (
                <div key={c.id} onClick={() => onViewCampaign(c.id)} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12,
                  padding: '18px 22px', cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; e.currentTarget.style.borderColor = 'var(--border-bright)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.borderColor = 'var(--border)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 3 }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Client: {c.client}</div>
                    </div>
                    <span style={{
                      padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 600,
                      textTransform: 'uppercase', letterSpacing: 0.5,
                      background: `${STATUS_COLORS[c.status]}20`, color: STATUS_COLORS[c.status],
                      border: `1px solid ${STATUS_COLORS[c.status]}40`,
                    }}>{c.status}</span>
                  </div>
                  {c.strategy && (
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 8 }}>
                      {c.strategy.length > 120 ? c.strategy.slice(0, 120) + '...' : c.strategy}
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {timeAgo(c.created_at)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Activity */}
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--accent-kipp)' }}>◉</span> Live Activity
          </h2>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12,
            padding: 16, maxHeight: 600, overflowY: 'auto',
          }}>
            {activityLogs.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32, fontSize: 13 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, marginBottom: 8, opacity: 0.3 }}>⊘</div>
                Awaiting transmissions...
              </div>
            ) : (
              activityLogs.slice(0, 30).map((log, i) => {
                const agent = agents[log.agent] || { color: '#6b7280' }
                return (
                  <div key={log.id || i} style={{
                    padding: '10px 0', borderBottom: i < 29 ? '1px solid var(--border)' : 'none',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
                        color: agent.color, minWidth: 48,
                      }}>{log.agent}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>{log.action}</span>
                      <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {timeAgo(log.created_at)}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', paddingLeft: 56, lineHeight: 1.4 }}>
                      {log.message}
                    </div>
                    {log.cost_usd > 0 && (
                      <div style={{ fontSize: 10, color: 'var(--accent-tars)', fontFamily: 'var(--font-mono)', paddingLeft: 56, marginTop: 2 }}>
                        ${parseFloat(log.cost_usd).toFixed(4)}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
