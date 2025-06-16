"use client";

import * as React from "react";

import { Music, Instagram } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const followerData = [
  { date: "Dec 1", tiktok: 8500, instagram: 6200 },
  { date: "Dec 3", tiktok: 8750, instagram: 6350 },
  { date: "Dec 5", tiktok: 9100, instagram: 6480 },
  { date: "Dec 7", tiktok: 9200, instagram: 6650 },
  { date: "Dec 9", tiktok: 9650, instagram: 6800 },
  { date: "Dec 11", tiktok: 10200, instagram: 7100 },
  { date: "Dec 13", tiktok: 10800, instagram: 7350 },
  { date: "Dec 15", tiktok: 11100, instagram: 7500 },
  { date: "Dec 17", tiktok: 11500, instagram: 7750 },
  { date: "Dec 19", tiktok: 11850, instagram: 8000 },
  { date: "Dec 21", tiktok: 12100, instagram: 8200 },
  { date: "Dec 23", tiktok: 12400, instagram: 8400 },
];

const chartConfig = {
  followers: {
    label: "Followers",
  },
  tiktok: {
    label: "TikTok",
    color: "var(--chart-1)",
  },
  instagram: {
    label: "Instagram",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function PerformanceChart() {
  const [platform, setPlatform] = React.useState("both");

  const getVisibleData = () => {
    if (platform === "tiktok") {
      return followerData.map((item) => ({ ...item, instagram: 0 }));
    }
    if (platform === "instagram") {
      return followerData.map((item) => ({ ...item, tiktok: 0 }));
    }
    return followerData;
  };

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Follower Growth</CardTitle>
        <CardDescription>Track your social media audience growth over time</CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={platform}
            onValueChange={setPlatform}
            variant="outline"
            className="*:data-[slot=toggle-group-item]:!px-3"
          >
            <ToggleGroupItem value="both" className="flex items-center gap-2">
              <span className="hidden @[400px]/card:inline">Both Platforms</span>
              <span className="@[400px]/card:hidden">Both</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="tiktok" className="flex items-center gap-2">
              <Music className="h-3 w-3" />
              <span className="hidden @[300px]/card:inline">TikTok</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="instagram" className="flex items-center gap-2">
              <Instagram className="h-3 w-3" />
              <span className="hidden @[300px]/card:inline">Instagram</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={getVisibleData()}>
            <defs>
              <linearGradient id="fillTiktok" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-tiktok)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-tiktok)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillInstagram" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-instagram)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-instagram)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => value}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `${value / 1000}k`} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => value}
                  formatter={(value, name) => [
                    `${value.toLocaleString()} followers`,
                    name === "tiktok" ? "TikTok" : "Instagram",
                  ]}
                />
              }
            />
            {platform !== "instagram" && (
              <Area dataKey="tiktok" type="natural" fill="url(#fillTiktok)" stroke="var(--color-tiktok)" stackId="a" />
            )}
            {platform !== "tiktok" && (
              <Area
                dataKey="instagram"
                type="natural"
                fill="url(#fillInstagram)"
                stroke="var(--color-instagram)"
                stackId={platform === "both" ? "a" : "b"}
              />
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
