Galois
======

Galois is Union’s **Zero-Knowledge [Consensus](/concepts/consensus-verification) Proving system**. We’ve built Galois around three fundamental principles:

1.  **Extremely fast**: fast proving times equate to fast bridging and good user experience. Galois can generate consensus proofs for 128 validators [within seven seconds](/architecture/galois/#benchmarks).
2.  **Low-cost**: Burning millions of dollars in monthly cloud infrastructure costs to generate ZK proofs is not a sustainable model. Generating proofs should be super cheap.
3.  **Censorship-resistance**: in order to combat censorship attacks, _anyone should be able to generate consensus proofs_ on their own machines. Galois is so efficient that proof generation only consumes 5GB RAM for 128 validators, enabling the generation of proofs for mainnet on entry-level consumer laptops.
4.  **Decentralized**: infrastructure operators do not need complex cloud architecture to operate a relayer and prover. Anyone can participate in the system. Because of this, we focused on efficient CPU-based generation of ZKPs, as we don’t want to depend on specific GPU vendors.[1](#union-docs-fn-1)

[Architecture](#architecture)
-----------------------------

Transactions through Union to other Counterparties _(L1s, L2s, and (sovereign) Rollups)_ are composed of three steps:

1.  Emit an IBC send-packet event
2.  Generate a zero-knowledge consensus proof of Union’s state at block NNN
3.  Update Counterparty with Union state

Galois is built using [Gnark](https://github.com/ConsenSys/gnark), the best-performing zk-SNARK library, and communicates over [gRPC](https://grpc.io/), a high-performance, open-source universal RPC framework.

Note

Depending on validator set drift, Galois may need to generate multiple proofs. This results in MMM being the last trusted height and N+1N+1N+1 being the height to update to.

[Benchmarks](#benchmarks)
-------------------------

Galois benchmarks exceptionally well. Our benchmarks are 100% reproducibly generated with [Nix](https://nixos.org), so anyone can verify them. Third-party validation of these benchmarks has been conducted by Lightshift. View the latest [Galois V3 benchmarks here](https://unionlabs.github.io/galois-benchmark/c6i.x32large.v3/report.html) and to see our progress, you can see [historical Galois benchmarks for older versions here](https://unionlabs.github.io/galois-benchmark/).

[Future Roadmap](#future-roadmap)
---------------------------------

Galois is fully functional, production-ready, extremely reliable, and performant. However, there are always further improvements:

*   Verkle tree support.
*   Formal verification with [Lean](https://leanprover.github.io/).
*   Proof caching ensures that the network does not perform redundant work and incentivizes decentralized proving, effectively using Union as a decentralized sequencers orchestration layer.

* * *

[Footnotes](#footnote-label)
----------------------------

1.  Note that Galois’ tech stack also supports GPU-based zkp generation, but we designed the system to be independent of GPUs for good performance. [↩](#union-docs-fnref-1)
    