import React from 'react'

function timeAgo(ts) {
  const d = new Date(ts)
  const s = Math.floor((Date.now() - d) / 1000)
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s/60)}m ago`
  if (s < 86400) return `${Math.floor(s/3600)}h ago`
  return `${Math.floor(s/86400)}d ago`
}

export default function ActivityFeed({ logs, agents }) {
  return (
    <div style={{ padding: 32, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{
        fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700,
        letterSpacing: 1, marginBottom: 4,
      }}>Activity Feed</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 24 }}>
        Real-time transmissions from all agents
      </p>

      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12,
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '80px 140px 1fr 80px 70px',
          padding: '10px 20px', borderBottom: '1px solid var(--border)',
          fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1,
          fontWeight: 600,
        }}>
          <span>Agent</span><span>Action</span><span>Message</span><span>Cost</span><span>Time</span>
        </div>

        {logs.length === 0 ? (
          <div style={{ padding: 64, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 32, marginBottom: 12, opacity: 0.2 }}>◇</div>
            No transmissions received. Agents are standing by.
          </div>
        ) : (
          logs.map((log, i) => {
            const agent = agents[log.agent] || { color: '#6b7280' }
            return (
              <div key={log.id || i} style={{
                display: 'grid', gridTemplateColumns: '80px 140px 1fr 80px 70px',
                padding: '12px 20px', borderBottom: '1px solid var(--border)',
                fontSize: 12, alignItems: 'start',
                animation: i === 0 ? 'fadeIn 0.3s ease' : 'none',
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: agent.color, fontSize: 11 }}>{log.agent}</span>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{log.action}</span>
                <span style={{ color: 'var(--text-muted)', lineHeight: 1.4, paddingRight: 12 }}>{log.message}</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: log.cost_usd > 0 ? 'var(--accent-tars)' : 'var(--text-muted)', fontSize: 11 }}>
                  {log.cost_usd > 0 ? `$${parseFloat(log.cost_usd).toFixed(4)}` : '—'}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: 10 }}>
                  {timeAgo(log.created_at)}
                </span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
