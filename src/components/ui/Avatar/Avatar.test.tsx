import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Avatar } from './Avatar'

describe('Avatar', () => {
  it('renders with default props', () => {
    render(<Avatar />)
    const avatar = screen.getByRole('img')
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveAttribute('aria-label', 'User avatar')
  })

  it('renders with custom text and generates initials', () => {
    render(<Avatar text="John Doe" />)
    const avatar = screen.getByRole('img')
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveTextContent('JD')
  })

  it('renders with single word text', () => {
    render(<Avatar text="Alice" />)
    const avatar = screen.getByRole('img')
    expect(avatar).toHaveTextContent('A')
  })

  it('renders with image source', () => {
    render(<Avatar src="/test-avatar.jpg" alt="Test User" />)
    const avatars = screen.getAllByRole('img')
    // The container div has role="img" and the img element also has implicit role
    expect(avatars.length).toBeGreaterThan(0)

    // Find the actual img element
    const img = screen.getByAltText('Test User')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/test-avatar.jpg')
    expect(img).toHaveAttribute('alt', 'Test User')
  })

  it('applies primary variant by default', () => {
    render(<Avatar text="AB" />)
    const avatar = screen.getByRole('img')
    expect(avatar).toHaveClass('bg-primary', 'text-primary-foreground')
  })

  it('applies success variant correctly', () => {
    render(<Avatar text="AB" variant="success" />)
    const avatar = screen.getByRole('img')
    expect(avatar).toHaveClass('bg-success', 'text-success-foreground')
  })

  it('applies secondary variant correctly', () => {
    render(<Avatar text="AB" variant="secondary" />)
    const avatar = screen.getByRole('img')
    expect(avatar).toHaveClass('bg-secondary', 'text-secondary-foreground')
  })

  it('applies danger variant correctly', () => {
    render(<Avatar text="AB" variant="danger" />)
    const avatar = screen.getByRole('img')
    expect(avatar).toHaveClass('bg-danger', 'text-danger-foreground')
  })

  it('applies warning variant correctly', () => {
    render(<Avatar text="AB" variant="warning" />)
    const avatar = screen.getByRole('img')
    expect(avatar).toHaveClass('bg-warning', 'text-warning-foreground')
  })

  it('applies small size correctly', () => {
    render(<Avatar text="AB" size="sm" />)
    const avatar = screen.getByRole('img')
    expect(avatar).toHaveClass('size-8', 'text-xs')
  })

  it('applies medium size by default', () => {
    render(<Avatar text="AB" />)
    const avatar = screen.getByRole('img')
    expect(avatar).toHaveClass('size-12', 'text-sm')
  })

  it('applies large size correctly', () => {
    render(<Avatar text="AB" size="lg" />)
    const avatar = screen.getByRole('img')
    expect(avatar).toHaveClass('size-16', 'text-lg')
  })

  it('applies disabled state correctly', () => {
    render(<Avatar text="AB" disabled />)
    const avatar = screen.getByRole('img')
    expect(avatar).toHaveClass('opacity-50', 'cursor-not-allowed')
  })

  it('applies custom className', () => {
    render(<Avatar text="AB" className="custom-class" />)
    const avatar = screen.getByRole('img')
    expect(avatar).toHaveClass('custom-class')
  })

  it('combines variant and size classes', () => {
    render(<Avatar text="AB" variant="success" size="lg" />)
    const avatar = screen.getByRole('img')
    expect(avatar).toHaveClass('bg-success', 'text-success-foreground', 'size-16', 'text-lg')
  })

  it('shows question mark when no text or src provided', () => {
    render(<Avatar />)
    const avatar = screen.getByRole('img')
    expect(avatar).toHaveTextContent('?')
  })

  it('truncates initials to 2 characters', () => {
    render(<Avatar text="John Michael Doe" />)
    const avatar = screen.getByRole('img')
    expect(avatar).toHaveTextContent('JM')
  })

  it('uses custom alt text when provided with src', () => {
    render(<Avatar src="/avatar.jpg" alt="Custom Alt Text" />)
    // Query by aria-label to get the container div
    const avatar = screen.getByLabelText('Custom Alt Text')
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveAttribute('aria-label', 'Custom Alt Text')
  })

  it('uses text as aria-label when provided without src', () => {
    render(<Avatar text="Jane Smith" />)
    const avatar = screen.getByRole('img')
    expect(avatar).toHaveAttribute('aria-label', 'Jane Smith')
  })
})
