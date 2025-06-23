UCS06 - Funded Dispatch
=======================

UCS06 defines a protocol for executing contract calls with attached funds across chains. It allows for both native tokens and ERC20/CW20 tokens to be attached to cross-chain contract calls.

[Protocol](#protocol)
---------------------

The protocol allows for:

*   Attaching multiple tokens to a single contract call
*   Handling both native and wrapped tokens
*   Optional failure handling with beneficiary refunds
*   Market maker participation control
*   Integration with ZKGM for cross-chain execution

[Parameters](#parameters)
-------------------------

The protocol uses these core parameters:

    struct FundedDispatchParameters {    uint256 flags;            // Control flags for execution behavior    FundedDispatchFund[] funds; // Array of tokens and amounts to attach    bytes contractAddress;    // Target contract to call    bytes contractCalldata;   // Call data for the target contract    bytes beneficiary;        // Address to receive funds on failure}
    struct FundedDispatchFund {    bytes token;    // Token address or identifier    uint256 amount; // Amount of tokens to transfer}

[Flags](#flags)
---------------

The protocol supports these execution flags:

*   `FLAG_DEFAULT (0)` - Default behavior
*   `FLAG_ALLOW_FAILURE (1)` - Allow execution to fail and refund to beneficiary
*   `FLAG_ALLOW_MARKET_MAKER (2)` - Allow market makers to fill the order

[Execution Flow](#execution-flow)
---------------------------------

1.  The protocol receives funds and parameters
2.  For each fund:
    *   For native tokens: Hold value for the call
    *   For wrapped tokens: Approve spending to target contract
3.  Execute the target contract call with funds
4.  On success:
    *   Clear any remaining approvals
5.  On failure:
    *   If failure is allowed, send funds to beneficiary
    *   If failure is not allowed, revert the entire transaction
    *   Clear any remaining approvals

[Security Considerations](#security-considerations)
---------------------------------------------------

*   The contract must be atomically funded then called
*   Any other sequence allows third parties to drain funds
*   Extra tokens can be drained by market makers (incentive)
*   Market maker participation can be restricted
*   Beneficiary address must be valid on the destination chain

[Integration with ZKGM](#integration-with-zkgm)
-----------------------------------------------

The protocol integrates with UCS03 (ZKGM) through:

*   The `onZkgm()` interface for regular calls
*   The `onIntentZkgm()` interface for market maker fills
*   Parameter encoding/decoding for cross-chain transit

This allows funded dispatch to be used as part of larger cross-chain operations through ZKGM’s instruction system.

[Composability Examples](#composability-examples)
-------------------------------------------------

The protocol can be composed with other ZKGM instructions in powerful ways:

### [Example 1: Batch Orders with Funded Call](#example-1-batch-orders-with-funded-call)

This example shows how to batch multiple orders followed by a funded contract call:

    // ZKGM(//   Batch[//     Order(TokenA -> FundedDispatch, amountA),//     Order(TokenB -> FundedDispatch, amountB),//     Multiplex(//       FundedDispatch(//         Funds[TokenA, TokenB],//         Call[//           Staking.stake(//             amountA,//             amountB,//             receiver//           )//         ]//       )//     )//   ]// )Instruction[] memory instructions = new Instruction[](3);
    // Add two token transfer ordersinstructions[0] = makeFungibleAssetOrder(...); // Transfer token Ainstructions[1] = makeFungibleAssetOrder(...); // Transfer token B
    // Add a funded dispatch call to stake the tokensFundedDispatchFund[] memory funds = new FundedDispatchFund[](2);funds[0] = FundedDispatchFund({    token: tokenA,    amount: amountA});funds[1] = FundedDispatchFund({    token: tokenB,    amount: amountB});
    FundedDispatchParameters memory params = FundedDispatchParameters({    flags: FLAG_DEFAULT,    funds: funds,    contractAddress: stakingContract,    contractCalldata: abi.encodeCall(IStaking.stake, (amountA, amountB, receiver)),    beneficiary: receiver});
    // Add the funded dispatch as a multiplex instructioninstructions[2] = makeMultiplexCall(    sender,    false, // not eureka mode    fundedDispatchContract,    abi.encode(params));
    // Create and send the batchInstruction memory batchInstruction = makeBatch(instructions);zkgm.send(    channelId,    timeoutHeight,    timeoutTimestamp,    salt,    batchInstruction);

### [Example 2: Recursive Cross-Chain Operations](#example-2-recursive-cross-chain-operations)

This example shows how to combine a token transfer with a funded ZKGM call to initiate another cross-chain operation:

    // ZKGM(//   Batch[//     Order(Token -> FundedDispatch, amount),//     Multiplex(//       FundedDispatch(//         Funds[Token],//         Call[//           ZKGM.send(//             channelId,//             Order(Token -> Receiver, amount) // Next hop transfer//           )//         ]//       )//     )//   ]// )// Create a batch with order + funded dispatchInstruction[] memory instructions = new Instruction[](2);
    // First transfer token to the funded dispatch contractinstructions[0] = makeFungibleAssetOrder(    zkgm,    path,    channelId,    sender,    fundedDispatchContract, // receiver is the funded dispatch contract    token,    amount,    quoteToken,    quoteAmount);
    // Then use those tokens to make another ZKGM callFundedDispatchFund[] memory funds = new FundedDispatchFund[](1);funds[0] = FundedDispatchFund({    token: quoteToken,    amount: quoteAmount});
    FundedDispatchParameters memory params = FundedDispatchParameters({    flags: FLAG_DEFAULT,    funds: funds,    contractAddress: zkgmContract,    contractCalldata: abi.encodeCall(        IZkgm.send,        (            nextChannelId,            timeoutHeight,            timeoutTimestamp,            salt,            makeFungibleAssetOrder(...) // Next hop transfer        )    ),    beneficiary: receiver});
    // Add the funded dispatch as a multiplex instructioninstructions[1] = makeMultiplexCall(    sender,    false,    fundedDispatchContract,    abi.encode(params));
    // Create and send the batchInstruction memory batchInstruction = makeBatch(instructions);zkgm.send(    channelId,    timeoutHeight,    timeoutTimestamp,    salt,    batchInstruction);

This composability allows for complex cross-chain operations where tokens can be transferred, contracts called with funds, and further cross-chain operations initiated.

### [Example 3: Cross-Chain Uniswap Swap](#example-3-cross-chain-uniswap-swap)

This example shows a high-level representation of using UCS06 to perform a cross-chain swap on Uniswap:

    // ZKGM(//   Batch[//     Order(TokenA -> FundedDispatch, amount),//     Multiplex(//       FundedDispatch(//         Funds[TokenA],//         Call[//           Uniswap.swapExactTokensForTokens(//             amountIn: amount,//             amountOutMin: minOutput,//             path: [TokenA, WETH, TokenB],//             to: receiver//           )//         ]//       )//     )//   ]// )
    // Actual implementationInstruction[] memory instructions = new Instruction[](2);
    // First transfer TokenA to the funded dispatch contractinstructions[0] = makeFungibleAssetOrder(    zkgm,    path,    channelId,    sender,    fundedDispatchContract,    tokenA,    amountIn,    tokenA,  // Quote token is same as base    amountIn // Full amount transferred);
    // Setup the Uniswap swap parametersaddress[] memory swapPath = new address[](3);swapPath[0] = tokenA;swapPath[1] = WETH;swapPath[2] = tokenB;
    // Create funded dispatch to execute the swapFundedDispatchFund[] memory funds = new FundedDispatchFund[](1);funds[0] = FundedDispatchFund({    token: tokenA,    amount: amountIn});
    FundedDispatchParameters memory params = FundedDispatchParameters({    flags: FLAG_DEFAULT,    funds: funds,    contractAddress: uniswapRouter,    contractCalldata: abi.encodeCall(        IUniswapV2Router.swapExactTokensForTokens,        (            amountIn,            amountOutMin,            swapPath,            receiver,            block.timestamp + 3600 // 1 hour deadline        )    ),    beneficiary: receiver // Refund to receiver if swap fails});
    // Add the funded dispatch as multiplex instructioninstructions[1] = makeMultiplexCall(    sender,    false,    fundedDispatchContract,    abi.encode(params));
    // Create and send the batchInstruction memory batchInstruction = makeBatch(instructions);zkgm.send(    channelId,    timeoutHeight,    timeoutTimestamp,    salt,    batchInstruction);

This example demonstrates:

1.  Pseudocode of the operation
2.  Transfer of tokens to funded dispatch contract
3.  Setup of Uniswap swap parameters
4.  Funded dispatch call to execute the swap
5.  Proper error handling with beneficiary
6.  Atomic execution through ZKGM batching

[UCS06 - EVM reference implementation](https://github.com/unionlabs/union/blob/main/evm/contracts/apps/ucs/06-funded-dispatch/FundedDispatch.sol) Canonical UCS06 implementation in Solidity

[UCS06 - CosmWasm reference implementation](https://github.com/unionlabs/union/tree/main/cosmwasm/ibc-union/app/ucs06-funded-dispatch) Canonical UCS06 implementation in Rust
