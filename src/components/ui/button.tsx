import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Supabase Green Brand Button - using actual Tailwind colors
        brand:
          "bg-emerald-400 dark:bg-emerald-500 hover:bg-emerald-500 dark:hover:bg-emerald-600 text-emerald-900 dark:text-emerald-100 border border-emerald-400 dark:border-emerald-500 hover:border-emerald-500 dark:hover:border-emerald-600 focus-visible:outline-emerald-600 data-[state=open]:bg-emerald-400/80 dark:data-[state=open]:bg-emerald-500/80",
        
        // White/Transparent Dashed Border Button
        dashed:
          "text-foreground border border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/30 bg-transparent focus-visible:outline-gray-400 data-[state=open]:border-gray-400 dark:data-[state=open]:border-gray-500",
        
        // Standard variants with proper Tailwind borders
        default:
          "bg-primary text-primary-foreground border border-gray-300 dark:border-gray-600 hover:bg-primary/90 hover:border-gray-400 dark:hover:border-gray-500",
        destructive:
          "bg-destructive text-white border border-gray-300 dark:border-gray-600 hover:bg-destructive/90 hover:border-gray-400 dark:hover:border-gray-500",
        outline:
          "border bg-background border-gray-300 dark:border-gray-600 hover:bg-accent hover:text-accent-foreground hover:border-gray-400 dark:hover:border-gray-500",
        secondary:
          "bg-secondary text-secondary-foreground border border-gray-300 dark:border-gray-600 hover:bg-secondary/80 hover:border-gray-400 dark:hover:border-gray-500",
        ghost:
          "border border-transparent hover:bg-accent hover:text-accent-foreground hover:border-gray-300 dark:hover:border-gray-600",
        link: "text-primary underline-offset-4 hover:underline border border-transparent",
      },
      size: {
        // Supabase tiny size
        tiny: "text-xs px-2.5 py-1 h-[26px] [&_svg]:h-[14px] [&_svg]:w-[14px]",
        
        // Standard sizes
        default: "h-9 px-4 py-2 has-[>svg]:px-3 [&_svg:not([class*='size-'])]:size-4",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 [&_svg:not([class*='size-'])]:size-4",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4 [&_svg:not([class*='size-'])]:size-4",
        icon: "size-9 [&_svg:not([class*='size-'])]:size-4",
        "icon-tiny": "w-[26px] h-[26px] [&_svg]:h-[14px] [&_svg]:w-[14px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
