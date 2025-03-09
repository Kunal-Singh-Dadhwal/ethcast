"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface WalletContextType {
  connected: boolean
  walletAddress: string
  walletType: "metamask" | "phantom" | null
  hasMetaMask: boolean    // Add this property
  hasPhantom: boolean     // Add this property
  connectMetaMask: () => Promise<void>
  connectPhantom: () => Promise<void>
  disconnectWallet: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [walletType, setWalletType] = useState<"metamask" | "phantom" | null>(null)
  const [hasMetaMask, setHasMetaMask] = useState(false)  // Add state for wallet detection
  const [hasPhantom, setHasPhantom] = useState(false)    // Add state for wallet detection

  useEffect(() => {
    // Check if wallets are installed
    const isMetaMaskInstalled = typeof window !== 'undefined' && !!window.ethereum
    const isPhantomInstalled = typeof window !== 'undefined' && !!window.solana?.isPhantom
    
    setHasMetaMask(isMetaMaskInstalled)
    setHasPhantom(isPhantomInstalled)
    
    checkWalletConnections()
  }, [])

  const checkWalletConnections = async () => {
    const isMetaMaskInstalled = typeof window !== 'undefined' && window.ethereum
    const isPhantomInstalled = typeof window !== 'undefined' && window.solana?.isPhantom
    
    if (isMetaMaskInstalled) {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      if (accounts.length > 0) {
        setWalletAddress(accounts[0])
        setConnected(true)
        setWalletType("metamask")
      }
    }
    
    if (isPhantomInstalled && window.solana.isConnected) {
      const publicKey = window.solana.publicKey?.toString()
      if (publicKey) {
        setWalletAddress(publicKey)
        setConnected(true)
        setWalletType("phantom")
      }
    }
  }

  const connectMetaMask = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!")
        return
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      setWalletAddress(accounts[0])
      setConnected(true)
      setWalletType("metamask")

      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0])
        } else {
          disconnectWallet()
        }
      })
    } catch (error) {
      console.error("Error connecting to MetaMask:", error)
    }
  }

  const connectPhantom = async () => {
    try {
      if (!window.solana || !window.solana.isPhantom) {
        alert("Please install Phantom wallet!")
        return
      }

      const response = await window.solana.connect()
      setWalletAddress(response.publicKey.toString())
      setConnected(true)
      setWalletType("phantom")

      window.solana.on('accountChanged', () => {
        if (!window.solana.isConnected) {
          disconnectWallet()
        }
      })
    } catch (error) {
      console.error("Error connecting to Phantom:", error)
    }
  }

  const disconnectWallet = async () => {
    if (walletType === "phantom" && window.solana) {
      await window.solana.disconnect()
    }
    setWalletAddress("")
    setConnected(false)
    setWalletType(null)
  }

  return (
    <WalletContext.Provider value={{
      connected,
      walletAddress,
      walletType,
      hasMetaMask,      // Add to provider value
      hasPhantom,       // Add to provider value
      connectMetaMask,
      connectPhantom,
      disconnectWallet
    }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}