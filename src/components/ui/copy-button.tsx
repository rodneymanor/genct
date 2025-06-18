"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Clipboard, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CopyButtonProps {
  textToCopy: string
  buttonText?: string
  className?: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "ghost" | "outline"
}

export function CopyButton({ 
  textToCopy, 
  buttonText = "Copy", 
  className,
  size = "sm",
  variant = "outline"
}: CopyButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setIsOpen(true)
      
      // Reset state after a delay
      setTimeout(() => setIsOpen(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      data-state={isOpen ? "open" : "closed"}
      className={cn(
        // Base styles
        "relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0",
        // Focus styles
        "focus-visible:outline-4 focus-visible:outline-offset-1 focus-visible:outline-border-strong",
        // Border and background
        "border text-foreground bg-transparent border-strong hover:border-foreground-muted",
        // State-specific styles
        "data-[state=open]:border-stronger data-[state=open]:outline-border-strong",
        // Pointer events
        "pointer-events-auto",
        className
      )}
      variant={variant}
      size={size}
    >
      <div className="[&_svg]:h-[14px] [&_svg]:w-[14px] text-foreground-lighter">
        {isOpen ? <Check className="lucide lucide-check" /> : <Clipboard className="lucide lucide-clipboard" />}
      </div>
      <span className="truncate">{buttonText}</span>
    </Button>
  )
}
