'use client'

import * as React from 'react'
import {
  GetSiweMessageOptions,
  RainbowKitSiweNextAuthProvider,
} from '@rainbow-me/rainbowkit-siwe-next-auth'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { Chain, RainbowKitProvider, connectorsForWallets, darkTheme } from '@rainbow-me/rainbowkit'
import {
  metaMaskWallet,
  trustWallet,
  coinbaseWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { arbitrumSepolia, arbitrum, hardhat } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

const publicProviderAIA = process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL

const arbitrumTestnet: Chain = {
  id: 1_320,
  name: 'ArbitrumTestnet',
  network: 'arbtrumTestnet',
  iconUrl: 'https://testnet.aiascan.com/static/logo-dark-placeholder.svg',
  iconBackground: '#000000',
  nativeCurrency: {
    decimals: 18,
    name: 'Arb',
    symbol: 'ARB',
  },
  rpcUrls: {
    public: { http: ['https://sepolia-rollup.arbitrum.io/rpc'] },
    default: { http: ['https://sepolia-rollup.arbitrum.io/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Arbitrum sepolia Block Explorer', url: 'https://sepolia-explorer.arbitrum.io/' },
    etherscan: { name: 'Arbitrum sepolia Block Explorer', url: 'https://sepolia-explorer.arbitrum.io/' },
  },
  testnet: true,
} 

const { chains, publicClient } = configureChains(
  [arbitrumSepolia, arbitrum],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID as string }), publicProvider()]
)

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      coinbaseWallet({ appName: 'Coinbase', chains }),
      rainbowWallet({ projectId, chains }),
    ],
  },
])

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

const demoAppInfo = {
  appName: 'LetsFunds dApp',
}

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: `
  Once you're signed in, you'll be able to access all of our dApp's features.
  Thank you for partnering with CrowdFunding!`,
})

export function Providers({
  children,
  pageProps,
}: {
  children: React.ReactNode
  pageProps: {
    session: Session
  }
}) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  return (
    <WagmiConfig config={wagmiConfig}>
      <SessionProvider refetchInterval={0} session={pageProps.session}>
        <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
          <RainbowKitProvider theme={darkTheme()} chains={chains} appInfo={demoAppInfo}>
            {mounted && children}
          </RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
      </SessionProvider>
    </WagmiConfig>
  )
}
