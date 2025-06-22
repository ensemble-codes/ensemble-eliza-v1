Overview
========

The Union protocol is a flavor of IBC (and fully IBC compatible), with certain extensions and innovations to make the protocol more efficient, faster, and flexible for builders, without reducing any security guarantees.

[Connections and Channels](#connections-and-channels)
-----------------------------------------------------

Instead of a legacy single-chain-single-connection protocol, Union uses a connection and channel standard to facilitate communication between rollups and chains. This has several advantages.

*   Each connection encodes a finality mechanism and security level, such that we can support both soft and hard finalization on Arbitrum.
*   Each channel encodes a messaging protocol, allowing us to support different protocols concurrently.

We currently support two categories of connections, direct and recursive. Each connection can leverage any of our light clients. Direct connections are single-hop, while recursive connections leverage statelenses to perform arbitrary amounts of hops.

The complex combinations of connection category and client type is abstracted for onchain protocols and end users, to them, connections act as simple sockets.

[Versions](#versions)
---------------------

Union supports different protocols over each channel. Channels are connection agnostic, meaning that all channel versions support both direct and recursive connections.

Each protocol version has different functionalities and intended use cases. For most users, `ucs03-zkgm-0` is the appropriate channel type.

| version | use case |
| ------- | -------- |
| ucs03-zkgm-0 | Asset transfers, NFT transfers, packets, intents |
| ics20-1 | Asset transfers |
