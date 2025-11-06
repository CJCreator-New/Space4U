import { StorageAdapter } from './StorageAdapter'
import { supabase } from '../../lib/supabase'

/**
 * Supabase Adapter
 * Backend storage using Supabase with user-scoped data
 */
export class SupabaseAdapter extends StorageAdapter {
  constructor() {
    super()
    this.client = supabase
    this.tableName = 'user_data'
  }

  async getUser() {
    if (!this.client) return null
    const { data: { user } } = await this.client.auth.getUser()
    return user
  }

  async get(key) {
    if (!this.client) throw new Error('Supabase not configured')
    
    const user = await this.getUser()
    if (!user) return null

    const { data, error } = await this.client
      .from(this.tableName)
      .select('value')
      .eq('user_id', user.id)
      .eq('key', key)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }

    return data?.value || null
  }

  async set(key, value) {
    if (!this.client) throw new Error('Supabase not configured')
    
    const user = await this.getUser()
    if (!user) throw new Error('User not authenticated')

    const { error } = await this.client
      .from(this.tableName)
      .upsert({
        user_id: user.id,
        key,
        value,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,key'
      })

    if (error) throw error
  }

  async remove(key) {
    if (!this.client) throw new Error('Supabase not configured')
    
    const user = await this.getUser()
    if (!user) return

    const { error } = await this.client
      .from(this.tableName)
      .delete()
      .eq('user_id', user.id)
      .eq('key', key)

    if (error) throw error
  }

  async getKeys(prefix = '') {
    if (!this.client) throw new Error('Supabase not configured')
    
    const user = await this.getUser()
    if (!user) return []

    const query = this.client
      .from(this.tableName)
      .select('key')
      .eq('user_id', user.id)

    if (prefix) {
      query.like('key', `${prefix}%`)
    }

    const { data, error } = await query

    if (error) throw error

    return data?.map(row => row.key) || []
  }

  async clear() {
    if (!this.client) throw new Error('Supabase not configured')
    
    const user = await this.getUser()
    if (!user) return

    const { error } = await this.client
      .from(this.tableName)
      .delete()
      .eq('user_id', user.id)
      .like('key', 'space4u_%')

    if (error) throw error
  }

  async healthCheck() {
    if (!this.client) return false
    
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('count')
        .limit(1)
      
      return !error
    } catch {
      return false
    }
  }
}
