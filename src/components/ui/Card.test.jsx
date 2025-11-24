import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Card from './Card'

describe('Card Component', () => {
    describe('Rendering', () => {
        it('should render children content', () => {
            render(
                <Card>
                    <h3>Card Title</h3>
                    <p>Card content</p>
                </Card>
            )
            expect(screen.getByText('Card Title')).toBeInTheDocument()
            expect(screen.getByText('Card content')).toBeInTheDocument()
        })

        it('should apply elevated variant by default', () => {
            const { container } = render(<Card>Content</Card>)
            const card = container.firstChild
            expect(card).toHaveClass('shadow-md')
        })

        it('should apply correct variant styles', () => {
            const { container, rerender } = render(<Card variant="flat">Flat</Card>)
            let card = container.firstChild
            expect(card).toHaveClass('bg-white')

            rerender(<Card variant="glassmorphic">Glass</Card>)
            card = container.firstChild
            expect(card).toHaveClass('backdrop-blur-lg')
        })

        it('should apply correct padding', () => {
            const { container, rerender } = render(<Card padding="sm">Small</Card>)
            let card = container.firstChild
            expect(card).toHaveClass('p-3')

            rerender(<Card padding="lg">Large</Card>)
            card = container.firstChild
            expect(card).toHaveClass('p-6')
        })
    })

    describe('Hover Effects', () => {
        it('should apply hover styles when hover is true', () => {
            const { container } = render(<Card hover>Hoverable</Card>)
            const card = container.firstChild
            expect(card).toHaveClass('hover:shadow-xl')
        })

        it('should not apply hover styles when hover is false', () => {
            const { container } = render(<Card hover={false}>Not Hoverable</Card>)
            const card = container.firstChild
            expect(card).not.toHaveClass('hover:shadow-xl')
        })
    })

    describe('Click Handler', () => {
        it('should call onClick when clicked', async () => {
            const handleClick = vi.fn()
            const user = userEvent.setup()

            render(<Card onClick={handleClick}>Clickable Card</Card>)
            await user.click(screen.getByText('Clickable Card'))

            expect(handleClick).toHaveBeenCalledTimes(1)
        })

        it('should apply cursor-pointer when onClick is provided', () => {
            const { container } = render(<Card onClick={() => { }}>Clickable</Card>)
            const card = container.firstChild
            expect(card).toHaveClass('cursor-pointer')
        })
    })

    describe('Custom Styling', () => {
        it('should accept custom className', () => {
            const { container } = render(<Card className="custom-class">Custom</Card>)
            const card = container.firstChild
            expect(card).toHaveClass('custom-class')
        })

        it('should merge custom className with default classes', () => {
            const { container } = render(<Card className="custom-class">Custom</Card>)
            const card = container.firstChild
            expect(card).toHaveClass('custom-class')
            expect(card).toHaveClass('rounded-2xl')
        })
    })
})
