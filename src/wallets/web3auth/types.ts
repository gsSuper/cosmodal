import { AminoSignResponse, StdSignDoc } from "@cosmjs/amino"
import { AccountData, DirectSignResponse } from "@cosmjs/proto-signing"
import { Ecies } from "@toruslabs/eccrypto"
import { OPENLOGIN_NETWORK_TYPE } from "@toruslabs/openlogin"
import { Web3AuthNoModalOptions } from "@web3auth/no-modal"
import { SignDoc } from "cosmjs-types/cosmos/tx/v1beta1/tx"

export type Web3AuthClientOptions = {
  // Web3Auth client options.
  client: {
    clientId: string
    web3AuthNetwork: OPENLOGIN_NETWORK_TYPE
  } & Web3AuthNoModalOptions

  // Mobile devices block popups by default, so the default behavior is to use
  // the redirect method to sign-in on mobile, and the popup method on desktop.
  // The popup is safer, but mobile browsers tend to have less extensions (and
  // browser extensions are the main security concern for the redirect method).
  // Forcing popup means that the popup method will be used on mobile as well.
  forcePopup?: boolean

  // Function to prompt the user to sign a transaction.
  promptSign: PromptSign
}

export type PromptSign = (
  signerAddress: string,
  data: SignData
) => Promise<boolean>

export type SignData =
  | {
      type: "direct"
      value: SignDoc
    }
  | {
      type: "amino"
      value: StdSignDoc
    }

// Message the worker expects to receive.
export type ToWorkerMessage =
  | {
      type: "init_1"
      payload: {
        publicKey: string
      }
    }
  | {
      type: "init_2"
      payload: {
        encryptedPrivateKey: Ecies
      }
    }
  | {
      type: "request_accounts"
      payload: {
        id: number
        chainBech32Prefix: string
      }
    }
  | {
      type: "request_sign"
      payload: {
        id: number
        signerAddress: string
        chainBech32Prefix: string
        data: SignData
      }
      signature: Uint8Array
    }

// Message the worker sends to the main thread.
export type FromWorkerMessage =
  | {
      type: "ready_1"
      payload: {
        encryptedPublicKey: Ecies
      }
    }
  | {
      type: "ready_2"
    }
  | {
      type: "init_error"
      payload: {
        error: string
      }
    }
  | {
      type: "accounts"
      payload: {
        id: number
        response:
          | {
              type: "success"
              accounts: AccountData[]
            }
          | {
              type: "error"
              error: string
            }
      }
      signature: Uint8Array
    }
  | {
      type: "sign"
      payload: {
        id: number
        response:
          | {
              type: "error"
              value: string
            }
          | {
              type: "direct"
              value: DirectSignResponse
            }
          | {
              type: "amino"
              value: AminoSignResponse
            }
      }
      signature: Uint8Array
    }
