import * as React from "react"
import { Loader2Icon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const spinnerVariants = cva(
  "animate-spin",
  {
    variants: {
      variant: {
        primary: "text-primary",
        secondary: "text-secondary-foreground",
        success: "text-success",
        danger: "text-danger",
        warning: "text-warning",
      },
      size: {
        sm: "size-4",
        md: "size-6",
        lg: "size-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface SpinnerProps
  extends React.ComponentProps<"svg">,
    VariantProps<typeof spinnerVariants> {
  label?: string
}

function Spinner({
  className,
  variant,
  size,
  label = "Loading",
  ...props
}: SpinnerProps) {
  return (
    <Loader2Icon
      role="status"
      aria-label={label}
      className={cn(spinnerVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Spinner, spinnerVariants }
