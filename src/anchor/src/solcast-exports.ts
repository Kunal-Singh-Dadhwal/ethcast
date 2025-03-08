// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import SolcastIDL from '../target/idl/solcast.json'
import type { Solcast } from '../target/types/solcast'

// Re-export the generated IDL and type
export { Solcast, SolcastIDL }

// The programId is imported from the program IDL.
export const SOLCAST_PROGRAM_ID = new PublicKey(SolcastIDL.address)

// This is a helper function to get the Solcast Anchor program.
export function getSolcastProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...SolcastIDL, address: address ? address.toBase58() : SolcastIDL.address } as Solcast, provider)
}

// This is a helper function to get the program ID for the Solcast program depending on the cluster.
export function getSolcastProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Solcast program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return SOLCAST_PROGRAM_ID
  }
}
