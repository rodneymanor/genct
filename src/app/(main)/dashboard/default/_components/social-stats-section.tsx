import { TrendingUp, Users, Eye, Play, MessageCircle, Heart, Share } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function SocialStatsSection() {
  return (
    <div className="space-y-6">
      {/* Social Stats Cards */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Followers</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">24,567</CardTitle>
            <CardAction>
              <Badge variant="outline">
                <TrendingUp />
                +8.2%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Combined across platforms <TrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">TikTok + Instagram growth</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>New Followers (7 Days)</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">1,234</CardTitle>
            <CardAction>
              <Badge variant="outline">
                <TrendingUp />
                +15.3%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Strong weekly growth <TrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">Outperforming last month</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Scripts Created</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">42</CardTitle>
            <CardAction>
              <Badge variant="outline">
                <TrendingUp />
                +12.5%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Productive content creation <TrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">28 published, 14 in progress</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Engagement Rate</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">4.8%</CardTitle>
            <CardAction>
              <Badge variant="outline">
                <TrendingUp />
                +0.8%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Above average performance <TrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">Quality content resonating</div>
          </CardFooter>
        </Card>
      </div>

      {/* Profile Link Cards */}
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2">
        <Card className="@container/card">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                <Instagram className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-base">@yourhandle</CardTitle>
                <CardDescription>Instagram • 12.4K followers</CardDescription>
              </div>
              <div className="ml-auto">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardHeader>
          <CardFooter className="pt-0">
            <div className="flex w-full items-center justify-between text-sm">
              <span className="text-muted-foreground">+234 this week</span>
              <Badge variant="secondary">
                <TrendingUp className="mr-1 h-3 w-3" />
                +12.3%
              </Badge>
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-red-500">
                <Music className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-base">@yourhandle</CardTitle>
                <CardDescription>TikTok • 12.1K followers</CardDescription>
              </div>
              <div className="ml-auto">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardHeader>
          <CardFooter className="pt-0">
            <div className="flex w-full items-center justify-between text-sm">
              <span className="text-muted-foreground">+1,000 this week</span>
              <Badge variant="secondary">
                <TrendingUp className="mr-1 h-3 w-3" />
                +18.2%
              </Badge>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 