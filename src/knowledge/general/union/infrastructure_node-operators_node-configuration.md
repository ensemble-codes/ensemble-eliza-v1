Node Configuration
==================

After successfully running your node with `uniond`, you can refer to this guide to aid you in configuring your node.

This is not a complete guide to all node configuration options, this is intended to help ensure that your node is fully operational.

This guide will assume that you’re starting at the root of your Union node configuration (located at `~/.union/` by default or `~/.unionvisor/home` if you’re using Unionvisor).

[Client Configuration](#client-configuration)
---------------------------------------------

Located in `config/client.toml`, this file is host to client settings.

### [The Network Chain ID](#the-network-chain-id)

Update this value to ensure that your client is supplied with the correct chain ID.

For the Union Testnet, this value should be `"union-testnet-10"`.

    # The network chain IDchain-id = "union-testnet-10"

### [Host/Port for the Tendermint RPC](#hostport-for-the-tendermint-rpc)

This will determine which address your client will listen for Tendermint RPC request on.

This will default to `"tcp://localhost:26657"`, setting this to `"tcp://0.0.0.0:26657"` will ensure it’s listening on every available network interface.

    # <host>:<port> to Tendermint RPC interface for this chainnode = "tcp://0.0.0.0:26657"

[App Configuration](#app-configuration)
---------------------------------------

Located in `config/app.toml`, this file is host to app settings.

### [Minimum Gas Price](#minimum-gas-price)

Located under the “Base Configuration” section of `config/app.toml`.

The [skip-mev/feemarket](https://github.com/skip-mev/feemarket/) module sets a global gas price/fee. To ensure consistency with the rest of the network, set this to `"0muno"`.

    # The minimum gas prices a validator is willing to accept for processing a# transaction. A transaction's fees must meet the minimum of any denomination# specified in this config (e.g. 0.25token1;0.0001token2).minimum-gas-prices = "0muno"

### [Pruning](#pruning)

Located under the “Base Configuration” section of `config/app.toml`.

Several options are available here, ensure you’ve selected the one that best fits your nodes storage capabilities.

    # default: the last 362880 states are kept, pruning at 10 block intervals# nothing: all historic states will be saved, nothing will be deleted (i.e. archiving node)# everything: 2 latest states will be kept; pruning at 10 block intervals.# custom: allow pruning options to be manually specified through 'pruning-keep-recent', and 'pruning-interval'pruning = "default"

[Node Configuration](#node-configuration)
-----------------------------------------

Located in `config/config.toml`, this file is host to many settings.

### [Consensus](#consensus)

To achieve our target block time, the Union team asks validators to make the following changes to their configuration.

Located in the `consensus` TOML table under the “Consensus Configuration Options” section.

    # How long we wait for a proposal block before pre-voting niltimeout_propose = "3s"# How much timeout_propose increases with each roundtimeout_propose_delta = "500ms"# How long we wait after receiving +2/3 prevotes for “anything” (ie. not a single block or nil)timeout_prevote = "1s"# How much the timeout_prevote increases with each roundtimeout_prevote_delta = "500ms"# How long we wait after receiving +2/3 precommits for “anything” (ie. not a single block or nil)timeout_precommit = "1s"# How much the timeout_precommit increases with each roundtimeout_precommit_delta = "500ms"# How long we wait after committing a block, before starting on the new# height (this gives us a chance to receive some more precommits, even# though we already have +2/3).timeout_commit = "5s"

### [RPC Listening Address](#rpc-listening-address)

Located in the `rpc` TOML table under the “RPC Server Configuration Options” section.

You’ll want to ensure your node is configured to accept rpc connections. To do so, set this value to the appropriate address.

For example, to listen on every available network interface - set this to `"tcp://0.0.0.0:26657"`.

    # TCP or UNIX socket address for the RPC server to listen onladdr = "tcp://0.0.0.0:26657"

### [P2P Listening Address](#p2p-listening-address)

Located in the `p2p` TOML table under the “P2P Configuration Options” section.

You’ll want to ensure your node is configured to accept p2p connections. To do so, set this value to the appropriate address.

For example, to listen on every available network interface - set this to `"tcp://0.0.0.0:26656"`.

    # Address to listen for incoming connectionsladdr = "tcp://0.0.0.0:26656"

### [External Address](#external-address)

Located in the `p2p` TOML table under the “P2P Configuration Options” section.

If you’ve configured a domain name for your node, this is the place to inform your node of it.

    # Address to advertise to peers for them to dial# If empty, will use the same port as the laddr,# and will introspect on the listener or use UPnP# to figure out the address. ip and port are required# example: 159.89.10.97:26656external_address = "example.com:26656"

### [Seed Mode](#seed-mode)

Located in the `p2p` TOML table under the “P2P Configuration Options” section.

If you’d like to be a seed node, be sure to set this to `true`.

Caution

If you plan for your node to be a validator, it should not also be a seed node.

    # Seed mode, in which node constantly crawls the network and looks for# peers. If another node asks it for addresses, it responds and disconnects.## Does not work if the peer-exchange reactor is disabled.seed_mode = false
