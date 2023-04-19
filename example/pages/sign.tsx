import { makeSignDoc } from "@cosmjs/amino"
import {
  WalletConnectionStatus,
  useWallet,
  useWalletManager,
  ChainInfoID,
} from "@gssuper/cosmodal"
import type { NextPage } from "next"
import { useCallback, useState } from "react"

const Home: NextPage = () => {
  const { connect, disconnect } = useWalletManager()
  const {
    status: walletStatus,
    error,
    name,
    address,
    publicKey,
    walletClient,
  } = useWallet()

  const [type, setType] = useState("")
  const [data, setData] = useState("")
  const [status, setStatus] = useState("")

  const sign = useCallback(async () => {
    if (!address || !walletClient) return

    setStatus("Loading...")

    const offlineSignerAmino = await walletClient.getOfflineSignerOnlyAmino(
      ChainInfoID.Juno1
    )

    try {
      // Parse message.
      const dataObject = JSON.parse(data)

      const signDocAmino = makeSignDoc(
        [
          {
            type,
            value: {
              signer: address,
              data: JSON.stringify(dataObject, undefined, 2),
            },
          },
        ],
        {
          gas: "0",
          amount: [
            {
              denom: "ujuno",
              amount: "0",
            },
          ],
        },
        ChainInfoID.Juno1,
        "",
        0,
        0
      )
      const {
        signature: { signature },
      } = await offlineSignerAmino.signAmino(address, signDocAmino)

      setStatus(`Signature: ${signature}`)
    } catch (err) {
      console.error(err)
      setStatus(`Error: ${err instanceof Error ? err.message : `${err}`}`)
    }
  }, [address, type, data, walletClient])

  return (
    <div className="absolute top-0 right-0 left-0 bottom-0 flex justify-center items-center">
      <div className="flex flex-col items-stretch gap-2 max-w-[90vw] max-h-[90vh]">
        {walletStatus === WalletConnectionStatus.Connected ? (
          <>
            <p>
              Name: <b>{name}</b>
            </p>
            <p>
              Address: <b>{address}</b>
            </p>
            <p>
              Public key: <b>{publicKey?.hex ?? "<empty>"}</b>
            </p>
            <button
              onClick={disconnect}
              className="px-3 py-2 rounded-md border border-gray bg-gray-200 hover:opacity-70"
            >
              Disconnect
            </button>

            <h1 className="text-lg mt-4">Type</h1>
            <input
              type="text"
              placeholder="Type"
              className="px-4 py-2 rounded-md outline"
              value={type}
              onChange={(event) => setType(event.target.value)}
            />

            <h2 className="text-lg mt-2">Data</h2>
            <textarea
              className="p-4 rounded-md outline font-mono"
              rows={10}
              value={data}
              onChange={(event) => setData(event.target.value)}
            />

            <button
              onClick={sign}
              className="px-3 py-2 rounded-md border border-gray bg-gray-200 hover:opacity-70 mt-4"
            >
              Sign
            </button>

            {status && (
              <pre className="overflow-scroll text-xs mt-2">{status}</pre>
            )}
          </>
        ) : (
          <>
            <button
              onClick={connect}
              className="px-3 py-2 rounded-md border border-gray bg-gray-200 hover:opacity-70"
            >
              Connect
            </button>
            {error ? (
              <p>{error instanceof Error ? error.message : `${error}`}</p>
            ) : undefined}
          </>
        )}
      </div>
    </div>
  )
}

export default Home
