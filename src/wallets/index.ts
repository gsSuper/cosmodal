import { Wallet } from "../types"
import { wallets as keplrWallets } from "./keplr"
import { wallets as leapWallets } from "./leap"
import { wallets as walletconnectWallets } from "./walletconnect"
// import { wallets as web3AuthWallets } from "./web3auth"

export const WALLETS: Wallet[] = [
  ...keplrWallets,
  ...leapWallets,
  ...walletconnectWallets,
  // ...web3AuthWallets,
]
