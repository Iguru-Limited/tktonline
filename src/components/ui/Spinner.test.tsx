import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Spinner } from './spinner'

describe('Spinner', () => {
  it('renders with default props', () => {
    render(<Spinner />)
    const spinner = screen.getByRole('status')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveAttribute('aria-label', 'Loading')
  })

  it('renders with custom label', () => {
    render(<Spinner label="Processing" />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveAttribute('aria-label', 'Processing')
  })

  it('applies primary variant by default', () => {
    render(<Spinner />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('text-primary')
  })

  it('applies success variant correctly', () => {
    render(<Spinner variant="success" />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('text-success')
  })

  it('applies secondary variant correctly', () => {
    render(<Spinner variant="secondary" />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('text-secondary-foreground')
  })

  it('applies danger variant correctly', () => {
    render(<Spinner variant="danger" />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('text-danger')
  })

  it('applies warning variant correctly', () => {
    render(<Spinner variant="warning" />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('text-warning')
  })

  it('applies small size correctly', () => {
    render(<Spinner size="sm" />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('size-4')
  })

  it('applies medium size by default', () => {
    render(<Spinner />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('size-6')
  })

  it('applies large size correctly', () => {
    render(<Spinner size="lg" />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('size-8')
  })

  it('applies custom className', () => {
    render(<Spinner className="custom-class" />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('custom-class')
  })

  it('includes animate-spin class', () => {
    render(<Spinner />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('animate-spin')
  })

  it('combines variant and size classes', () => {
    render(<Spinner variant="success" size="lg" />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('text-success', 'size-8', 'animate-spin')
  })
})
