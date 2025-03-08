import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import { Solcast } from '../target/types/solcast'

describe('solcast', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Solcast as Program<Solcast>

  const solcastKeypair = Keypair.generate()

  it('Initialize Solcast', async () => {
    await program.methods
      .initialize()
      .accounts({
        solcast: solcastKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([solcastKeypair])
      .rpc()

    const currentCount = await program.account.solcast.fetch(solcastKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Solcast', async () => {
    await program.methods.increment().accounts({ solcast: solcastKeypair.publicKey }).rpc()

    const currentCount = await program.account.solcast.fetch(solcastKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Solcast Again', async () => {
    await program.methods.increment().accounts({ solcast: solcastKeypair.publicKey }).rpc()

    const currentCount = await program.account.solcast.fetch(solcastKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Solcast', async () => {
    await program.methods.decrement().accounts({ solcast: solcastKeypair.publicKey }).rpc()

    const currentCount = await program.account.solcast.fetch(solcastKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set solcast value', async () => {
    await program.methods.set(42).accounts({ solcast: solcastKeypair.publicKey }).rpc()

    const currentCount = await program.account.solcast.fetch(solcastKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the solcast account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        solcast: solcastKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.solcast.fetchNullable(solcastKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
