UCS03 - ZKGM
============

`ucs03-zkgm-0` is the most advanced and recommended protocol to use for

*   message passing
*   transfers (assets and NFTs)
*   intents
*   storage proofs

It’s the most gas-efficient version and suitable for almost all use cases.

[Protocol](#protocol)
---------------------

### [Open Filling](#open-filling)

A groundbreaking protocol improvement on IBC and trust-minimized bridging in general, is that `ucs03-zkgm-0` allows arbitrary filling of orders by any party.

Tip

Read more on filling and counterparty risk [here](/concepts/filling).

For packet submissions and transfers, the protocol allows a different filler from the Union IBC contracts. In the case of an alternative filler, the assets are not minted but transferred from the filler’s account. This allows a transfer to be filled before chains have been finalized or client updates processed. Instead, fillers can rely on preconfirmations to reduce the risk of reorgs.

Theoretically, a filler can submit the transfer to the destination side before the transaction is included on the source, given that they protect themselves against double-spend attacks.

The `Acknowledgement`, which may contain arbitrary payloads, is used to encode information on the filler and repay the filler for the service by unlocking assets from the vault.

Open filling is opt-in for any protocol, allowing for the same optimizations that `ucs03-zkgm-0` leverages to increase transfer speeds.

[Definition](#definition)
-------------------------

The zkgm protocol abstracts away multiple facets of IBC assets transfer protocol (ics20). We employ versioning in this protocol to ensure backward compatibility with future upgrades (not relying on the IBC channel upgrade feature). Each instruction has a version and opcode to allow for protocol evolution. Its features include:

*   batching
*   forward/callback envelopes
*   channel multiplexing
*   fungible assets transfer
*   non-fungible assets transfer

[Packet](#packet)
-----------------

The zkgm protocol uses two main structures for packet handling:

### [ZkgmPacket](#zkgmpacket)

    struct ZkgmPacket {    bytes32 salt;          // Unique packet identifier    uint256 path;          // Channel routing information    Instruction instruction; // The instruction to execute}

Fields:

*   `salt`: A unique `bytes32` identifier used for deterministic packet hashing
    
    *   For regular packets: `keccak256(abi.encodePacked(sender, user_provided_salt))`
    *   For forwarded packets: Uses a tinting mechanism to track packet chain
        *   Magic value: `0xC0DE00000000000000000000000000000000000000000000000000BABE`
        *   Tinting applied as: `salt | magic_value` (bitwise OR)
        *   previous\_salt is the salt of the packet being forwarded
        *   Next hop salt derived as: `keccak256(previous_salt) | magic_value`
        *   This creates a verifiable chain of salts across hops while preventing salt collisions
    *   For batch instructions: Each sub-instruction uses `keccak256(index, batch_salt)`
        *   Where index is the instruction’s position in the batch (0-based)
        *   And batch\_salt is the parent packet’s salt
*   `path`: A `uint256` that tracks packet routing and asset origins
    
    *   Composed of compressed `uint32` channel IDs in 32-bit segments
    *   Format: `prevDstChannel0 | nextSrcChannel0 << 32 | prevDstChannel1 << 64 ...`
    *   Supports up to 3 hops (256/32/2 - 1), one hop is a placeholder for the final channel ID.
    *   Updated during:
        *   Packet forwarding (appending channel pairs)
        *   Asset origin tracking
        *   Return path validation
*   `instruction`: The [Instruction](#instruction) to execute
    

Tip

The `salt` replaces the traditional IBC sequence number for packet identification. This allows:

*   Unique packet identification without maintaining sequence state on-chain
*   Deterministic computation of future packet hashes for filling (e.g., for forwarded packets)
*   Prevention of packet collisions in a stateless manner
*   Market Makers protection against reorgs (using preconf to have a guarantee that initiating tx is included at some point)

### [Instruction](#instruction)

    struct Instruction {    uint8 version;    // Protocol version    uint8 opcode;     // Instruction type    bytes operand;    // Instruction-specific data}

Fields:

*   `version`: Protocol version number as `uint8`
    
    *   Required for backward compatibility
    *   Allows dispatching between different versions
    *   Each instruction type specifies required version
*   `opcode`: Instruction type identifier as `uint8`
    
    *   0x00: [Forward](#0x00---forward)
    *   0x01: [Multiplex](#0x01---multiplex)
    *   0x02: [Batch](#0x02---batch)
    *   0x03: [FungibleAssetOrder](#0x03---fungible-asset-order)
*   `operand`: Instruction-specific data as `bytes`
    
    *   Forward: Path, timeouts and instruction to forward
    *   Multiplex: Sender, callback mode and contract call data
    *   Batch: Array of instructions to execute atomically
    *   FungibleAssetOrder: Transfer details like tokens, amounts and parties

Note

The `version` field is embedded in every instruction. One may think that this value is redundant for recursive packets. The reality is that upgrade propagation may take time (optimistic rollups for instance) and having every instruction specifying their version will allow to dispatch from a higher version to a lower one. This is specifically true for packet forwarding (chain **A** running version `X` forwarding to a chain **B** running version `Y`).

[Instructions](#instructions)
-----------------------------

### [0x00 - Forward](#0x00---forward)

The forward instruction uses opcode `0x00` and requires version `INSTR_VERSION_0`.

    struct Forward {    uint256 path;              // Channel sequence as (prevDst,nextSrc) pairs    uint64 timeoutHeight;      // Block height timeout    uint64 timeoutTimestamp;   // Unix timestamp timeout    Instruction instruction;    // Instruction to forward}

Fields:

*   `path`: A `uint256` that encodes the forwarding route
    
    *   Composed of (prevDst,nextSrc) channel ID pairs
    *   Each pair uses 64 bits (32 bits per channel ID)
    *   Must match valid channel connections
    *   Used to verify packet routing path
*   `timeoutHeight`: Block height timeout as `uint64`
    
    *   After this height, packet cannot be executed
    *   Set to 0 to disable height timeout
    *   Must be greater than current height when executed
*   `timeoutTimestamp`: Unix timestamp timeout as `uint64`
    
    *   After this time, packet cannot be executed
    *   Set to 0 to disable timestamp timeout
    *   Must be greater than current time when executed
*   `instruction`: The [Instruction](#instruction) to forward
    
    *   Can be Multiplex, FungibleAssetOrder, or Batch
    *   Will be executed on final destination chain
    *   Cannot be another Forward instruction

Tip

The forward instruction can wrap Multiplex, FungibleAssetOrder, or Batch instructions. The path parameter encodes pairs of (previous destination channel, next source channel) for routing. For example, to forward through a single hop, you need both the previous destination channel ID and the next source channel ID that form the connection between chains.

The protocol verifies that only these specific instructions can be forwarded and that the channel pairs are valid.

### [0x01 - Multiplex](#0x01---multiplex)

The multiplex instruction uses opcode `0x01` and requires version `INSTR_VERSION_0`.

    struct Multiplex {    bytes sender;            // Source chain sender address (must match msg.sender)    bool eureka;            // Whether to use IBC-style callbacks    bytes contractAddress;   // Target contract address on destination    bytes contractCalldata;  // Call data for the target contract}

Fields:

*   `sender`: Source chain sender address as `bytes`
    
    *   Must match transaction sender (msg.sender)
    *   Prevents address impersonation
    *   Used for callback routing in eureka mode
*   `eureka`: Callback mode flag as `bool`
    
    *   false: Standard fire-and-forget mode
    *   true: IBC-style callback mode
    *   Determines target contract interface
    *   Controls acknowledgement handling
*   `contractAddress`: Target contract address as `bytes`
    
    *   Must be valid contract on destination chain
    *   Must implement required interface based on eureka flag
    *   Where message will be delivered
*   `contractCalldata`: Contract call data as `bytes`
    
    *   Arbitrary data passed to target contract
    *   Interpreted by target contract’s implementation
    *   Available in both standard and eureka modes

The multiplex instruction has two modes:

1.  Standard Mode (eureka = false):
    
    *   Target must implement IZkgmable interface
    *   Calls `onZkgm(path, sourceChannel, destChannel, sender, calldata)` on target
    *   Returns success acknowledgement immediately
    *   Fire-and-forget style, no callback to sender
2.  IBC Mode (eureka = true):
    
    *   Calls `onRecvPacket(packet, relayer, relayerMsg)` on target
    *   Packet contains path, sender and calldata
    *   Target must return non-empty acknowledgement
    *   Acknowledgement forwarded back to original sender

If the target contract is invalid or calls fail:

*   Standard mode returns failure acknowledgement
*   IBC mode propagates target’s error response

Tip

Example of a contract implementing `IZkgmable`:

    contract MyContract is IZkgmable {    event MessageReceived(        uint256 path,        uint32 sourceChannelId,        uint32 destinationChannelId,        address sender,        bytes message    );
        function onZkgm(        uint256 path,        uint32 sourceChannelId,        uint32 destinationChannelId,        bytes calldata sender,        bytes calldata message    ) external {        // Verify caller is zkgm contract        require(msg.sender == address(zkgm), "Only zkgm");
            // Verify that the sourceChannelId and sender are authorized...
            // Process the cross-chain message        emit MessageReceived(            path,            sourceChannelId,            destinationChannelId,            address(bytes20(sender)),            message        );    }}

### [0x02 - Batch](#0x02---batch)

The batch instruction uses opcode `0x02` and requires version `INSTR_VERSION_0`.

    struct Batch {    Instruction[] instructions;  // Array of instructions to execute}

Fields:

*   `instructions`: Array of [Instructions](#instruction) to execute atomically
    *   Only Multiplex and FungibleAssetOrder allowed
    *   Executed in sequential order
    *   All must succeed or entire batch reverts
    *   Individual acknowledgements collected in array
    *   Minimum 2 instructions required

This allows atomic composition of transfers and contract calls in a single transaction.

Tip

In combination with forward envelopes or multiplexing, this batching mechanism is very useful to call contract before/after message execution (transfer an asset, swap it then stake the final asset).

### [0x03 - Fungible Asset Order](#0x03---fungible-asset-order)

The fungible asset order instruction uses opcode `0x03` and requires version `INSTR_VERSION_1`.

    struct FungibleAssetOrder {    bytes sender;             // Source chain sender address    bytes receiver;           // Destination chain receiver address    bytes baseToken;          // Token being sent    uint256 baseAmount;       // Amount being sent    string baseTokenSymbol;   // Token symbol for wrapped asset    string baseTokenName;     // Token name for wrapped asset    uint8 baseTokenDecimals;  // Token decimals for wrapped asset    uint256 baseTokenPath;    // Origin path for unwrapping    bytes quoteToken;         // Token requested in return    uint256 quoteAmount;      // Minimum amount requested}

Fields:

*   `sender`: Source chain sender address as `bytes`
    
    *   Must be valid address on source chain
    *   Used for refunds on failure/timeout
*   `receiver`: Destination chain receiver address as `bytes`
    
    *   Must be valid address on destination chain
    *   Where quote tokens will be sent on success
    *   Must be specified by sender
*   `baseToken`: Token being sent as `bytes`
    
    *   Token identifier on source chain
    *   Used to identify/create wrapped token
    *   Must exist on source chain
*   `baseAmount`: Amount being sent as `uint256`
    
    *   Must be available from sender
    *   Maximum amount to exchange
*   `baseTokenSymbol`: Token symbol as `string`
    
    *   Used when creating wrapped token
*   `baseTokenName`: Token name as `string`
    
    *   Used when creating wrapped token
*   `baseTokenDecimals`: Token decimals as `uint8`
    
    *   Used when creating wrapped token
*   `baseTokenPath`: Origin path as `uint256`
    
    *   Used for unwrapping return transfers
    *   Must match original wrapping path
*   `quoteToken`: Requested token as `bytes`
    
    *   Token identifier on destination chain
    *   What sender wants in exchange
    *   Must exist on destination chain
*   `quoteAmount`: Minimum amount requested as `uint256`
    
    *   Minimum acceptable exchange amount
    *   Difference (if less than `baseAmount`) is taken as fee by the relayer

The order can be filled in two ways:

1.  Protocol Fill - If the quote token matches the wrapped version of the base token and base amount >= quote amount:
    
    *   For new assets: Deploy wrapped token contract and mint quote amount to receiver
    *   For returning assets: Unwrap base token and transfer quote amount to receiver
    *   Any difference between baseAmount and quoteAmount is minted/transferred to the relayer as a fee
2.  Market Maker Fill - Any party can fill the order by providing the quote token:
    
    *   Market maker is specified in acknowledgement
    *   Base token is transferred/minted to market maker
    *   Market maker must handle quote token transfer on behalf of the protocol

The acknowledgement includes:

*   Fill type (Protocol = `0xB0CAD0` or MarketMaker = `0xD1CEC45E`)
*   Market maker address for MM fills (empty for protocol fills)

If the order fails or times out:

*   For new assets: Base token is minted back to sender
*   For returning assets: Base token is transferred back to sender
*   Outstanding balances are decreased

Tip

A user can split a big order over multiple packets to have a partial-filling like behavior. For instance, one could split a $100K order over 10 packets to allow different participants (usually market makers) to fill chunks of $10K.

Read more on filling [here](/concepts/filling).

If any of the order in the `orders` list is failing on execution, the whole packet is reverted and a failure acknowledgement will be yield.

[Implementations](#implementations)
-----------------------------------

[UCS03 - EVM reference implementation](https://github.com/unionlabs/union/blob/main/evm/contracts/apps/ucs/03-zkgm/) Canonical UCS03 implementation in Solidity

[UCS03 - CosmWasm reference implementation](https://github.com/unionlabs/union/tree/main/cosmwasm/ibc-union/app/ucs03-zkgm) Canonical UCS03 implementation in Rust
