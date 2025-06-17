"use client";

import React, { useState } from "react";

import { ChevronDown, ChevronUp, TrendingUp, Users, FileText, Heart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SidebarStatsProps {
  className?: string;
}

export function SidebarStats({ className }: SidebarStatsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const stats = [
    {
      label: "Followers",
      value: "12.5K",
      change: "+15.3%",
      trend: "up",
      icon: Users,
    },
    {
      label: "Scripts Created",
      value: "42",
      change: "+12.5%",
      trend: "up",
      icon: FileText,
    },
    {
      label: "Engagement Rate",
      value: "4.8%",
      change: "+0.8%",
      trend: "up",
      icon: Heart,
    },
  ];

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Quick Stats</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-6 w-6 p-0">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className={cn("space-y-3 transition-all duration-200", !isExpanded && "sr-only")}>
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div key={stat.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconComponent className="text-muted-foreground h-4 w-4" />
                <span className="text-muted-foreground text-sm">{stat.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{stat.value}</span>
                <Badge variant="outline" className="gap-1 text-xs">
                  <TrendingUp className="h-3 w-3" />
                  {stat.change}
                </Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
