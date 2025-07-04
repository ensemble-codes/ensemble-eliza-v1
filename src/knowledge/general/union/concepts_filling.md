Filling
=======

The process of providing funds on the destination chain is referred to as filling. For most transfers, the Union protocol is the filler, which mints assets according to the IBC specification. Third parties can also perform this role, by transferring assets from their  
account to fulfill transfers.

[Counterparties and reorgs](#counterparties-and-reorgs)
-------------------------------------------------------

Fillers must protect themselves against double-spend attacks, which can be caused by reorganization of the source chain.

The sequence diagram shows how a crosschain asset transfer fundamentally works. The filler provides funds on the destination side by minting, unlocking from a liquidity pool, or using their own funds.

If a reorganization of chain A occurs after the filler has provided assets on chain B, the filler is at risk of being unable to obtain the original locked funds. In the case of minting fillers, this causes the destination asset to no longer be 1:1 backed. For liquidity pools and intent-based fillers, a loss occurs. Potential losses can be mitigated by leveraging preconfirmations, or reduced to zero by using light clients.
