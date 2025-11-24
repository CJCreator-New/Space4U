import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from '../../../services/authService'
import { supabase } from '../../../lib/supabase'

// Mock supabase lib
vi.mock('../../../lib/supabase', () => ({
    supabase: {
        auth: {
            getSession: vi.fn(),
            signUp: vi.fn(),
            signInWithPassword: vi.fn(),
            signOut: vi.fn(),
            onAuthStateChange: vi.fn()
        }
    },
    isBackendEnabled: vi.fn()
}))

import { isBackendEnabled } from '../../../lib/supabase'

describe('authService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should return null session when backend is disabled', async () => {
        isBackendEnabled.mockReturnValue(false)
        const result = await authService.getSession()
        expect(result).toEqual({ data: { session: null }, error: null })
        expect(supabase.auth.getSession).not.toHaveBeenCalled()
    })

    it('should call supabase.auth.getSession when backend is enabled', async () => {
        isBackendEnabled.mockReturnValue(true)
        await authService.getSession()
        expect(supabase.auth.getSession).toHaveBeenCalled()
    })

    it('should throw error on signIn when backend is disabled', async () => {
        isBackendEnabled.mockReturnValue(false)
        await expect(authService.signIn('test@example.com', 'password'))
            .rejects.toThrow('Backend not configured')
    })

    it('should call supabase.auth.signInWithPassword when backend is enabled', async () => {
        isBackendEnabled.mockReturnValue(true)
        await authService.signIn('test@example.com', 'password')
        expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'password'
        })
    })
})
