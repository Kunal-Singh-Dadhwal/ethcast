"use client"
import { TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

export function TrendingTopics() {
  const topics = [
    { name: "#Decentralization", posts: "1.2K posts" },
    { name: "#NFTArt", posts: "856 posts" },
    { name: "#Web3", posts: "2.4K posts" },
    { name: "#DeFi", posts: "1.5K posts" },
    { name: "#DAOs", posts: "678 posts" },
  ]

  return (
    <div className="rounded-xl border bg-card/80 backdrop-blur-sm p-4 shadow-lg shadow-violet-500/5">
      <h2 className="font-semibold mb-4 text-lg bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-cyan-500">
        Trending Topics
      </h2>
      <div className="space-y-4">
        {topics.map((topic, i) => (
          <motion.div
            key={i}
            className="flex items-center justify-between hover:bg-gradient-to-r hover:from-violet-600/10 hover:to-cyan-500/10 p-2 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer"
            whileHover={{ x: 5 }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-600/20 to-cyan-500/20 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-violet-500" />
              </div>
              <div>
                <p className="font-medium">{topic.name}</p>
                <p className="text-sm text-muted-foreground">{topic.posts}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

