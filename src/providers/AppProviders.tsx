"use client";
import { ReactNode } from 'react';
import { WalletProvider } from '@/context/WalletContext';
import { Web3Provider } from '@/context/Web3Context';

interface AppProvidersProps {
  children: ReactNode;
  contractAddress: string;
}

export function AppProviders({ children, contractAddress }: AppProvidersProps) {
  return (
    <WalletProvider>
      <Web3Provider contractAddress={contractAddress}>
        {children}
      </Web3Provider>
    </WalletProvider>
  );
}
