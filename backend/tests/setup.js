// Test setup file
global.console = {
    ...console,
    error: jest.fn(), // Suppress error logs in tests
    warn: jest.fn(),
}

// Set test environment variables
process.env.NODE_ENV = 'test'
process.env.SUPABASE_URL = 'https://test.supabase.co'
process.env.SUPABASE_SERVICE_KEY = 'test-key'

// Mock timers if needed
jest.useFakeTimers()

// Global test utilities
global.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
