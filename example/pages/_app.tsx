import "../styles/globals.css"

import {
  ChainInfoID,
  WalletManagerProvider,
  WalletType,
} from "@gssuper/cosmodal"
import type { AppProps } from "next/app"
import { FunctionComponent } from "react"
import { GasPrice } from "@cosmjs/stargate"

const LOCAL_STORAGE_KEY = "connectedWalletId"
const web3AuthWalletOptions = {
  client: {
    clientId: "example",
    web3AuthNetwork: "testnet",
  },
  promptSign: () => confirm("Sign this transaction?"),
}

const MyApp: FunctionComponent<AppProps> = ({ Component, pageProps }) => (
  <WalletManagerProvider
    walletConnectClientMeta={{
      name: "CosmodalExampleDApp",
      description: "A dApp using the @gssuper/cosmodal library.",
      url: "https://cosmodal-gssuper.vercel.app/",
      icons: ["https://moonphase.is/image.svg"],
    }}
    enabledWalletTypes={[
      WalletType.Leap,
      WalletType.Keplr,
      WalletType.KeplrMobile,
      WalletType.Google,
      WalletType.Apple,
      WalletType.Discord,
      WalletType.Twitter,
    ]}
    defaultUiConfig={{
      renderLoader: () => <p>Loading...</p>,
    }}
    localStorageKey={LOCAL_STORAGE_KEY}
    defaultChainId={ChainInfoID.Juno1}
    getSigningCosmWasmClientOptions={(chainInfo) => ({
      gasPrice: GasPrice.fromString(
        "0.0025" + chainInfo.feeCurrencies[0].coinMinimalDenom
      ),
    })}
    getSigningStargateClientOptions={(chainInfo) => ({
      gasPrice: GasPrice.fromString(
        "0.0025" + chainInfo.feeCurrencies[0].coinMinimalDenom
      ),
    })}
    walletOptions={{
      [WalletType.Google]: web3AuthWalletOptions,
      [WalletType.Apple]: web3AuthWalletOptions,
      [WalletType.Discord]: web3AuthWalletOptions,
      [WalletType.Twitter]: web3AuthWalletOptions,
    }}
    // Choose a different RPC node for the desired chain.
    // chainInfoOverrides={[
    //   {
    //     ...ChainInfoMap[ChainInfoID.Juno1],
    //     rpc: "https://another.rpc.com",
    //   }
    // ]}
  >
    <Component {...pageProps} />
  </WalletManagerProvider>
)

export default MyApp
