UCS04 - Universal Chain ID
==========================

Chain IDs as reported by chains themselves are unfortunately not universally unique. For example, ID `1` is used for both Ethereum and Aptos.

To disambiguate, UCS04 defines `universal_chain_id` as `<chain_family_name>.<chain_id>`. `<chain_family_name>` is hard to formally define. It loosely means “The short lowercase display name of the mainnet of the network”.

These IDs are used across all Union products. In addition to disambiguation, they have the additional advantage that chains are easier to recognize in logs, chats, and config files.

[Universal Chain IDs](#universal-chain-ids)
-------------------------------------------

This is a list of all `universal_chain_id`s currently recognized by Union. To add yours, [open a PR for the `universal-chain-ids.json`](https://github.com/unionlabs/union/blob/main/deployments/universal-chain-ids.json).

### aptos

*   `aptos.1`
*   `aptos.2`

### arbitrum

*   `arbitrum.421614`

### bob

*   `bob.60808`
*   `bob.808813`

### babylon

*   `babylon.bbn-1`
*   `babylon.bbn-test-5`

### berachain

*   `berachain.80069`
*   `berachain.80084`
*   `berachain.80094`

### corn

*   `corn.21000000`
*   `corn.21000001`

### ethereum

*   `ethereum.11155111`
*   `ethereum.17000`
*   `ethereum.1`

### movement

*   `movement.250`

### osmosis

*   `osmosis.osmo-test-5`

### scroll

*   `scroll.534351`

### stargaze

*   `stargaze.elgafar-1`

### stride

*   `stride.stride-internal-1`

### union

*   `union.union-testnet-8`
*   `union.union-testnet-9`
*   `union.union-testnet-10`
*   `union.union-1`

### xion

*   `xion.xion-testnet-2`
*   `xion.xion-mainnet-1`

### sei

*   `sei.pacific-1`
*   `sei.atlantic-2`
*   `sei.1328`
*   `sei.1329`

### bsc

*   `bsc.56`
*   `bsc.97`
