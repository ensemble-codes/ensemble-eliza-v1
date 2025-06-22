Overview
========

### [Identifier](#identifier)

Each channel has a `connection-id` and `channel-id`, uniquely identifying the channel on that specific chain. Note that these identifiers are not globally unique, such that two chains can both have channels with IDs `(10, 2)`. This does not mean that, since the IDs are the same, these channels are connected to each other.

### [Status](#status)

A channel goes through different states referred to as status: `INIT`, `TRY`, `ACK`, and `CONFIRM`. Unless you are opening channels yourself, you only need to concern yourself with the `CONFIRM` state, which means the channel can now relay messages and assets.

### [version](#version)

Channels serve different protocol types, indicated by their `version`. These can be fully custom, although most of the time they will be one of the enshrined types (such as [`ucs03-zkgm-0`](/protocol/channels/ucs03-zkgm)). In other cases, they can be fully custom, like

    {  "version": "ics27-1",  "controller_connection_id": "connection-0",  "host_connection_id": "connection-28",  "address": "union1k8c7ks99ltx3gu4rejhm9jxj0cu4ukpg3s2dcqfwawr7d5k3xh0qzl9eag",  "encoding": "proto3",  "tx_type": "sdk_multi_msg"}

Which was created by the [ICA](https://github.com/cosmos/ibc/tree/main/spec/app/ics-027-interchain-accounts) module. Custom versions should only be used if you created the channel or have a deep understanding of the protocol.

This table provides live information on current channels.

| chain | conn. # | channel # | version |
| ----- | ------- | --------- | ------- |
| xion.xion-testnet-2 | 6 | 6 | ucs03-zkgm-0 |
| xion.xion-testnet-2 | 3 | 3 | ucs03-zkgm-0 |
| xion.xion-testnet-2 | 2 | 2 | ucs03-zkgm-0 |
| xion.xion-testnet-2 | 1 | 1 | ucs03-zkgm-0 |
| union.union-testnet-10 | 6 | 16 | ucs03-zkgm-0 |
| union.union-testnet-10 | 1 | 1 | ucs03-zkgm-0 |
| sei.1328 | 12 | 4 | ucs03-zkgm-0 |
| sei.1328 | 9 | 2 | ucs03-zkgm-0 |
| sei.1328 | 8 | 1 | ucs03-zkgm-0 |
| sei.1328 | 10 | 3 | ucs03-zkgm-0 |
