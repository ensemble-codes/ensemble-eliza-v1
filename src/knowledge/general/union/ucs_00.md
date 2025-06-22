UCS00 - Ping Pong
=================

A simple “hello world!”-style protocol for testing **Message Passing (GMP)** between two chains.

    Chain A: Sends "Ping" to Chain BChain B: Receives "Ping" from Chain AChain B: Sends "Pong" to Chain AChain A: Receives "Pong" from Chain BChain A: Sends "Ping" to Chain BChain B: Receives "Ping" from Chain AChain B: Sends "Pong" to Chain AChain A: Receives "Pong" from Chain BChain A: Sends "Ping" to Chain B... etc

[UCS00 - EVM reference implementation](https://github.com/unionlabs/union/blob/main/evm/contracts/apps/ucs/00-pingpong/PingPong.sol) Canonical UCS00 implementation in Solidity

[UCS00 - CosmWasm reference implementation](https://github.com/unionlabs/union/tree/main/cosmwasm/ibc-union/app/ucs00-pingpong) Canonical UCS00 implementation in Rust
