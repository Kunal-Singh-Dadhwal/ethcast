"use client"
import { useState, useRef } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { useWallet } from '@/context/WalletContext'; // Import the wallet hook
import { pinContentToIPFS, pinJSONToIPFS, PostMetadata } from '@/services/pinata';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ImageIcon, Send, Eye, Lock } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { toast } from '@/components/ui/use-toast';

export function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  
  // Use wallet context with correct property names from WalletContext.tsx
  const { 
    walletAddress,   // Changed from address: walletAddress
    connected,       // Changed from isConnected
    connectMetaMask,
    connectPhantom,
    walletType
  } = useWallet();
  
  // Use Web3 context only for blockchain transactions
  const { publishFreeContent, publishPaidContent } = useWeb3();
  
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [postType, setPostType] = useState<"free" | "paid">("free");
  const [price, setPrice] = useState<string>('0.01');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !walletAddress) {  // Changed from isConnected
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to continue.",
        variant: "destructive"
      });
      return;
    }

    // For this example, we'll only work with MetaMask
    if (walletType !== 'metamask') {
      toast({
        title: "Invalid wallet type",
        description: "Please connect with MetaMask to publish content on Ethereum.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      setIsUploading(true);
      setUploadProgress(10);
      setCurrentStep("Preparing content");

      // Step 1: Upload media to IPFS if present
      let mediaIpfsHash = null;
      if (selectedMedia) {
        setCurrentStep("Uploading media to IPFS");
        setUploadProgress(20);
        
        try {
          mediaIpfsHash = await pinContentToIPFS(selectedMedia, mediaType);
          console.log("Media uploaded to IPFS:", mediaIpfsHash);
          setUploadProgress(35);
        } catch (error) {
          console.error("Media upload failed:", error);
          toast({ 
            title: "Media upload failed",
            description: "Continuing with content only",
            variant: "destructive"
          });
        }
      }

      // Step 2: Upload content to IPFS
      setCurrentStep("Uploading content to IPFS");
      setUploadProgress(50);
      
      let contentIpfsHash;
      try {
        contentIpfsHash = await pinContentToIPFS(content);
        console.log("Content uploaded to IPFS:", contentIpfsHash);
      } catch (error) {
        console.error("Content upload failed:", error);
        throw new Error("Failed to upload content to IPFS");
      }

      // Step 3: Create and upload metadata
      setCurrentStep("Creating metadata");
      setUploadProgress(70);
      
      const metadata: PostMetadata = {
        title,
        author: walletAddress,
        timestamp: Date.now(),
        contentHash: contentIpfsHash,
        mediaIpfsHash: mediaIpfsHash || undefined,
        mediaUrl: selectedMedia || undefined,
        mediaType: mediaType || undefined
      };

      let metadataIpfsHash;
      try {
        metadataIpfsHash = await pinJSONToIPFS(metadata);
        console.log("Metadata uploaded to IPFS:", metadataIpfsHash);
      } catch (error) {
        console.error("Metadata upload failed:", error);
        throw new Error("Failed to upload metadata to IPFS");
      }

      // Step 4: Prepare data structure for blockchain
      setCurrentStep("Preparing blockchain transaction");
      setUploadProgress(80);
      
      // Include actual content for easier access on frontend, but still reference IPFS hashes
      const postData = JSON.stringify({
        content: content.substring(0, 100) + (content.length > 100 ? "..." : ""), // Short preview
        contentHash: contentIpfsHash,
        metadataHash: metadataIpfsHash
      });

      // Step 5: Publish to blockchain
      setCurrentStep(postType === "free" ? "Publishing free content" : "Publishing paid content");
      setUploadProgress(90);
      setIsUploading(false);
      
      toast({
        title: "Confirm transaction",
        description: "Please confirm the transaction in your wallet",
        duration: 5000
      });

      // Publish based on post type
      let transaction;
      if (postType === "free") {
        transaction = await publishFreeContent(postData);
      } else {
        transaction = await publishPaidContent(postData, price);
      }

      console.log("Transaction result:", transaction);
      setUploadProgress(100);
      setCurrentStep("Published successfully");

      toast({
        title: "Post published!",
        description: "Your content has been successfully published to the blockchain.",
      });

      // Reset form
      setTitle('');
      setContent('');
      setSelectedMedia(null);
      setMediaType(null);
      setPrice('0.01');
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Failed to publish post",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsUploading(false);
      setUploadProgress(null);
      setCurrentStep(null);
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
    setPostType((prev) => (prev === "free" ? "paid" : "free"));
  };

  return (
    <motion.div
      className="rounded-xl border bg-card/80 backdrop-blur-sm p-4 shadow-lg shadow-violet-500/5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {!connected && (  // Changed from isConnected
        <div className="space-y-4 mb-6">
          <div className="text-center text-lg font-medium mb-4">
            Connect your wallet to post content
          </div>
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              onClick={connectMetaMask}
              className="flex items-center gap-2"
            >
              <Image src="/metamask-logo.svg" alt="MetaMask" width={24} height={24} />
              Connect MetaMask
            </Button>
            <Button 
              variant="outline" 
              onClick={connectPhantom}
              className="flex items-center gap-2"
            >
              <Image src="/phantom-logo.svg" alt="Phantom" width={24} height={24} />
              Connect Phantom
            </Button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={!connected || isLoading || walletType !== 'metamask'}  // Changed from isConnected
          className="border-violet-500/20"
        />
        <Textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={!connected || isLoading}  // Changed from isConnected
          className="min-h-[100px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 bg-transparent text-lg"
        />
        {selectedMedia && (
          <div className="mt-4">
            {mediaType === "image" ? (
              <Image src={selectedMedia} alt="Selected" width={500} height={300} className="rounded-lg object-cover" />
            ) : (
              <video controls width="500" className="rounded-lg">
                <source src={selectedMedia} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        )}
        {uploadProgress !== null && (
          <div className="w-full space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{currentStep}</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-violet-500 to-cyan-500 h-full transition-all duration-300 ease-in-out" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-2 items-center">
            <Button
              type="button"
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
              type="button"
              variant="outline"
              size="sm"
              onClick={togglePostType}
              className="rounded-full border-violet-500/20 flex gap-2 items-center"
            >
              {postType === "free" ? (
                <>
                  <Eye className="h-4 w-4 text-green-500" />
                  <span>Free Post</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 text-amber-500" />
                  <span>Paid Content</span>
                </>
              )}
            </Button>
          </div>
          
          {postType === "paid" && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Price (ETH):</span>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={isLoading}
                className="w-24 h-8 text-sm"
                min="0.001"
                step="0.001"
              />
            </div>
          )}
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              disabled={!connected || isLoading || !title || !content}  // Changed from isConnected
              className="relative overflow-hidden group bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white border-0"
            >
              <div className="absolute -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
              {isLoading ? (
                currentStep ? currentStep : 'Publishing...'
              ) : (
                <><Send className="mr-2 h-4 w-4" />Publish</>
              )}
            </Button>
          </motion.div>
        </div>
        
        {!connected && (  // Changed from isConnected
          <div className="mt-2 text-center text-sm text-amber-500">
            Please connect your wallet to publish content
          </div>
        )}
        {connected && walletType !== 'metamask' && (  // Changed from isConnected
          <div className="mt-2 text-center text-sm text-amber-500">
            Please connect with MetaMask to publish content on Ethereum.
          </div>
        )}
      </form>
    </motion.div>
  );
}