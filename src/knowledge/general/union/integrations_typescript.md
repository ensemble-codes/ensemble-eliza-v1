TypeScript SDK
==============

[Installation](#installation)
-----------------------------

*   [bun](#tab-panel-10)
*   [pnpm](#tab-panel-11)
*   [npm](#tab-panel-12)
*   [yarn](#tab-panel-13)

    bun add @unionlabs/client

    pnpm add @unionlabs/client

    npm install @unionlabs/client

    yarn add @unionlabs/client

The Union Client is TypeScript-first and framework agnostic. At [app.union.build](https://app.union.build) we use [Svelte](https://svelte.dev) but you can use any framework or no frameworks at all. If you’re a [React](https://reactjs.org) developer, [checkout this demo on Stackblitz](https://stackblitz.com/edit/github-nav3yr-xbanxq?file=src%2Fapp.tsx).

Note

If you need testnet tokens for testing, visit [https://app.union.build/faucet](https://app.union.build/faucet) and do some shopping.

[Client Initialization](#client-initialization)
-----------------------------------------------

*   [EVM Based Client](#tab-panel-5)
*   [Cosmos Based Client](#tab-panel-6)
*   [Multi-Chain Client](#tab-panel-7)

    import { privateKeyToAccount } from "viem/accounts"import { createUnionClient, http } from "@unionlabs/client"
    const client = createUnionClient({  chainId: "80084",EvmClientParameters.chainId: "11155111" | "534351" | "421614" | "80084"  transport: http("https://bartio.rpc.berachain.com"),  account: privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`),})

    import {  http,  hexToBytes,  createUnionClient,} from "@unionlabs/client"import { DirectSecp256k1Wallet } from "@cosmjs/proto-signing"
    const PRIVATE_KEY = process.env["PRIVATE_KEY"]if (!PRIVATE_KEY) throw new Error("Private key not found")
    const account = await DirectSecp256k1Wallet.fromKey(  Uint8Array.from(hexToBytes(PRIVATE_KEY)),  "stride")
    const client = createUnionClient({  account,  chainId: "stride-internal-1",  transport: http("stride.testnet-1.stridenet.co"),})

    import {  http,  hexToBytes,  createMultiUnionClient} from "@unionlabs/client"import { privateKeyToAccount } from "viem/accounts"import { DirectSecp256k1Wallet } from "@cosmjs/proto-signing"
    const PRIVATE_KEY = process.env["PRIVATE_KEY"]if (!PRIVATE_KEY) throw new Error("Private key not found")
    const clients = createMultiUnionClient([  {    chainId: "80084",    transport: http("https://bartio.rpc.berachain.com"),    account: privateKeyToAccount(`0x${PRIVATE_KEY}`),  },  {    chainId: "stride-internal-1",    transport: http("stride.testnet-1.stridenet.co"),    account: await DirectSecp256k1Wallet.fromKey(      Uint8Array.from(hexToBytes(PRIVATE_KEY)),      "stride"    ),  }])

[Transferring Assets](#transferring-assets)
-------------------------------------------

We will transfer 1 [`HONEY`](https://bartio.beratrail.io/token/0x0E4aaF1351de4c0264C5c7056Ef3777b41BD8e03) from [**Berachain bArtio**](https://www.berachain.com) to [**Stride Testnet**](https://stride.zone).

You have the option to trigger the approval transaction manually by setting `autoApprove` to `false` then calling `.approveTransaction` before calling `.transferAsset`.

*   [main.ts](#tab-panel-8)
*   [client.ts](#tab-panel-9)

    import { unionClient } from "./client.ts"import type { TransferAssetsParameters } from "@unionlabs/client"
    const transferPayload = {  amount: 1n,  autoApprove: false,  // ^ we will approve manually for this example  destinationChainId: "stride-internal-1",  receiver: "stride17ttpfu2xsmfxu6shl756mmxyqu33l5ljegnwps",  denomAddress: "0x0E4aaF1351de4c0264C5c7056Ef3777b41BD8e03",  // ^ HONEY contract address} satisfies TransferAssetsParameters<"80084">
    const approval = await unionClient.approveTransaction(transferPayload)
    if (approval.isErr()) {  console.error(approval.error)  process.exit(1)}
    console.info(`Approval hash: ${approval.value}`)
    const transfer = await unionClient.transferAsset(transferPayload)
    if (transfer.isErr()) {  console.error(transfer.error)  process.exit(1)}
    console.info(`Transfer hash: ${transfer.value}`)

    import { privateKeyToAccount } from "viem/accounts"import { createUnionClient, http } from "@unionlabs/client"
    let PRIVATE_KEY = process.env["PRIVATE_KEY"]if (!PRIVATE_KEY) throw new Error("PRIVATE_KEY is not set")
    export const unionClient = createUnionClient({  chainId: "80084",  account: privateKeyToAccount(`0x${PRIVATE_KEY}`),  transport: http("https://bartio.rpc.berachain.com")})

Run the above example

*   [bun](#tab-panel-14)
*   [pnpm](#tab-panel-15)
*   [npm](#tab-panel-16)
*   [yarn](#tab-panel-17)

    PRIVATE_KEY="" bun x tsx main.ts

    PRIVATE_KEY="" pnpm dlx tsx main.ts

    PRIVATE_KEY="" npm x tsx main.ts

    PRIVATE_KEY="" yarn dlx tsx main.ts
