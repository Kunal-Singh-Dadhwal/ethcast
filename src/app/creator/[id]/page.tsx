import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { WalletConnect } from "@/components/wallet-connect"
import { Heart, MessageCircle, Repeat, Share, Users, Lock, Eye, Crown } from "lucide-react"

export default function CreatorPage({ params }: { params: { id: string } }) {
  const creatorId = params.id

  // This would be fetched from a database in a real app
  const creator = {
    id: creatorId,
    name: `Creator ${creatorId}`,
    handle: `@creator${creatorId}`,
    avatar: "/placeholder.svg?height=100&width=100",
    banner: "/placeholder.svg?height=300&width=1200",
    bio: "Digital artist and NFT creator. Building the future of decentralized content.",
    followers: 1240,
    following: 356,
    isSubscribed: creatorId === "1", // Simulate subscription status
    subscriptionTier: "premium",
    posts: [
      {
        id: 1,
        content: "Just launched my new NFT collection! Check it out on my profile. #NFT #Crypto #Art",
        type: "full",
        image: "/placeholder.svg?height=300&width=500",
        likes: 42,
        comments: 12,
        reposts: 5,
        timestamp: "2h ago",
      },
      {
        id: 2,
        content: "Working on something special for my subscribers. Stay tuned!",
        fullContent:
          "Working on something special for my subscribers. Stay tuned! Here's an exclusive sneak peek at my upcoming collection that explores the intersection of AI and blockchain technology. I've been developing this concept for months and can't wait to share the full details with you all.",
        type: "preview",
        likes: 89,
        comments: 15,
        reposts: 12,
        timestamp: "1d ago",
      },
    ],
    nfts: [
      { id: 1, image: "/placeholder.svg?height=200&width=200", name: "Digital Dreams #001", price: "0.5 ETH" },
      { id: 2, image: "/placeholder.svg?height=200&width=200", name: "Digital Dreams #002", price: "0.7 ETH" },
      { id: 3, image: "/placeholder.svg?height=200&width=200", name: "Digital Dreams #003", price: "0.4 ETH" },
      { id: 4, image: "/placeholder.svg?height=200&width=200", name: "Digital Dreams #004", price: "0.6 ETH" },
    ],
    subscribers: [
      { id: 1, name: "User 1", avatar: "/placeholder.svg?height=40&width=40", tier: "premium" },
      { id: 2, name: "User 2", avatar: "/placeholder.svg?height=40&width=40", tier: "basic" },
      { id: 3, name: "User 3", avatar: "/placeholder.svg?height=40&width=40", tier: "exclusive" },
      { id: 4, name: "User 4", avatar: "/placeholder.svg?height=40&width=40", tier: "premium" },
      { id: 5, name: "User 5", avatar: "/placeholder.svg?height=40&width=40", tier: "basic" },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900/20 via-background to-cyan-900/20">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-25"></div>
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-bold">D</span>
            </div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-cyan-500">
              Decentra
            </span>
          </Link>
          <WalletConnect />
        </div>
      </header>

      <div className="relative">
        <div className="h-48 md:h-64 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-cyan-500/20 mix-blend-overlay z-10"></div>
          <Image
            src={creator.banner || "/placeholder.svg"}
            alt="Creator banner"
            width={1200}
            height={300}
            className="w-full object-cover"
          />
        </div>

        <div className="container relative">
          <div className="absolute -top-16 left-4 rounded-full border-4 border-background shadow-xl">
            <Avatar className="h-32 w-32 bg-gradient-to-br from-violet-600 to-cyan-500">
              <AvatarImage src={creator.avatar} alt={creator.name} className="opacity-85 mix-blend-overlay" />
              <AvatarFallback className="text-white text-2xl">{creator.name[0]}</AvatarFallback>
            </Avatar>
            {creator.isSubscribed && (
              <div className="absolute -top-2 -right-2 bg-gradient-to-br from-violet-600 to-cyan-500 rounded-full p-1 text-white">
                <Crown className="h-4 w-4" />
              </div>
            )}
          </div>

          <div className="pt-20 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-cyan-500">
                  {creator.name}
                </h1>
                {creator.isSubscribed && (
                  <Badge className="bg-gradient-to-r from-violet-600 to-cyan-500 text-white border-0">
                    <Crown className="h-3 w-3 mr-1" />
                    Subscribed
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{creator.handle}</p>
              <p className="mt-2 max-w-2xl">{creator.bio}</p>
              <div className="flex gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-violet-500" />
                  <span className="font-medium">{creator.followers}</span>
                  <span className="text-muted-foreground">followers</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">{creator.following}</span>
                  <span className="text-muted-foreground">following</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {creator.isSubscribed ? (
                <Button className="relative overflow-hidden group bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white border-0">
                  <div className="absolute -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
                  <Crown className="mr-2 h-4 w-4" />
                  Manage Subscription
                </Button>
              ) : (
                <Button className="relative overflow-hidden group bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white border-0">
                  <div className="absolute -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
                  Subscribe
                </Button>
              )}
              <Button variant="outline" className="border-violet-500/20 hover:bg-violet-500/10">
                Follow
              </Button>
            </div>
          </div>

          <Tabs defaultValue="posts" className="mt-4">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-background/50 backdrop-blur-sm">
              <TabsTrigger
                value="posts"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600/20 data-[state=active]:to-cyan-500/20 data-[state=active]:text-foreground"
              >
                Posts
              </TabsTrigger>
              <TabsTrigger
                value="nfts"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600/20 data-[state=active]:to-cyan-500/20 data-[state=active]:text-foreground"
              >
                NFTs
              </TabsTrigger>
              <TabsTrigger
                value="subscribers"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600/20 data-[state=active]:to-cyan-500/20 data-[state=active]:text-foreground"
              >
                Subscribers
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-6">
              {creator.posts.map((post) => (
                <div
                  key={post.id}
                  className={`rounded-xl border p-4 shadow-lg hover:shadow-violet-500/10 hover:scale-[1.01] transition-all duration-300 ${
                    post.type === "preview" && !creator.isSubscribed
                      ? "bg-gradient-to-r from-amber-500/5 to-amber-600/5 border-amber-500/30"
                      : "bg-card/80 backdrop-blur-sm shadow-violet-500/5 border-violet-500/20"
                  }`}
                >
                  <div className="flex gap-3">
                    <Avatar
                      className={`border-2 h-10 w-10 ${
                        post.type === "preview" && !creator.isSubscribed
                          ? "border-amber-500/30"
                          : "border-violet-500/20"
                      }`}
                    >
                      <AvatarImage src={creator.avatar} alt={creator.name} />
                      <AvatarFallback
                        className={`text-white ${
                          post.type === "preview" && !creator.isSubscribed
                            ? "bg-gradient-to-br from-amber-500 to-amber-600"
                            : "bg-gradient-to-br from-violet-600 to-cyan-500"
                        }`}
                      >
                        {creator.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{creator.name}</span>
                        <span className="text-muted-foreground text-sm">{creator.handle}</span>
                        <span className="text-muted-foreground text-sm">·</span>
                        <span className="text-muted-foreground text-sm">{post.timestamp}</span>
                        <Badge
                          variant="outline"
                          className={`ml-auto text-xs font-medium ${
                            post.type === "preview" && !creator.isSubscribed
                              ? "border-amber-500/30 text-amber-500 bg-amber-500/10"
                              : "border-green-500/30 text-green-500 bg-green-500/10"
                          }`}
                        >
                          {post.type === "preview" && !creator.isSubscribed ? (
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

                      {post.type === "preview" && !creator.isSubscribed ? (
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
                                className="w-full object-cover hover:scale-[1.02] transition-transform duration-500 blur-[2px]"
                              />
                              <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                                <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0">
                                  <Lock className="mr-2 h-4 w-4" />
                                  Subscribe to View Full Post
                                </Button>
                              </div>
                            </div>
                          )}
                          {!post.image && post.fullContent && (
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
                        </>
                      )}

                      <div className="flex justify-between mt-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                        >
                          <Heart className="h-4 w-4" />
                          <span>{post.likes}</span>
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
                </div>
              ))}
            </TabsContent>

            <TabsContent value="nfts">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {creator.nfts.map((nft) => (
                  <div
                    key={nft.id}
                    className="rounded-xl border bg-card/80 backdrop-blur-sm overflow-hidden group hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                      <Image
                        src={nft.image || "/placeholder.svg"}
                        alt={nft.name}
                        width={200}
                        height={200}
                        className="w-full aspect-square object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-0"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-violet-600/5 to-cyan-500/5">
                      <h3 className="font-medium truncate">{nft.name}</h3>
                      <p className="text-sm bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-cyan-500 font-semibold">
                        {nft.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="subscribers">
              {creator.isSubscribed ? (
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-xl border bg-card/80 backdrop-blur-sm p-6 shadow-lg shadow-violet-500/5">
                    <h3 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-cyan-500">
                      Subscriber Community
                    </h3>
                    <div className="grid gap-3">
                      {creator.subscribers.map((subscriber) => (
                        <div
                          key={subscriber.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-violet-500/5 transition-all duration-300"
                        >
                          <Avatar className="h-10 w-10 border-2 border-violet-500/20">
                            <AvatarImage src={subscriber.avatar} alt={subscriber.name} />
                            <AvatarFallback className="bg-gradient-to-br from-violet-600 to-cyan-500 text-white">
                              {subscriber.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{subscriber.name}</p>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                subscriber.tier === "premium"
                                  ? "border-violet-500/30 text-violet-500 bg-violet-500/10"
                                  : subscriber.tier === "exclusive"
                                    ? "border-amber-500/30 text-amber-500 bg-amber-500/10"
                                    : "border-blue-500/30 text-blue-500 bg-blue-500/10"
                              }`}
                            >
                              {subscriber.tier}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border bg-card/80 backdrop-blur-sm p-6 shadow-lg shadow-violet-500/5">
                    <h3 className="text-xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-cyan-500">
                      Your Subscription
                    </h3>
                    <Badge className="mb-4 bg-gradient-to-r from-violet-600 to-cyan-500 text-white border-0">
                      {creator.subscriptionTier}
                    </Badge>
                    <p className="text-muted-foreground mb-6">
                      You have access to all exclusive content from this creator
                    </p>
                    <div className="space-y-4">
                      <div className="rounded-lg border border-violet-500/20 p-4 bg-gradient-to-r from-violet-600/5 to-cyan-500/5">
                        <h4 className="font-medium">Subscription Benefits</h4>
                        <ul className="mt-2 space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            </div>
                            <span>Access to all exclusive posts</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            </div>
                            <span>Early access to NFT drops</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            </div>
                            <span>Community chat access</span>
                          </li>
                        </ul>
                      </div>
                      <Button variant="outline" className="w-full border-violet-500/20">
                        Manage Subscription
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border bg-card/80 backdrop-blur-sm p-6 text-center shadow-lg shadow-violet-500/5">
                  <h3 className="text-xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-cyan-500">
                    Exclusive Content for Subscribers
                  </h3>
                  <p className="text-muted-foreground mb-6">Subscribe to access exclusive content from this creator</p>
                  <div className="max-w-md mx-auto grid gap-4">
                    <div className="rounded-lg border border-violet-500/20 p-4 flex justify-between items-center bg-gradient-to-r from-violet-600/5 to-cyan-500/5 hover:from-violet-600/10 hover:to-cyan-500/10 transition-all duration-300 hover:shadow-md hover:shadow-violet-500/10">
                      <div>
                        <h4 className="font-medium">Monthly Subscription</h4>
                        <p className="text-sm text-muted-foreground">0.05 ETH per month</p>
                      </div>
                      <Button className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white border-0">
                        Subscribe
                      </Button>
                    </div>
                    <div className="rounded-lg border border-violet-500/20 p-4 flex justify-between items-center bg-gradient-to-r from-violet-600/5 to-cyan-500/5 hover:from-violet-600/10 hover:to-cyan-500/10 transition-all duration-300 hover:shadow-md hover:shadow-violet-500/10">
                      <div>
                        <h4 className="font-medium">Annual Subscription</h4>
                        <p className="text-sm text-muted-foreground">0.5 ETH per year</p>
                        <p className="text-xs text-violet-500">Save 17%</p>
                      </div>
                      <Button className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white border-0">
                        Subscribe
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

