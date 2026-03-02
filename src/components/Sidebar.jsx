import React from 'react'

const NAV = [
  { id: 'dashboard', label: 'Mission Control', icon: '◈' },
  { id: 'activity', label: 'Activity Feed', icon: '◉' },
]

export default function Sidebar({ page, setPage, campaigns, agents, totalCost }) {
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length
  const completedCampaigns = campaigns.filter(c => c.status === 'completed').length

  return (
    <aside style={{
      width: 260, background: 'var(--bg-primary)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14, color: '#000',
          }}>T</div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 16, letterSpacing: 2 }}>TARS AI</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 1, textTransform: 'uppercase' }}>Mission Control</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12 }}>
        <div style={{ flex: 1, background: 'var(--bg-card)', borderRadius: 8, padding: '10px 12px' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent-tars)' }}>{activeCampaigns}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Active</div>
        </div>
        <div style={{ flex: 1, background: 'var(--bg-card)', borderRadius: 8, padding: '10px 12px' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent-kipp)' }}>{completedCampaigns}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Done</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 12px 8px' }}>
        {NAV.map(n => (
          <button key={n.id} onClick={() => setPage(n.id)} style={{
            display: 'flex', alignItems: 'center', gap: 10, width: '100%',
            padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: page === n.id ? 'var(--bg-elevated)' : 'transparent',
            color: page === n.id ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontSize: 13, fontWeight: 500, textAlign: 'left',
            transition: 'all 0.15s',
          }}>
            <span style={{ fontSize: 16 }}>{n.icon}</span>
            {n.label}
          </button>
        ))}
      </nav>

      {/* Agent Roster */}
      <div style={{ padding: '8px 12px', flex: 1, overflowY: 'auto' }}>
        <div style={{
          fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase',
          letterSpacing: 1.5, padding: '8px 12px 6px', fontWeight: 600,
        }}>Agent Roster</div>
        {Object.entries(agents).map(([name, a]) => (
          <div key={name} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '7px 12px',
            borderRadius: 6, fontSize: 12,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%', background: a.color,
              boxShadow: `0 0 6px ${a.color}60`,
            }} />
            <div style={{ flex: 1 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: a.color, fontSize: 11 }}>{name}</span>
              <span style={{ color: 'var(--text-muted)', marginLeft: 6, fontSize: 10 }}>{a.role}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Cost footer */}
      <div style={{
        padding: '14px 20px', borderTop: '1px solid var(--border)',
        background: 'var(--bg-card)',
      }}>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Total Spend</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: 'var(--accent-tars)' }}>
          ${totalCost.toFixed(2)}
        </div>
      </div>
    </aside>
  )
}
