"use client"
import { CreatePost } from "@/components/create-post"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WalletConnect } from "@/components/wallet-connect"
import { PostFeed } from "@/components/post-feed"
import { TrendingTopics } from "@/components/trending-topics"
import { SubscribedCreators } from "@/components/subscribed-creators"
import { motion } from "framer-motion"
import Image from "next/image"
import solcastlogo from "/public/solcastlogo.png"
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900/20 via-background to-cyan-900/20">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-25"></div>
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <Image src={solcastlogo} alt="SolCast Logo" width={40} height={40} />
            </motion.div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-cyan-500">
              SolCast
            </span>
          </Link>
          <WalletConnect />
        </div>
      </header>
      <main className="container grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
        <div className="md:col-span-2">
          <motion.h1
            className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-cyan-500"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Your Feed
          </motion.h1>
          <CreatePost />
          <PostFeed />
        </div>
        <motion.div
          className="hidden md:block space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SubscribedCreators />

          <div className="rounded-xl border bg-card/80 backdrop-blur-sm p-4 shadow-lg shadow-violet-500/5">
            <h2 className="font-semibold mb-4 text-lg bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-cyan-500">
              Discover Creators
            </h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Link
                  href={`/creator/${i}`}
                  key={i}
                  className="flex items-center gap-3 hover:bg-accent/50 p-2 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
                    <span className="text-white font-bold">C{i}</span>
                  </div>
                  <div>
                    <p className="font-medium">Creator {i}</p>
                    <p className="text-sm text-muted-foreground">@creator{i}</p>
                  </div>
                </Link>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4 bg-gradient-to-r from-violet-600/10 to-cyan-500/10 hover:from-violet-600/20 hover:to-cyan-500/20 transition-all duration-300"
            >
              View More
            </Button>
          </div>
          <TrendingTopics />
        </motion.div>
      </main>
    </div>
  )
}

