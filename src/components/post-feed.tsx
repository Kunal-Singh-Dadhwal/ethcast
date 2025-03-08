"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Repeat, Share, Send, ImageIcon, Lock, Eye } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type PostType = "preview" | "full"

type Post = {
  id: number
  creator: {
    id: number
    name: string
    handle: string
    avatar: string
  }
  content: string
  fullContent?: string
  type: PostType
  image?: string
  video?: string
  likes: number
  comments: number
  reposts: number
  timestamp: string
  isSubscribed?: boolean
}

const initialPosts: Post[] = [
  {
    id: 1,
    creator: {
      id: 1,
      name: "Creator 1",
      handle: "@creator1",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Just launched my new NFT collection! Check it out on my profile. #NFT #Crypto #Art",
    type: "full",
    image: "/placeholder.svg?height=300&width=500",
    likes: 42,
    comments: 12,
    reposts: 5,
    timestamp: "2h ago",
    isSubscribed: true,
  },
  {
    id: 2,
    creator: {
      id: 2,
      name: "Creator 2",
      handle: "@creator2",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Decentralization is the future of social media. No more censorship, no more data harvesting.",
    fullContent:
      "Decentralization is the future of social media. No more censorship, no more data harvesting. In this exclusive post, I'll share my detailed analysis of how blockchain technology will transform content creation and distribution over the next decade. I've included my research on tokenomics models that can sustain creator economies without relying on advertising or data mining.",
    type: "preview",
    likes: 128,
    comments: 24,
    reposts: 36,
    timestamp: "5h ago",
    isSubscribed: false,
  },
  {
    id: 3,
    creator: {
      id: 3,
      name: "Creator 3",
      handle: "@creator3",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Working on a new project that will revolutionize how we think about digital ownership. Stay tuned!",
    fullContent:
      "Working on a new project that will revolutionize how we think about digital ownership. Stay tuned! I'm building a platform that allows creators to fractionalize ownership of their digital assets, enabling micro-investments from their community. This creates a symbiotic relationship where fans become stakeholders in a creator's success. Here's an exclusive first look at the prototype and technical architecture.",
    type: "preview",
    image: "/placeholder.svg?height=300&width=500",
    likes: 89,
    comments: 15,
    reposts: 12,
    timestamp: "1d ago",
    isSubscribed: false,
  },
  {
    id: 4,
    creator: {
      id: 1,
      name: "Creator 1",
      handle: "@creator1",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Exclusive for my subscribers: Here's my detailed analysis of the latest market trends and how they'll impact the NFT space in 2023.",
    fullContent:
      "Exclusive for my subscribers: Here's my detailed analysis of the latest market trends and how they'll impact the NFT space in 2023. After analyzing data from the past 6 months, I've identified three key patterns that suggest we're entering a new phase of maturity in the NFT market. Utility-focused projects are seeing sustained growth while purely speculative collections are declining. Here's my complete breakdown with charts and predictions for the next quarter.",
    type: "full",
    image: "/placeholder.svg?height=300&width=500",
    likes: 156,
    comments: 42,
    reposts: 28,
    timestamp: "3h ago",
    isSubscribed: true,
  },
]

export function PostFeed() {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [newPostContent, setNewPostContent] = useState("")
  const [isLiked, setIsLiked] = useState<Record<number, boolean>>({})
  const [postType, setPostType] = useState<PostType>("full")
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return

    const newPost: Post = {
      id: posts.length + 1,
      creator: {
        id: 0,
        name: "You",
        handle: "@you",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: newPostContent,
      type: postType,
      image: mediaType === "image" ? selectedMedia : undefined,
      video: mediaType === "video" ? selectedMedia : undefined,
      likes: 0,
      comments: 0,
      reposts: 0,
      timestamp: "Just now",
      isSubscribed: true,
    }

    setPosts([newPost, ...posts])
    setNewPostContent("")
    setSelectedMedia(null)
    setMediaType(null)
  }

  const toggleLike = (postId: number) => {
    setIsLiked((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }))
  }

  const togglePostType = () => {
    setPostType((prev) => (prev === "full" ? "preview" : "full"))
  }

  const handleImageIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedMedia(reader.result as string);
        setMediaType(file.type.startsWith("image") ? "image" : "video");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        className="rounded-xl border bg-card/80 backdrop-blur-sm p-4 shadow-lg shadow-violet-500/5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Textarea
          placeholder="What's happening?"
          className="resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 bg-transparent text-lg"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
        />
        {selectedMedia && (
          <div className="mt-4">
            {mediaType === "image" ? (
              <Image src={selectedMedia} alt="Selected" width={500} height={300} className="rounded-lg" />
            ) : (
              <video controls width="500" className="rounded-lg">
                <source src={selectedMedia} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        )}
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-2 items-center">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-violet-500 hover:text-violet-600 hover:bg-violet-500/10"
              onClick={handleImageIconClick}
            >
              <ImageIcon className="h-5 w-5" />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*,video/*"
              onChange={handleFileChange}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={togglePostType}
              className="rounded-full border-violet-500/20 flex gap-2 items-center"
            >
              {postType === "full" ? (
                <>
                  <Eye className="h-4 w-4 text-green-500" />
                  <span>Full Post</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 text-amber-500" />
                  <span>Preview</span>
                </>
              )}
            </Button>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleCreatePost}
              disabled={!newPostContent.trim()}
              className="relative overflow-hidden group bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white border-0"
            >
              <div className="absolute -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
              <Send className="mr-2 h-4 w-4" />
              Post
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`rounded-xl border p-4 shadow-lg hover:shadow-violet-500/10 hover:scale-[1.01] transition-all duration-300 ${
              post.type === "preview"
                ? "bg-gradient-to-r from-amber-500/5 to-amber-600/5 border-amber-500/30"
                : "bg-card/80 backdrop-blur-sm shadow-violet-500/5 border-violet-500/20"
            }`}
          >
            <div className="flex gap-3">
              <Link href={`/creator/${post.creator.id}`}>
                <Avatar
                  className={`border-2 h-10 w-10 ${
                    post.type === "preview" ? "border-amber-500/30" : "border-violet-500/20"
                  }`}
                >
                  <AvatarImage src={post.creator.avatar} alt={post.creator.name} />
                  <AvatarFallback
                    className={`text-white ${
                      post.type === "preview"
                        ? "bg-gradient-to-br from-amber-500 to-amber-600"
                        : "bg-gradient-to-br from-violet-600 to-cyan-500"
                    }`}
                  >
                    {post.creator.name[0]}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Link href={`/creator/${post.creator.id}`} className="font-semibold hover:underline">
                    {post.creator.name}
                  </Link>
                  <span className="text-muted-foreground text-sm">{post.creator.handle}</span>
                  <span className="text-muted-foreground text-sm">·</span>
                  <span className="text-muted-foreground text-sm">{post.timestamp}</span>
                  <Badge
                    variant="outline"
                    className={`ml-auto text-xs font-medium ${
                      post.type === "preview"
                        ? "border-amber-500/30 text-amber-500 bg-amber-500/10"
                        : "border-green-500/30 text-green-500 bg-green-500/10"
                    }`}
                  >
                    {post.type === "preview" ? (
                      <div className="flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        <span>Preview</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>Full Post</span>
                      </div>
                    )}
                  </Badge>
                </div>

                {post.type === "preview" ? (
                  <>
                    <p className="mt-2">{post.content}</p>
                    {post.image && (
                      <div className="mt-3 rounded-lg overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10"></div>
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt="Post image"
                          width={500}
                          height={300}
                          className="w-full object-cover hover:scale-[1.02] transition-transform duration-500 blur-[90px]"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                          <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0">
                            <Lock className="mr-2 h-4 w-4" />
                            Subscribe to View Full Post
                          </Button>
                        </div>
                      </div>
                    )}
                    {post.video && (
                      <div className="mt-3 rounded-lg overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10"></div>
                        <video controls width="500" className="rounded-lg blur-[40px]">
                          <source src={post.video} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                          <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0">
                            <Lock className="mr-2 h-4 w-4" />
                            Subscribe to View Full Post
                          </Button>
                        </div>
                      </div>
                    )}
                    {!post.image && !post.video && post.fullContent && (
                      <div className="mt-4 p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 relative">
                        <div className="absolute inset-0 backdrop-blur-[3px]"></div>
                        <div className="relative z-10 flex flex-col items-center justify-center gap-3 py-4">
                          <Lock className="h-8 w-8 text-amber-500" />
                          <p className="text-center font-medium">This content is exclusive to subscribers</p>
                          <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0">
                            Subscribe to View
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <p className="mt-2">{post.fullContent || post.content}</p>
                    {post.image && (
                      <div className="mt-3 rounded-lg overflow-hidden">
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt="Post image"
                          width={500}
                          height={300}
                          className="w-full object-cover hover:scale-[1.02] transition-transform duration-500"
                        />
                      </div>
                    )}
                    {post.video && (
                      <div className="mt-3 rounded-lg overflow-hidden">
                        <video controls width="500" className="rounded-lg">
                          <source src={post.video} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                  </>
                )}

                <div className="flex justify-between mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-1 rounded-full transition-colors ${isLiked[post.id] ? "text-red-500 hover:text-red-600 hover:bg-red-500/10" : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10"}`}
                    onClick={() => toggleLike(post.id)}
                  >
                    <motion.div whileTap={{ scale: 1.4 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                      <Heart className="h-4 w-4" fill={isLiked[post.id] ? "currentColor" : "none"} />
                    </motion.div>
                    <span>{post.likes + (isLiked[post.id] ? 1 : 0)}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 rounded-full text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 rounded-full text-muted-foreground hover:text-green-500 hover:bg-green-500/10"
                  >
                    <Repeat className="h-4 w-4" />
                    <span>{post.reposts}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-muted-foreground hover:text-violet-500 hover:bg-violet-500/10"
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

