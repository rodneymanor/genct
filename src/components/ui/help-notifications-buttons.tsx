import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CircleHelp, Inbox } from "lucide-react"

export default function HelpNotificationsButtons() {
  return (
    <TooltipProvider>
      <div className="overflow-hidden inline-flex items-center rounded-full border">
        {/* Help Button */}
        <Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative justify-center cursor-pointer inline-flex items-center text-center font-normal ease-out duration-200 outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border-transparent text-xs px-2.5 py-1 rounded-none w-[32px] h-[30px] group pointer-events-auto hover:bg-muted data-[state=open]:bg-muted"
                >
                  <CircleHelp className="h-[18px] w-[18px] text-muted-foreground group-hover:text-foreground transition-colors" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Help</p>
            </TooltipContent>
          </Tooltip>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Help & Support</h4>
              <p className="text-sm text-muted-foreground">
                Get help with your account, billing, and technical issues.
              </p>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Documentation
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Contact Support
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Community Forum
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Notifications Button */}
        <Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative justify-center cursor-pointer inline-flex items-center text-center font-normal ease-out duration-200 outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border-transparent text-xs py-1 rounded-none h-[30px] w-[32px] group px-1 pointer-events-auto hover:bg-muted data-[state=open]:bg-muted"
                >
                  <Inbox className="h-[18px] w-[18px] text-muted-foreground group-hover:text-foreground transition-colors" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Notifications</h4>
              <p className="text-sm text-muted-foreground">You have no new notifications.</p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 p-2 rounded-md border">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Welcome to the platform!</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-md">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">System maintenance scheduled</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </TooltipProvider>
  )
} 