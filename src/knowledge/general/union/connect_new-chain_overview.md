Connect a new Chain
===================

If your chain is not yet [connected to Union](/protocol/chains/overview/), then you can permissionlessly add support. Union supports L1s, L2s, L3s, and Rollups. All you need is a VM. We currently support EVM, CosmWasm, and Move. The steps to connect are simple:

Note

Below is an overview of the steps involved in connecting a new chain. **For Testnet 9 new connections are initially created by Union Labs.** Soon these docs will be updated with more details so that anyone can open connections.

If you want to get connected, just ensure your chain has a EVM/CosmWasm/Move VM and send us a message, we’ll open the connection for you.

1.  Upload `ibc-union` and `light-client` contracts
    
    This means deploying and initializing both the [`ibc-union`](https://github.com/unionlabs/union/tree/ab76fd72e114a2b8db8ad469dc587aec865e2095/cosmwasm/ibc-union/core) contract and the respective light clients for the chain you’re trying to connect. You will then need to deploy the CometBLS light client on your chain as well as the respective light client of your chain on Union. Union has implementations the following [light clients](https://github.com/unionlabs/union/tree/main/cosmwasm/ibc-union/light-clients):
    
    *   Arbitrum (CosmWasm)
    *   Berachain (CosmWasm)
    *   CometBLS (Solidity, CosmWasm)
    *   Ethereum (CosmWasm)
    *   Linea (CosmWasm)
    *   Movement (CosmWasm)
    *   Scroll (CosmWasm)
    *   Tendermint (a.k.a. CometBFT) (CosmWasm)
2.  Configure the [Voyager](/architecture/voyager/overview) relayer
    
    You’ll need to either use or create a Voyager instance that supports your relaying needs.
    
3.  Open the connection
    
    With Voyager and the contracts in place, you can begin the connection ceremony. Assuming Voyager is tracking both Union and your chain, you will only need to send a `connection_open_init` message to accomplish this.
    
    If Voyager is not already tracking both chains, you will need to submit the remainder of the connection ceremony messages.
    
4.  Open a channel
    
    With a connection established, you will need to open a channel on the connection before sending messages between Union and your chain.
    
5.  Send assets and data
    
    With a channel open, you can now send assets and data between chains. Start by manually submitting transfer messages or see our other connect tutorials to send assets or data with your own apps.
    