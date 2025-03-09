import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { WalletProvider } from "@/context/WalletContext"
import { Web3Provider } from "@/context/Web3Context"

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
          <Web3Provider contractAddress={CONTRACT_ADDRESS}>
              {children}
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  )
}