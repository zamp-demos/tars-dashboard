import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import CampaignDetail from './pages/CampaignDetail'
import ActivityFeed from './pages/ActivityFeed'
import { getCampaigns, subscribeToCampaigns, subscribeToLogs, subscribeToDeliverables } from './services/supabase'

const AGENTS = {
  'TARS': { color: '#f59e0b', role: 'Mission Commander', origin: 'Interstellar' },
  'CASE': { color: '#3b82f6', role: 'Strategy Officer', origin: 'Interstellar' },
  'KIPP': { color: '#10b981', role: 'SEO Specialist', origin: 'Interstellar' },
  'SPOCK': { color: '#8b5cf6', role: 'Email Campaigns', origin: 'Star Trek' },
  'DATA': { color: '#ec4899', role: 'Deck Engineer', origin: 'Star Trek' },
  'SCOTTY': { color: '#ef4444', role: 'Research Engineer', origin: 'Star Trek' },
  'UHURA': { color: '#06b6d4', role: 'Communications', origin: 'Star Trek' },
  'GEORDI': { color: '#f97316', role: 'Visual Engineer', origin: 'Star Trek' },
  'BONES': { color: '#84cc16', role: 'Case Analyst', origin: 'Star Trek' },
  'SULU': { color: '#14b8a6', role: 'Outreach Navigator', origin: 'Star Trek' },
  'SEVEN': { color: '#a78bfa', role: 'Data Analytics', origin: 'Star Trek' },
}

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [campaigns, setCampaigns] = useState([])
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [activityLogs, setActivityLogs] = useState([])
  const [totalCost, setTotalCost] = useState(0)

  useEffect(() => {
    loadCampaigns()
    const c1 = subscribeToCampaigns(() => loadCampaigns())
    const c2 = subscribeToLogs((payload) => {
      setActivityLogs(prev => [payload.new, ...prev].slice(0, 200))
      setTotalCost(prev => prev + (parseFloat(payload.new.cost_usd) || 0))
    })
    const c3 = subscribeToDeliverables(() => loadCampaigns())
    return () => { c1.unsubscribe(); c2.unsubscribe(); c3.unsubscribe() }
  }, [])

  async function loadCampaigns() {
    try {
      const data = await getCampaigns()
      setCampaigns(data)
    } catch (e) { console.error('Failed to load campaigns:', e) }
  }

  function viewCampaign(id) {
    setSelectedCampaign(id)
    setPage('campaign')
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar
        page={page}
        setPage={setPage}
        campaigns={campaigns}
        agents={AGENTS}
        totalCost={totalCost}
      />
      <main style={{ flex: 1, overflow: 'auto', background: 'var(--bg-void)' }}>
        {page === 'dashboard' && (
          <Dashboard
            campaigns={campaigns}
            agents={AGENTS}
            activityLogs={activityLogs}
            onViewCampaign={viewCampaign}
            totalCost={totalCost}
          />
        )}
        {page === 'campaign' && (
          <CampaignDetail
            campaignId={selectedCampaign}
            agents={AGENTS}
            onBack={() => setPage('dashboard')}
          />
        )}
        {page === 'activity' && (
          <ActivityFeed
            logs={activityLogs}
            agents={AGENTS}
          />
        )}
      </main>
    </div>
  )
}
