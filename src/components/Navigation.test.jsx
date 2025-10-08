import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navigation from './Navigation'

describe('Navigation', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  const renderNavigation = (initialRoute = '/') => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Navigation />
      </MemoryRouter>
    )
  }

  describe('Rendering', () => {
    it('should render without crashing', () => {
      renderNavigation()
      expect(screen.getAllByText('Home')).toHaveLength(2)
    })

    it('should render all navigation items', () => {
      renderNavigation()
      expect(screen.getAllByText('Home')).toHaveLength(2) // Mobile + Desktop
      expect(screen.getAllByText('Circles')).toHaveLength(2)
      expect(screen.getAllByText('Insights')).toHaveLength(2)
      expect(screen.getAllByText('Gratitude')).toHaveLength(2)
      expect(screen.getAllByText('Tools')).toHaveLength(2)
      expect(screen.getAllByText('Analytics')).toHaveLength(2)
      expect(screen.getAllByText('Professional')).toHaveLength(2)
      expect(screen.getAllByText('Profile')).toHaveLength(2)
    })

    it('should render Safespace branding', () => {
      renderNavigation()
      expect(screen.getByText('Safespace')).toBeInTheDocument()
    })
  })

  describe('Navigation Links', () => {
    it('should have correct href attributes', () => {
      renderNavigation()
      const homeLinks = screen.getAllByText('Home')
      homeLinks.forEach(link => {
        expect(link.closest('a')).toHaveAttribute('href', '/')
      })
    })

    it('should render all 8 navigation items', () => {
      renderNavigation()
      const links = screen.getAllByRole('link')
      expect(links.length).toBeGreaterThanOrEqual(16) // 8 items × 2 (mobile + desktop)
    })
  })

  describe('Accessibility', () => {
    it('should have proper link roles', () => {
      renderNavigation()
      const links = screen.getAllByRole('link')
      expect(links.length).toBeGreaterThan(0)
    })

    it('should have accessible text labels', () => {
      renderNavigation()
      expect(screen.getAllByText('Home')).toHaveLength(2)
      expect(screen.getAllByText('Profile')).toHaveLength(2)
    })
  })

  describe('Responsive Design', () => {
    it('should render mobile navigation', () => {
      const { container } = renderNavigation()
      const mobileNav = container.querySelector('.md\\:hidden')
      expect(mobileNav).toBeInTheDocument()
    })

    it('should render desktop navigation', () => {
      const { container } = renderNavigation()
      const desktopNav = container.querySelector('.hidden.md\\:block')
      expect(desktopNav).toBeInTheDocument()
    })
  })

  describe('Mental Health Context', () => {
    it('should provide easy access to all features', () => {
      renderNavigation()
      expect(screen.getAllByText('Home')).toHaveLength(2)
      expect(screen.getAllByText('Circles')).toHaveLength(2)
      expect(screen.getAllByText('Professional')).toHaveLength(2)
    })
  })
})
