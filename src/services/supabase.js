import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// --- Campaigns ---
export async function getCampaigns() {
  const { data, error } = await supabase
    .from('tars_campaigns')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getCampaign(id) {
  const { data, error } = await supabase
    .from('tars_campaigns')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

// --- Deliverables ---
export async function getDeliverables(campaignId) {
  let query = supabase
    .from('tars_deliverables')
    .select('*')
    .order('created_at', { ascending: false })
  if (campaignId) query = query.eq('campaign_id', campaignId)
  const { data, error } = await query
  if (error) throw error
  return data
}

// --- Activity Logs ---
export async function getActivityLogs(campaignId, limit = 50) {
  let query = supabase
    .from('tars_activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (campaignId) query = query.eq('campaign_id', campaignId)
  const { data, error } = await query
  if (error) throw error
  return data
}

// --- Realtime subscriptions ---
export function subscribeToCampaigns(callback) {
  return supabase
    .channel('tars-campaigns')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tars_campaigns' }, callback)
    .subscribe()
}

export function subscribeToLogs(callback) {
  return supabase
    .channel('tars-logs')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tars_activity_logs' }, callback)
    .subscribe()
}

export function subscribeToDeliverables(callback) {
  return supabase
    .channel('tars-deliverables')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tars_deliverables' }, callback)
    .subscribe()
}
