Getting Started
===============

This guide is intended for validators running on bare-metal servers and explains how Union releases work. Check out the [NixOS](/infrastructure/node-operators/nixos/) and the [Kubernetes](/infrastructure/node-operators/kubernetes/) guide for more production-ready deployments.

Validators are the backbone of the network. Becoming one requires significant token bonding and delegations, and is not intended for non-power users.

[Obtaining uniond](#obtaining-uniond)
-------------------------------------

Note

Currently, directly downloading the `uniond` binary requires access to our private GitHub repository. We are not currently providing the general public access to our GitHub repositories.

If you don’t have access to our private GitHub repository, you can still run our node using the public Docker image.

You can obtain `uniond` from a recent [release](https://github.com/unionlabs/union/releases/latest).

Caution

Double-check the version and architecture in the link before downloading.

*   [x86\_64-linux](#tab-panel-0)
*   [aarch64-linux](#tab-panel-1)

    curl --output uniond --location https://github.com/unionlabs/union/releases/download/$UNIOND_VERSION/uniond-release-x86_64-linux

_Where `UNIOND_VERSION` is v1.1.0_

    curl --output uniond --location https://github.com/unionlabs/union/releases/download/$UNIOND_VERSION/uniond-release-aarch64-linux

_Where `UNIOND_VERSION` is v1.1.0_

Verify that the binary works on your server by running:

    ./uniond --help

For convenience, we can add the binary to the `PATH`, to make it callable from anywhere.

    mv ./uniond /usr/bin/

### [Using Docker](#using-docker)

We also provide containers in our [package registry](https://github.com/orgs/unionlabs/packages/container/package/uniond-release).

    docker pull ghcr.io/unionlabs/uniond-release:$UNIOND_VERSION

_Where `UNIOND_VERSION` is v1.1.0_

When running the container, make sure to map a volume to the path passed in `--home` options to ensure data persistence. From here on the guide assumes the usage of a regular binary. The [docker-compose](/infrastructure/node-operators/docker-compose/) section is more suited for docker users.

Caution

`uniond` is a stateful application and interacts with the file system. Make sure to use [volumes](https://docs.docker.com/storage/volumes/).

[Initialization](#initialization)
---------------------------------

We’ll need to set up a few configuration files and obtain the [genesis.json](/genesis.json) before we can run the node.

First, set some environment variables, which are used throughout initialization.

env.sh

    export CHAIN_ID=union-testnet-10export MONIKER="Unionized Goblin"export KEY_NAME=aliceexport GENESIS_URL="https://union.build/genesis.json"

Then we’ll have `uniond` initialize our data and configuration directories. By default, `/User/{USER}/.uniond` is used.

    uniond init $MONIKER --chain-id $CHAIN_ID

### [Genesis Configuration](#genesis-configuration)

Download the `genesis.json` and copy it to your `uniond` home directory.

    curl $GENESIS_URL | jq '.result.genesis' > ~/.union/config/genesis.json

### [Registration](#registration)

To join as a validator, you need to submit a registration transaction. You can do this from the command line on your validator node.

First, add a wallet that holds Union tokens.

    uniond keys add $KEY_NAME --recover

Caution

For production usage, we recommend not storing the wallet on a server.

To submit the registration transaction and become a validator, you must submit a `create-validator` transaction:

    uniond tx staking create-validator \  --amount 1000000muno \  --pubkey $(uniond tendermint show-validator) \  --moniker $MONIKER \  --chain-id $CHAIN_ID \  --from $KEY_NAME \  --commission-max-change-rate "0.1" \  --commission-max-rate "0.20" \  --commission-rate "0.1" \  --min-self-delegation "1"

Note

If your own node isn’t set up to accept RPC request, you can send them to another node via the `--node` option.

[Systemd Service](#systemd-service)
-----------------------------------

We recommend running `uniond` as a systemd service. Create a file in `/etc/systemd/system` called `uniond.service`. Make sure to replace $USER with your username.

    [Unit]Description=uniond[Service]Type=simpleRestart=alwaysRestartSec=1User=$USERExecStart=/usr/bin/uniond start
    [Install]WantedBy=multi-user.target

You should be able to view the node logs by executing

    sudo journalctl -f --user uniond

It’s then recommended to back up these files from `~/.union/config` in a secure location:

*   `priv_validator_key.json`
*   `node_key.json`
