ucs03-zkgm Asset Transfer Tutorial - CosmWasm
=============================================

[Prerequisites](#prerequisites)
===============================

This tutorial assumes that you have experience creating contracts in CosmWasm. If you need to familiarize yourself with CosmWasm, you should start with the [CosmWasm book](https://book.cosmwasm.com/) and the other [resources listed by the CosmWasm team](https://cosmwasm.com/build).

The Union team uses [Nix](https://nixos.org/) to manage developer environments. While this tutorial may mention different developer tools, it will not guide you through setting each one up.

This tutorial will assume that you have a working rust tool chain, including `cargo`.

You will also need a chain that supports CosmWasm running where you plan to deploy ucs03 and your app. This tutorial will assume you are deploying your contract on `union-testnet-9`.

Users will need to find a valid RPC node to use as `RPC_URL` throughout the tutorial.

[Tutorial](#tutorial)
=====================

1.  Write your contract
2.  Deploy your contract
3.  Example transfer

[Write Your Contract](#write-your-contract)
-------------------------------------------

To demonstrate asset transfers with ucs03, this tutorial will walk you through creating a simple contract that sends a single token.

### [Project Bootstrapping](#project-bootstrapping)

If you don’t already have a project folder for your contract, make one now and navigate inside.

Terminal window

    cargo new --lib example-ucs03-cosmwasmcd example-ucs03-cosmwasm

Add required dependencies to the `Cargo.toml` file.

Cargo.toml

    [package]name = "example-ucs03-cosmwasm" # name of the projectversion = "0.1.0"edition = "2021"
    [lib]crate-type = ["cdylib", 'rlib']
    [dependencies]cosmwasm-schema = { version = "2.1.4" }cosmwasm-std = { version = "2.1.4", default-features = false, features = ["std", "staking", "stargate"] }serde = { version = "1.0.210", default-features = false, features = ["derive"] }thiserror = { version = "1.0.64", default-features = false }
    [features]library = []
    [profile.release]opt-level = "z"strip = true

Below is a sample contract that can be pasted into `lib.rs`.

This contract exposes the transfer message from ucs03-zkgm (`Ucs03ExecuteMsg`), then sends that message to the deployed ucs03-zkgm. To see all the messages exposed by ucs03-zkgm, refer to the contract in our [repository](https://github.com/unionlabs/union/blob/49dfa17d04b52509e5122d13e79bfc4a65d4a811/cosmwasm/ibc-union/app/ucs03-zkgm/src/msg.rs#L16)

src/lib.rs

    use cosmwasm_schema::cw_serde;#[cfg(not(feature = "library"))]use cosmwasm_std::entry_point;use cosmwasm_std::{    to_json_binary, Coin, DepsMut, Env, MessageInfo, Response, StdResult, Uint128, Uint256, WasmMsg,};
    #[cw_serde]pub struct InstantiateMsg {}
    #[derive(serde::Serialize, serde::Deserialize)]#[serde(rename_all = "snake_case")]pub enum ExecuteMsg {    Transfer {        channel_id: u32,        receiver: String,        base_token: String,        base_amount: Uint128,        quote_token: String,        quote_amount: Uint256,        contract_address: String,    },}
    #[derive(serde::Serialize, serde::Deserialize)]#[serde(rename_all = "snake_case")]pub enum Ucs03ExecuteMsg {    Transfer {        channel_id: u32,        receiver: String,        base_token: String,        base_amount: Uint128,        quote_token: String,        quote_amount: Uint256,        timeout_height: u64,        timeout_timestamp: u64,        salt: String,    },}
    #[cfg_attr(not(feature = "library"), entry_point)]pub fn instantiate(    _deps: DepsMut,    _env: Env,    _info: MessageInfo,    _msg: InstantiateMsg,) -> StdResult<Response> {    Ok(Response::default())}
    #[cfg_attr(not(feature = "library"), entry_point)]pub fn execute(    deps: DepsMut,    env: Env,    _info: MessageInfo,    msg: ExecuteMsg,) -> StdResult<Response> {    match msg {        ExecuteMsg::Transfer {            channel_id,            receiver,            base_token,            base_amount,            quote_token,            quote_amount,            contract_address,        } => transfer(            deps,            env,            channel_id,            receiver,            base_token,            base_amount,            quote_token,            quote_amount,            contract_address,        ),    }}
    fn transfer(    _deps: DepsMut,    _env: Env,    channel_id: u32,    receiver: String,    base_token: String,    base_amount: Uint128,    quote_token: String,    quote_amount: Uint256,    contract_address: String,) -> StdResult<Response> {    let msg = WasmMsg::Execute {        contract_addr: contract_address,        msg: to_json_binary(&Ucs03ExecuteMsg::Transfer {            channel_id,            receiver: receiver.clone(),            base_token: base_token.clone(),            base_amount,            quote_token,            quote_amount,            timeout_height: 1000000000000,            timeout_timestamp: 2737670312,            salt: "0x5dbda6be8b35e888c9d4e64c3ce080fbc735e8b907ca5a38222ac522d085ec2b".to_string(),        })        .expect("can convert into json binary"),        funds: vec![Coin {            denom: base_token,            amount: base_amount,        }],    };
        Ok(Response::new()        .add_message(msg)        .add_attribute("action", "transfer")        .add_attribute("recipient", receiver)        .add_attribute("amount", base_amount.to_string()))}

### [Building the Contract](#building-the-contract)

With this contract code ready, the WASM blob can be built.

Terminal window

    RUSTFLAGS='-C target-cpu=mvp -C opt-level=z' cargo build \    --target wasm32-unknown-unknown \    --no-default-features \    --lib \    --release \    -Z build-std=std,panic_abort \    -Z build-std-features=panic_immediate_abort
    mkdir -p build

The contract can now be deployed.

[Deploying your Contract](#deploying-your-contract)
---------------------------------------------------

With the WASM blob ready, the contract can be deployed.

Terminal window

    uniond tx wasm store ./build/contract.wasm \    --from $KEY_NAME \    --gas auto \    --gas-adjustment 1.4 \    --chain-id union-testnet-9 \    --node $RPC_URL \    --yes
    TX_HASH=..

Be sure to copy the `CODE_ID` of the newly stored code. Using the previous transaction hash, you can see it by running this command:

Terminal window

    uniond query tx $TX_HASH --node $RPC_URL | rg -C 1 "code_id"

Next, submit a transaction to instantiate the contract. Copy the value of the **NEW** transaction hash into a shell variable (`TX_HASH`).

Terminal window

    uniond tx wasm instantiate $CODE_ID "{}" \  --node $RPC_URL \  --from $KEY_NAME \  --label $CONTRACT_NAME \  --no-admin \  --gas auto \  --gas-adjustment 1.4 \  --chain-id union-testnet-9
    TX_HASH=..

You can then get the contract address by running:

Terminal window

    uniond query tx $TX_HASH --node $RPC_URL | rg -C 1 "_contract_address"

[Example Transfer](#example-transfer)
-------------------------------------

With the address of your contract in hand, a sample transfer can now be conducted.

First, prepare a `payload.json` that will hold the main message of the transfer.

This will send UNO to a Holesky address of your choice

payload.json

    {  "transfer": {    "channel_id": 7,    "receiver": "<RECEIVER_ADDRESS_HEX_PREFIXED>",    "base_token": "muno",    "base_amount": 1000000,    "quote_token": "0xf2865969cf99a28bb77e25494fe12d5180fe0efd",    "quote_amount": "1000000",    "contract_address": "union19hspxmypfxsdsnxttma8rxvp7dtcmzhl9my0ee64avg358vlpawsdvucqa",  }}

The message can then be sent to the contract for execution.

Terminal window

    uniond \    tx wasm execute $CONTRACT_ADDRESS "$(jq -c '.' payload.json)" \        --from $KEY_NAME \        --gas auto \        --gas-adjustment 1.4 \        --chain-id union-testnet-9 \        --node $RPC_URL \        --amount 2000000muno

[Edit page](https://github.com/unionlabs/union/edit/main/docs/src/content/docs/connect/app/asset-transfer/cosmwasm.mdx)
