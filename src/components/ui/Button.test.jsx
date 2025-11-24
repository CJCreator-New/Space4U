import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button'

describe('Button Component', () => {
    describe('Rendering', () => {
        it('should render with children text', () => {
            render(<Button>Click Me</Button>)
            expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
        })

        it('should apply primary variant styles by default', () => {
            render(<Button>Primary</Button>)
            const button = screen.getByRole('button')
            expect(button).toHaveClass('bg-gradient-to-r')
        })

        it('should apply correct variant styles', () => {
            const { rerender } = render(<Button variant="secondary">Secondary</Button>)
            let button = screen.getByRole('button')
            expect(button).toHaveClass('bg-gray-200')

            rerender(<Button variant="danger">Danger</Button>)
            button = screen.getByRole('button')
            expect(button).toHaveClass('bg-red-600')
        })

        it('should apply correct size styles', () => {
            const { rerender } = render(<Button size="sm">Small</Button>)
            let button = screen.getByRole('button')
            expect(button).toHaveClass('px-3')

            rerender(<Button size="lg">Large</Button>)
            button = screen.getByRole('button')
            expect(button).toHaveClass('px-6')
        })

        it('should render with left icon', () => {
            const Icon = () => <span data-testid="left-icon">Icon</span>
            render(<Button leftIcon={<Icon />}>With Icon</Button>)
            expect(screen.getByTestId('left-icon')).toBeInTheDocument()
        })

        it('should render with right icon', () => {
            const Icon = () => <span data-testid="right-icon">Icon</span>
            render(<Button rightIcon={<Icon />}>With Icon</Button>)
            expect(screen.getByTestId('right-icon')).toBeInTheDocument()
        })
    })

    describe('Loading State', () => {
        it('should show loading spinner when isLoading is true', () => {
            render(<Button isLoading>Loading</Button>)
            expect(screen.getByText(/loading/i)).toBeInTheDocument()
            expect(screen.getByRole('button')).toBeDisabled()
        })

        it('should hide children when loading', () => {
            render(<Button isLoading>Click Me</Button>)
            expect(screen.queryByText('Click Me')).not.toBeInTheDocument()
        })
    })

    describe('Disabled State', () => {
        it('should be disabled when disabled prop is true', () => {
            render(<Button disabled>Disabled</Button>)
            expect(screen.getByRole('button')).toBeDisabled()
        })

        it('should not call onClick when disabled', async () => {
            const handleClick = vi.fn()
            const user = userEvent.setup()

            render(<Button disabled onClick={handleClick}>Disabled</Button>)
            await user.click(screen.getByRole('button'))

            expect(handleClick).not.toHaveBeenCalled()
        })
    })

    describe('Interactions', () => {
        it('should call onClick when clicked', async () => {
            const handleClick = vi.fn()
            const user = userEvent.setup()

            render(<Button onClick={handleClick}>Click Me</Button>)
            await user.click(screen.getByRole('button'))

            expect(handleClick).toHaveBeenCalledTimes(1)
        })

        it('should support keyboard interaction', async () => {
            const handleClick = vi.fn()
            const user = userEvent.setup()

            render(<Button onClick={handleClick}>Click Me</Button>)
            const button = screen.getByRole('button')
            button.focus()
            await user.keyboard('{Enter}')

            expect(handleClick).toHaveBeenCalled()
        })
    })

    describe('Accessibility', () => {
        it('should have correct button role', () => {
            render(<Button>Accessible</Button>)
            expect(screen.getByRole('button')).toBeInTheDocument()
        })

        it('should support custom type attribute', () => {
            render(<Button type="submit">Submit</Button>)
            expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
        })

        it('should be keyboard navigable', () => {
            render(<Button>Navigate</Button>)
            const button = screen.getByRole('button')
            button.focus()
            expect(button).toHaveFocus()
        })
    })

    describe('Full Width', () => {
        it('should apply full width class when fullWidth is true', () => {
            render(<Button fullWidth>Full Width</Button>)
            expect(screen.getByRole('button')).toHaveClass('w-full')
        })
    })
})
