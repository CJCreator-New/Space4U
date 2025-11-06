import { describe, it, expect, beforeEach } from 'vitest'
import { LocalStorageAdapter } from '../../services/storage/LocalStorageAdapter'

describe('LocalStorageAdapter', () => {
  let adapter

  beforeEach(() => {
    adapter = new LocalStorageAdapter()
    localStorage.clear()
  })

  it('should get and set data', async () => {
    await adapter.set('test_key', { value: 'test' })
    const result = await adapter.get('test_key')
    expect(result).toEqual({ value: 'test' })
  })

  it('should return null for non-existent key', async () => {
    const result = await adapter.get('non_existent')
    expect(result).toBeNull()
  })

  it('should remove data', async () => {
    await adapter.set('test_key', { value: 'test' })
    await adapter.remove('test_key')
    const result = await adapter.get('test_key')
    expect(result).toBeNull()
  })

  it('should get keys by prefix', async () => {
    await adapter.set('space4u_mood', { mood: 5 })
    await adapter.set('space4u_gratitude', { text: 'test' })
    await adapter.set('other_key', { data: 'test' })
    
    const keys = await adapter.getKeys('space4u_')
    expect(keys).toHaveLength(2)
    expect(keys).toContain('space4u_mood')
    expect(keys).toContain('space4u_gratitude')
  })

  it('should pass health check', async () => {
    const isHealthy = await adapter.healthCheck()
    expect(isHealthy).toBe(true)
  })
})
