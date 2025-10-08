import { expect, afterEach, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.clearAllMocks()
})

// Mock localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString()
    }),
    removeItem: vi.fn((key) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    })
  }
})()

global.localStorage = localStorageMock

// Mock Recharts
vi.mock('recharts', () => ({
  ResponsiveContainer: vi.fn(({ children }) => children),
  LineChart: vi.fn(({ children }) => children),
  BarChart: vi.fn(({ children }) => children),
  PieChart: vi.fn(({ children }) => children),
  AreaChart: vi.fn(({ children }) => children),
  Line: vi.fn(() => null),
  Bar: vi.fn(() => null),
  Pie: vi.fn(() => null),
  Area: vi.fn(() => null),
  XAxis: vi.fn(() => null),
  YAxis: vi.fn(() => null),
  Tooltip: vi.fn(() => null),
  Legend: vi.fn(() => null),
  CartesianGrid: vi.fn(() => null),
  Cell: vi.fn(() => null)
}))

// Mock Date
beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2025-01-07T12:00:00'))
})

afterEach(() => {
  vi.useRealTimers()
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
}
