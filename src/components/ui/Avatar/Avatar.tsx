import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const avatarVariants = cva(
  'inline-flex items-center justify-center rounded-full font-semibold uppercase overflow-hidden',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        success: 'bg-success text-success-foreground',
        danger: 'bg-danger text-danger-foreground',
        warning: 'bg-warning text-warning-foreground',
      },
      size: {
        sm: 'size-8 text-xs',
        md: 'size-12 text-sm',
        lg: 'size-16 text-lg',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      disabled: false,
    },
  }
)

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  /** The text to display in the avatar (typically initials) */
  text?: string
  /** The image source URL */
  src?: string
  /** Alt text for the image */
  alt?: string
  /** Whether the avatar is disabled */
  disabled?: boolean
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, variant, size, disabled, text, src, alt, ...props }, ref) => {
    // Generate initials from text if provided and no src
    const initials = text
      ? text
          .split(' ')
          .map((word) => word.charAt(0))
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : '?'

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ variant, size, disabled, className }))}
        role="img"
        aria-label={alt || text || 'User avatar'}
        {...props}
      >
        {src ? (
          <Image
            src={src}
            alt={alt || text || 'User avatar'}
            className="size-full object-cover"
            width={40}
            height={40}
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'
