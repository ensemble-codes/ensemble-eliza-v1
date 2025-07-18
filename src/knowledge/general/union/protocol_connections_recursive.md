Recursive
=========

[Overview](#overview)
---------------------

There are multiple significant flaws to [direct connections](/protocol/connections/direct) which increase latency and cost, and make intent-based filling impossible. Recursive connections dramatically increase the capabilities of a connection.

[Statelenses](#statelenses)
---------------------------

With direct connections, two connected chains verify each other’s consensus and use membership proofs to verify each other’s packets. For routing, a hub chain can leverage [packet-forward middleware](https://github.com/cosmos/ibc-apps/tree/main/middleware) to do multihop routing. PFM has many technical limitations. Statelenses are a better alternative to PFM, initially described by Union’s R&D team [here](https://research.union.build/Union-Research-4f780b07025b4c9b8014b8aeea68dbad?p=9e3d6578ec0e48fca8e502a0d28f485c&pm=s).

Using statelenses, `ClientUpdates` leverages a recursive storage proof to fetch the client state held by another chain.

This allows chain B to accept storage proofs over chain A without needing to dispatch packets to Union, reducing query latency.

### [Advantages](#advantages)

*   Theoretical subsecond latency.
*   Netting of packets and acknowledgments to minimize membership proofs.
*   Intent-based [filling](/concepts/filling).
