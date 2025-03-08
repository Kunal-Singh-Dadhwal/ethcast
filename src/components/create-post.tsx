"use client"
import { useState, useRef } from 'react';
import { useWallet } from '@/context/WalletContext';
import { pinContentToIPFS, pinJSONToIPFS, PostMetadata } from '@/services/pinata';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ImageIcon, Send, Eye, Lock } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { connected, walletAddress } = useWallet();
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [postType, setPostType] = useState<"preview" | "full">("full");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !walletAddress) return;

    try {
      setIsLoading(true);

      // Pin content to IPFS
      const contentHash = await pinContentToIPFS(content);

      // Create and pin metadata
      const metadata: PostMetadata = {
        title,
        author: walletAddress,
        walletAddress,
        timestamp: Date.now(),
        contentHash
      };

      const metadataHash = await pinJSONToIPFS(metadata);

      // Here you would call your Solana program to store the metadataHash
      // await program.methods.createPost(...)

      setTitle('');
      setContent('');
      setSelectedMedia(null);
      setMediaType(null);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsLoading(false);
    }
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

  const togglePostType = () => {
    setPostType((prev) => (prev === "full" ? "preview" : "full"));
  };

  return (
    <motion.div
      className="rounded-xl border bg-card/80 backdrop-blur-sm p-4 shadow-lg shadow-violet-500/5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={!connected || isLoading}
        />
        <Textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={!connected || isLoading}
          className="min-h-[100px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 bg-transparent text-lg"
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
              type="submit"
              disabled={!connected || isLoading || !title || !content}
              className="relative overflow-hidden group bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white border-0"
            >
              <div className="absolute -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
              {isLoading ? 'Posting...' : <><Send className="mr-2 h-4 w-4" />Post</>}
            </Button>
          </motion.div>
        </div>
      </form>
    </motion.div>
  );
}