import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { WalletProvider } from "@/context/WalletContext"
import { Web3Context } from "@/context/Web3Context"

const inter = Inter({ subsets: ["latin"] })

// Your contract address should be stored in an environment variable
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

export const metadata = {
  title: "SolCast- Decentralized Social Platform",
  description: "A decentralized social platform for creators and their audience",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <WalletProvider>
              {children}
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Repeat, Share, Send, ImageIcon, Lock, Eye, Wallet } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useWeb3 } from './path/to/Web3Provider' // Import the useWeb3 hook

type PostType = "preview" | "full"

type Post = {
  id: number | string
  creator: {
    id: string
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
  contentHash?: string // For blockchain verification
  price?: string // For paid content
}

export function PostFeed() {
  // Use the Web3 context
  const { 
    isConnected, 
    connectWallet, 
    currentAccount, 
    userPosts, 
    publishFreeContent, 
    publishPaidContent,
    accessContent,
    isLoading,
    error 
  } = useWeb3();

  const [posts, setPosts] = useState<Post[]>([])
  const [newPostContent, setNewPostContent] = useState("")
  const [isLiked, setIsLiked] = useState<Record<string | number, boolean>>({})
  const [postType, setPostType] = useState<PostType>("full")
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null)
  const [price, setPrice] = useState("0.01")
  const [loadingPostIds, setLoadingPostIds] = useState<Set<string | number>>(new Set())
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load posts from blockchain when account changes
  useEffect(() => {
    if (userPosts && userPosts.length > 0) {
      // Transform blockchain posts to our UI format
      const transformedPosts = userPosts.map(blockchainPost => ({
        id: blockchainPost.id,
        creator: {
          id: blockchainPost.author,
          name: blockchainPost.author.substring(0, 6) + '...' + blockchainPost.author.substring(38),
          handle: '@' + blockchainPost.author.substring(2, 8),
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "Loading content...", // Content will be fetched when accessing
        type: blockchainPost.contentType === '0' ? "full" as PostType : "preview" as PostType,
        likes: 0,
        comments: 0,
        reposts: 0,
        timestamp: new Date(blockchainPost.timestamp).toLocaleString(),
        isSubscribed: blockchainPost.contentType === '0' || blockchainPost.author.toLowerCase() === currentAccount?.toLowerCase(),
        price: blockchainPost.price,
      }));
      
      setPosts(transformedPosts);
    }
  }, [userPosts, currentAccount]);

  const handleCreatePost = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    if (!newPostContent.trim()) return;

    try {
      let result;
      
      // Determine if this is paid or free content
      if (postType === "preview") {
        // Publish paid content with a price
        result = await publishPaidContent(newPostContent, parseFloat(price));
      } else {
        // Publish free content
        result = await publishFreeContent(newPostContent);
      }
      
      // If transaction was successful, add the post to the UI
      if (result) {
        const postId = result.events?.ContentPublished?.returnValues?.postId || Date.now().toString();
        
        const newPost: Post = {
          id: postId,
          creator: {
            id: currentAccount || "unknown",
            name: currentAccount ? currentAccount.substring(0, 6) + '...' + currentAccount.substring(38) : "You",
            handle: currentAccount ? '@' + currentAccount.substring(2, 8) : "@you",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          content: newPostContent,
          type: postType,
          image: mediaType === "image" ? selectedMedia || undefined : undefined,
          video: mediaType === "video" ? selectedMedia || undefined : undefined,
          likes: 0,
          comments: 0,
          reposts: 0,
          timestamp: "Just now",
          isSubscribed: true,
          price: postType === "preview" ? price : "0",
        };

        setPosts([newPost, ...posts]);
        setNewPostContent("");
        setSelectedMedia(null);
        setMediaType(null);
        setPrice("0.01");
      }
    } catch (error) {
      console.error("Error publishing content:", error);
      alert(`Failed to publish content: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleAccessContent = async (post: Post) => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    try {
      // Mark this post as loading
      setLoadingPostIds(prev => new Set(prev).add(post.id));
      
      // Access the content via blockchain
      const content = await accessContent(post.id.toString());
      
      // Update the post with the retrieved content
      setPosts(prev => 
        prev.map(p => 
          p.id === post.id 
            ? { 
                ...p, 
                content: content,
                fullContent: content,
                isSubscribed: true
              } 
            : p
        )
      );
    } catch (error) {
      console.error("Error accessing content:", error);
      alert(`Failed to access content: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      // Remove loading state
      setLoadingPostIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(post.id);
        return newSet;
      });
    }
  };

  const toggleLike = (postId: number | string) => {
    setIsLiked((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const togglePostType = () => {
    setPostType((prev) => (prev === "full" ? "preview" : "full"));
  };

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
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl border p-4 shadow-lg bg-card/80 backdrop-blur-sm border-violet-500/20"
      >
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center py-6 gap-4">
            <Wallet className="h-10 w-10 text-violet-500" />
            <h3 className="text-lg font-semibold">Connect your wallet to post content</h3>
            <Button
              onClick={connectWallet}
              className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white border-0"
            >
              Connect Wallet
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="border-2 border-violet-500/20 h-10 w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Your avatar" />
                <AvatarFallback className="bg-gradient-to-br from-violet-600 to-cyan-500 text-white">
                  {currentAccount?.substring(2, 4).toUpperCase() || "YO"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{currentAccount ? currentAccount.substring(0, 6) + '...' + currentAccount.substring(38) : "You"}</div>
                <div className="text-sm text-muted-foreground">{currentAccount ? '@' + currentAccount.substring(2, 8) : "@you"}</div>
              </div>
            </div>
            
            <Textarea
              placeholder="What's on your mind? Share your content with the world..."
              className="min-h-20 mb-3 bg-background/50"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
            
            {selectedMedia && (
              <div className="mt-4">
                {mediaType === "image" ? (
                  <Image src={selectedMedia} alt="Selected" width={500} height={300} className="rounded-lg" />
                ) : (
                  <video controls width={500} className="rounded-lg">
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
                      <span>Free Content</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 text-amber-500" />
                      <span>Paid Content</span>
                    </>
                  )}
                </Button>
                
                {postType === "preview" && (
                  <div className="ml-2 flex items-center">
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      min="0.001"
                      step="0.001"
                      className="w-16 h-8 px-2 rounded border border-violet-500/20 bg-background"
                    />
                    <span className="ml-1 text-sm">ETH</span>
                  </div>
                )}
              </div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim() || isLoading}
                  className="relative overflow-hidden group bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white border-0"
                >
                  <div className="absolute -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
                  {isLoading ? "Publishing..." : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Publish
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </>
        )}
      </motion.div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

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
                        {post.price && <span>{post.price} ETH</span>}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>Free</span>
                      </div>
                    )}
                  </Badge>
                </div>

                {post.type === "preview" && !post.isSubscribed ? (
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
                          <Button 
                            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0"
                            onClick={() => handleAccessContent(post)}
                            disabled={loadingPostIds.has(post.id)}
                          >
                            {loadingPostIds.has(post.id) ? (
                              "Processing Payment..."
                            ) : (
                              <>
                                <Lock className="mr-2 h-4 w-4" />
                                Access for {post.price} ETH
                              </>
                            )}
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
                          <Button 
                            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0"
                            onClick={() => handleAccessContent(post)}
                            disabled={loadingPostIds.has(post.id)}
                          >
                            {loadingPostIds.has(post.id) ? (
                              "Processing Payment..."
                            ) : (
                              <>
                                <Lock className="mr-2 h-4 w-4" />
                                Access for {post.price} ETH
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                    {!post.image && !post.video && post.fullContent && (
                      <div className="mt-4 p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 relative">
                        <div className="absolute inset-0 backdrop-blur-[3px]"></div>
                        <div className="relative z-10 flex flex-col items-center justify-center gap-3 py-4">
                          <Lock className="h-8 w-8 text-amber-500" />
                          <p className="text-center font-medium">This content requires payment to access</p>
                          <Button 
                            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0"
                            onClick={() => handleAccessContent(post)}
                            disabled={loadingPostIds.has(post.id)}
                          >
                            {loadingPostIds.has(post.id) ? (
                              "Processing Payment..."
                            ) : (
                              <>
                                Access for {post.price} ETH
                              </>
                            )}
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