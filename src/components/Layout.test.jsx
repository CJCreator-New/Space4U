import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Layout from './Layout'

// Mock Navigation component
vi.mock('./Navigation', () => ({
  default: () => <nav data-testid="navigation">Navigation</nav>
}))

describe('Layout', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  const renderLayout = (children = <div>Test Content</div>) => {
    return render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={children} />
          </Route>
        </Routes>
      </MemoryRouter>
    )
  }

  describe('Rendering', () => {
    it('should render without crashing', () => {
      renderLayout()
      expect(screen.getByTestId('navigation')).toBeInTheDocument()
    })

    it('should render Navigation component', () => {
      renderLayout()
      expect(screen.getByTestId('navigation')).toBeInTheDocument()
    })

    it('should render children content', () => {
      renderLayout(<div>Child Content</div>)
      expect(screen.getByText('Child Content')).toBeInTheDocument()
    })
  })

  describe('Structure', () => {
    it('should have main content area', () => {
      const { container } = renderLayout()
      const main = container.querySelector('main')
      expect(main).toBeInTheDocument()
    })

    it('should apply responsive classes', () => {
      const { container } = renderLayout()
      const main = container.querySelector('main')
      expect(main?.className).toContain('md:ml-64')
    })
  })

  describe('Accessibility', () => {
    it('should have semantic HTML structure', () => {
      const { container } = renderLayout()
      expect(container.querySelector('main')).toBeInTheDocument()
      expect(container.querySelector('nav')).toBeInTheDocument()
    })
  })

  describe('Mental Health Context', () => {
    it('should provide consistent layout for all pages', () => {
      renderLayout()
      expect(screen.getByTestId('navigation')).toBeInTheDocument()
    })
  })
})
