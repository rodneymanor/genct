"use client";

import React from "react";

import { BarChart3, TrendingUp, Users, FileText, Heart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function QuickStatsButton() {
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
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <BarChart3 className="h-4 w-4" />
          <span className="sr-only">Quick Stats</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64">
        <div className="space-y-3">
          <div className="text-sm font-medium">Quick Stats</div>
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
        </div>
      </PopoverContent>
    </Popover>
  );
}
