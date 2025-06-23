Running the Client Binary
=========================

This guide assumes you have [Docker](https://www.docker.com/get-started/) correctly installed and configured on your system. We provide `uniond` images for Linux on both x86\_64 (amd64) and aarch64 (arm64).

[Getting the Docker Image](#getting-the-docker-image)
-----------------------------------------------------

To get the `uniond` image, you can visit [our container](https://github.com/orgs/unionlabs/packages/container/package/uniond-release) on the GitHub Container Registry, or run the following command:

    docker pull ghcr.io/unionlabs/uniond-release:$UNIOND_VERSION

_Where `UNIOND_VERSION` is v1.1.0_

[Running uniond](#running-uniond)
---------------------------------

### [Creating a Chain Config & State Folder](#creating-a-chain-config--state-folder)

Before running this image, we need to create a folder to host the chain configuration and state.

You can create this wherever you would like, but we’ll be doing so in our current user’s home directory.

Caution

It’s important that you will be able to edit this contents of this folder.

To create a directory for `uniond` in your user home directory, run:

    mkdir ~/.union

### [Initializing the Chain Config & State Folder](#initializing-the-chain-config--state-folder)

Now, using the `uniond` image and the folder we just created, we can initialize the contents of this folder.

To do this, we’ll be using Docker volumes.

    docker run \  --user $(id -u):$(id -g) \  --volume ~/.union:/.union \  --volume /tmp:/tmp \  -it ghcr.io/unionlabs/uniond-release:$UNIOND_VERSION init $MONIKER \  --home /.union

_Where `MONIKER` is the preferred moniker you’d like to use on this node._

Note

Note the usage of the flags and arguments we pass to `docker run` run here:

*   `--user $(id -u):(id -g)` ensures that the container is being created and ran with the current user and their permissions
*   `--volume ~/.union:/.union` mounts the folder we created to the `/.union` folder of the container
*   `-it` ensures we are running the container interactively

After the `uniond init` command is done running, you should have a `.union` folder with the following contents:

*   Directoryconfig
    
    *   app.toml
    *   client.toml
    *   config.toml
    *   genesis.json
    *   node\_key.json
    *   priv\_validator\_key.json
    
*   Directorydata
    
    *   priv\_validator\_state.json
    

### [Issuing Sub-Commands to uniond](#issuing-sub-commands-to-uniond)

To run `uniond` sub-commands, it will be useful to alias the Docker command in your shell `.*rc` file.

For example, in `zsh`, you can add the following alias to your `.zshrc`:

    alias uniond='docker run -v ~/.union:/.union -v /tmp:/tmp --network host -it ghcr.io/unionlabs/uniond-release:$UNIOND_VERSION --home /.union'

_Where `UNIOND_VERSION` is v1.1.0_

This will enable you to issue `uniond` sub-commands with such as `uniond keys add` with ease.

### [Starting the Node](#starting-the-node)

To run a node using `uniond`, you’ll also need to expose ports to the container. We’ll use this as an opportunity to create a Docker Compose file four `uniond`.

A minimal Docker Compose file for `uniond` looks like this:

    services:  node:    image: ghcr.io/unionlabs/uniond-release:${UNIOND_VERSION}    volumes:      - ~/.union:/.union      - /tmp:/tmp    network_mode: "host"    restart: unless-stopped    command: start --home /.union

This will mount our chain configuration and settings folder while also exposing ports `26657`, `1317`, and `9093`.

After creating a `compose.yml` file with the contents above, you’ll be able to start your Union node with `docker compose`.

Caution

Before starting your Union node for the first time, you should configure your node correctly and obtain the genesis file.

For some configuration recommendations see our [Node Configuration](/infrastructure/node-operators/node-configuration) page.

You can download the genesis here:

[genesis.json](/genesis.json)

To run your node in detached mode, run:

    docker compose --file path/to/compose.yaml up --detach
