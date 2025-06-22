Overview
========

### [Identifier](#identifier)

Each connection has a `connection-id`, uniquely identifying the connection on that specific chain. Note that this identifier is not globally unique, such that two chains can both have a connection with ID `10`. This does not mean that, since the IDs are the same, the connections are connected to each other.

### [Status](#status)

A connection goes through different states referred to as `status`: `INIT`, `TRY`, `ACK`, and `CONFIRM`. Unless you are opening connections yourself, you only need to concern yourself with the `CONFIRM` state, which means the connection can now be used to open channels.

### [Clients](#clients)

Each connection is verified by a client, which describes the consensus protocol of the counterparty chain. Client IDs have 2 potential formats:

*   `{algorithm}-{instantiation}`: `07-tendermint-4038` or `08-wasm-66`, where `07-tendermint` and `08-wasm` are the algorithms.
*   `{instantiation}`: `12`, `666`, `420`. This format is found in newer stacks as it is significantly more gas-efficient.

Most consumers of the IBC stack should not care about clients or client ids. They all provide the same (highest possible) security level, and are abstracted away by our stack.

### [Connections Table](#connections-table)

This table provides live information on current connections.

[](/reference/graphql?query=query%20ConnectionsForDocs%20%7B%0A%20%20data%3A%20v2_connections%20%7B%0A%20%20%20%20source_universal_chain_id%0A%20%20%20%20destination_universal_chain_id%0A%20%20%20%20source_connection_id%0A%20%20%20%20source_client_id%0A%20%20%7D%0A%7D "Open in GraphQL playground")

| source | destination | connection-id | client-id |
| ------ | ----------- | ------------- | --------- |
| xion.xion-testnet-2 | ethereum.11155111 | 8 | 6 |
| xion.xion-testnet-2 | sei.1328 | 6 | 5 |
| xion.xion-testnet-2 | corn.21000001 | 3 | 4 |
| xion.xion-testnet-2 | babylon.bbn-test-5 | 2 | 3 |
| xion.xion-testnet-2 | ethereum.17000 | 1 | 2 |
| union.union-testnet-10 | sei.1328 | 6 | 14 |
| union.union-testnet-10 | osmosis.osmo-test-5 | 5 | 9 |
| union.union-testnet-10 | ethereum.11155111 | 3 | 4 |
| union.union-testnet-10 | ethereum.17000 | 2 | 2 |
| union.union-testnet-10 | ethereum.11155111 | 1 | 1 |
