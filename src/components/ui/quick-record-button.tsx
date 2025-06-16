"use client"

import { Mic } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function QuickRecordButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/dashboard/capture/record">
            <Button
              size="lg"
              className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
            >
              <Mic className="h-6 w-6" />
              <span className="sr-only">Quick Record</span>
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Quick Record</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
} 