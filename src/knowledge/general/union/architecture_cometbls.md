CometBLS
========

[Introduction](#introduction)
=============================

Proving a blockchain’s state and finality lies at the root of secure bridging and consensus verification. [Tendermint](https://github.com/cometbft/cometbft), although designed for fast, single-slot finality, is not suited for bridging to block space-restricted chains, such as Ethereum. It requires too much computation to verify, and even creating zero-knowledge proofs of the verification is expensive, slow, and scales poorly with the number of validators. Most attempts to bridge to Ethereum before Union are centralized and not based on consensus verification.

_CometBLS_ is an improvement upon Tendermint, which makes it suitable for zero-knowledge proving. CometBLS is achieved by three significant changes to [CometBFT](https://github.com/cometbft/cometbft), with further improvement pending. These improvements will decrease proving times even further, leading to faster bridging transfers and cheaper relaying.

[BLS Signatures](#bls-signatures)
---------------------------------

Boneh–Lynn–Shacham (BLS) signatures form the foundation of CometBLS. They are cheaper to verify for both regular IBC and zero-knowledge proof (zkp) based IBC. With BLS signatures, we can aggregate the public keys and the signatures, and verify the aggregated signature with the aggregated public key. This has a few advantages:

*   Transaction size decreases compared to ECDSA verification. We do not need to transfer all signatures, just the aggregate.
    
*   On-chain computation cost decreases. Instead of verifying each signature, we verify the aggregate.
    
*   ZKP verification is much more efficient.
    

Note that the Union validators do not produce ZKPs directly. This function is performed by [galois](/architecture/galois/). Relayers can produce proofs themselves, or use Union as a distributed sequencing layer through the use of [proof claims](https://github.com/unionlabs/union/discussions/41).

Under CometBLS, the Union network can scale to hundreds of validators without impacting performance or bridging latency. Furthermore, because BLS signatures can be aggregated, we can employ distributed validator tech to scale to thousands of validators.

[MiMC Hashing](#mimc-hashing)
-----------------------------

SHA-256 is used across Tendermint for storage proofs and more. The security of SHA-256 over alternatives like BLAKE is questionable; the main downside is the high cost within Zero-Knowledge circuits to prove the hashing. [MiMC](https://eprint.iacr.org/2016/492.pdf) is an alternative that provides excellent security and significantly decreases the number of constraints in Galois. CometBLS V3 introduced these MiMC hashes, bringing [significant performance enhancements](https://unionlabs.github.io/galois-benchmark/).

[Epoch-based Validator Rotation](#epoch-based-validator-rotation)
-----------------------------------------------------------------

Reducing the number of light client updates required for the secure operation of the bridge is crucial to relayer profitability and the economic feasibility of light clients in gas-constrained environments, which in turn reduces fees for regular users. Epoch Staking is our current effort to minimize ‘useless’ light client updates and proof generation. It combines designs from Polkadot consensus with Cosmos’ governance and security models.

[Pending Improvements](#pending-improvements)
---------------------------------------------

Future versions of CometBLS will support improvements focussed on reducing proving times and proving costs even further.

### [Verkle Trees](#verkle-trees)

An even greater improvement for storage proofs is the usage of [Verkle Trees](https://math.mit.edu/research/highschool/primes/materials/2018/Kuszmaul.pdf) over Merkle trees. This technology is however relatively undeveloped.
