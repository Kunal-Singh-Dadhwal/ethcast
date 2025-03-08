"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Crown, ChevronRight } from "lucide-react"

type SubscribedCreator = {
  id: number
  name: string
  handle: string
  avatar: string
  tier: "basic" | "premium" | "exclusive"
  newContent: boolean
}

const subscribedCreators: SubscribedCreator[] = [
  {
    id: 1,
    name: "Creator 1",
    handle: "@creator1",
    avatar: "/placeholder.svg?height=40&width=40",
    tier: "premium",
    newContent: true,
  },
  {
    id: 4,
    name: "Creator 4",
    handle: "@creator4",
    avatar: "/placeholder.svg?height=40&width=40",
    tier: "basic",
    newContent: false,
  },
  {
    id: 7,
    name: "Creator 7",
    handle: "@creator7",
    avatar: "/placeholder.svg?height=40&width=40",
    tier: "exclusive",
    newContent: true,
  },
]

export function SubscribedCreators() {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case "basic":
        return "from-blue-500 to-blue-600"
      case "premium":
        return "from-violet-600 to-cyan-500"
      case "exclusive":
        return "from-amber-500 to-amber-600"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  const getTierBgColor = (tier: string) => {
    switch (tier) {
      case "basic":
        return "bg-blue-500/10 border-blue-500/30 text-blue-500"
      case "premium":
        return "bg-violet-500/10 border-violet-500/30 text-violet-500"
      case "exclusive":
        return "bg-amber-500/10 border-amber-500/30 text-amber-500"
      default:
        return "bg-gray-500/10 border-gray-500/30 text-gray-500"
    }
  }

  return (
    <div className="rounded-xl border bg-card/80 backdrop-blur-sm p-4 shadow-lg shadow-violet-500/5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-cyan-500">
          Your Subscriptions
        </h2>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-violet-500">
          View All
        </Button>
      </div>

      <div className="space-y-3">
        {subscribedCreators.map((creator, i) => (
          <motion.div
            key={creator.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group"
          >
            <Link
              href={`/creator/${creator.id}`}
              className={`flex items-center justify-between p-3 rounded-lg border hover:scale-[1.02] transition-all duration-300 ${
                creator.newContent
                  ? "border-violet-500/30 bg-gradient-to-r from-violet-500/10 to-transparent"
                  : "border-violet-500/20 hover:bg-violet-500/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className={`h-10 w-10 border-2 border-${getTierColor(creator.tier)}`}>
                    <AvatarImage src={creator.avatar} alt={creator.name} />
                    <AvatarFallback className={`bg-gradient-to-br ${getTierColor(creator.tier)} text-white`}>
                      {creator.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  {creator.tier === "exclusive" && (
                    <div className="absolute -top-1 -right-1 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full p-0.5 text-white">
                      <Crown className="h-3 w-3" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{creator.name}</p>
                    {creator.newContent && <span className="h-2 w-2 rounded-full bg-violet-500 animate-pulse"></span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">{creator.handle}</p>
                    <Badge variant="outline" className={`text-[10px] py-0 px-1.5 ${getTierBgColor(creator.tier)}`}>
                      {creator.tier}
                    </Badge>
                  </div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-violet-500 transition-colors" />
            </Link>
          </motion.div>
        ))}
      </div>

      <Button
        variant="outline"
        className="w-full mt-4 bg-gradient-to-r from-violet-600/10 to-cyan-500/10 hover:from-violet-600/20 hover:to-cyan-500/20 transition-all duration-300"
      >
        Discover More Creators
      </Button>
    </div>
  )
}

