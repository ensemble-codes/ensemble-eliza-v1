UCS05 - Address Types
=====================

There are various ways to encode and represent addresses. This is how we Union defines them throughout the APIs and implementations:

[Any Ecosystem](#any-ecosystem)
-------------------------------

    CanonicalBytes<N> = Uint8Array of length NErc55Checksum<T> = applying the [ERC-55 casing-based checksum](https://eips.ethereum.org/EIPS/eip-55) to `T`Hex<T> = a `0x`-prefixed hex-string encoding of `T` where `T = Bytes | String`Hrp = a Bech32 Hrp

Note

Within Union APIs and Standards, the terms **ZKGM** and **UCS03** are used interchangeably. They both refer to [the UCS03 - ZKGM spec](/ucs/03).

[EVM](#evm)
-----------

    Evm = {  Canonical = CanonicalBytes<20>  Display = Erc55Checksum<Hex<Evm.Canonical>>  Zkgm = Hex<Evm.Canonical>}

[Cosmos](#cosmos)
-----------------

    Cosmos<Hrp> = {  Canonical = CanonicalBytes<20 | 32 | N>  Display = Bech32<Hrp, Cosmos.Canonical>  Zkgm = Hex<Bech32<Hrp, Cosmos.Canonical>>}

Note

So far we’ve only encountered `CanonicalBytes<20>` and `CanonicalBytes<32>`. Cosmos is highly customizable however, so we recommend against making this assumption

[Aptos](#aptos)
---------------

    Aptos = {  Canonical = CanonicalBytes<32>  Display = Hex<Aptos.Canonical>  Zkgm = Hex<Aptos.Canonical>}

[GraphQL encoding](#graphql-encoding)
-------------------------------------

Responses from our [GraphQL API](/integrations/api/graphql) are encoded as follows:

    transfers {  sender_canonical: Hex<Chain.Canonical>  sender_display: Chain.Display  sender_zkgm: Chain.Zkgm  receiver_canonical: Hex<Chain.Canonical>  receiver_display: Chain.Display  receiver_zkgm: Chain.Zkgm}

[TypeScript-SDK encoding](#typescript-sdk-encoding)
---------------------------------------------------

    sender: DestinationChain.Zkgmreceiver: DestinationChain.Zkgm

[Implementation Suggestion](#implementation-suggestion)
-------------------------------------------------------

To be consistent across languages and implementation, ideally the types are flattened and called `Address<Ecosystem><Variant>`, for example `AddressCosmosCanonical`, `AddressEvmZkgm`.
