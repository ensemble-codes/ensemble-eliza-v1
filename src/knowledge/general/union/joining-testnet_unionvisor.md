Running Unionvisor
==================

Unionvisor is a utility for managing `uniond` deployments. It manages running, upgrading, and interacting with the node.

[Obtaining Unionvisor](#obtaining-unionvisor)
---------------------------------------------

We release container images of Unionvisor called bundles. Each bundle contains everything required for running Unionvisor and joining a particular network. The Unionvisor bundle for `union-testnet-10` is `bundle-testnet-10`. You can obtain the Unionvisor bundle for `union-testnet-10` from our [GitHub Container Registry](https://github.com/orgs/unionlabs/packages/container/package/bundle-testnet-10).

Alternatively, you can run the following command:

    docker pull ghcr.io/unionlabs/bundle-testnet-10:$UNIONVISOR_VERSION

_Where `UNIONVISOR_VERSION` is v1.1.0_

[Running Unionvisor](#running-unionvisor)
-----------------------------------------

Before running this image, we need to create a folder to host the chain configuration and state.

You can create this wherever you would like, but we’ll be doing so in our current user’s home directory.

Caution

It’s important that you will be able to edit this contents of this folder.

To create a directory for `unionvisor` in your user home directory, run:

    mkdir ~/.unionvisor

### [Initializing the Chain Config & State Folder](#initializing-the-chain-config--state-folder)

Now, using the `unionvisor` image and the folder we just created, we can initialize the contents of this folder.

To do this, we’ll be using Docker volumes.

    docker run \  --volume ~/.unionvisor:/.unionvisor \  --volume /tmp:/tmp \  -it ghcr.io/unionlabs/bundle-testnet-10:$UNIONVISOR_VERSION \  init --moniker $MONIKER \  --network union-testnet-10 \  --seeds ""

_Where `MONIKER` is the preferred moniker you’d like to use on this node._

Note

Note the usage of the flags and arguments we pass to `docker run` run here:

*   `--volume ~/.unionvisor:/.unionvisor` mounts the folder we created to the `/.unionvisor` folder of the container
*   `-it` ensures we are running the container interactively

After the above command is done running, you should have a `.unionvisor` folder with the following contents:

*   Directoryhome
    
    *   Directoryconfig
        
        *   app.toml
        *   client.toml
        *   config.toml
        *   genesis.json
        *   node\_key.json
        *   priv\_validator\_key.json
        
    *   Directorydata
        
        *   priv\_validator\_state.json
        
    
*   Directoryversions
    
    *   v1.1.0- uniond
    

### [Migrating an Existing Node (Optional)](#migrating-an-existing-node-optional)

If you have an existing node, either from running the `uniond` image or raw binary - you can migrate it to Unionvisor starting here.

To migrate, you only need to copy over your `uniond` state into the `~/.unionvisor/home` directory - then start Unionvisor normally.

If you have a `uniond` state saved to `~/.union`, you can run the following command.

    sudo cp -r ~/.union/* ~/.unionvisor/home

Then continue to follow the guide normally.

Note

We use `sudo` here because Docker created the files we are copying with elevated permissions.

### [Using Snapshots or State Sync](#using-snapshots-or-state-sync)

For networks that have been producing blocks for more than a few weeks, syncing from genesis is often not recommended. Most validators and node operators prefer to use node snapshots or state sync to jump start their nodes.

To use state sync or node snapshots with Unionvisor, you will need to use the `set-uniond-version` sub-command of Unionvisor. You should set Unionvisor to use the version of `uniond` that was used to generate the node snapshot or state sync snapshot.

You can use the `set-uniond-version` command as follows:

    docker run \  --volume ~/.unionvisor:/.unionvisor \  --volume /tmp:/tmp \  -it ghcr.io/unionlabs/bundle-testnet-10:$UNIONVISOR_VERSION \  set-uniond-version $UNIOND_VERSION

_Where `UNIOND_VERSION` is the version of `uniond` used when the snapshot was generated_

### [Issuing Sub-Commands to uniond via Unionvisor](#issuing-sub-commands-to-uniond-via-unionvisor)

To run `uniond` sub-commands, it will be useful to alias the Docker command in your shell `.*rc` file.

For example, in `zsh`, you can add the following alias to your `.zshrc`:

    alias uniond='docker run -v ~/.unionvisor:/.unionvisor -v /tmp:/tmp --network host -it ghcr.io/unionlabs/bundle-testnet-10:$UNIONVISOR_VERSION --log-level off call --'

_Where `UNIONVISOR_VERSION` is v1.1.0_

Note

*   The `unionvisor call` sub-command passes commands and arguments to `uniond`.
*   You may wish to pass `--log-level off` when calling Unionvisor to prevent extra output while issuing sub-commands.

This will enable you to issue `uniond` sub-commands with such as `uniond keys add` with ease.

### [Starting the Node](#starting-the-node)

To run a node using Unionvisor, you’ll also need to expose ports to the container. We’ll use this as an opportunity to create a Docker Compose file four Unionvisor.

A minimal Docker Compose file for Unionvisor looks like this:

    services:  node:    image: ghcr.io/unionlabs/bundle-testnet-10:$UNIONVISOR_VERSION    volumes:      - ~/.unionvisor:/.unionvisor      - /tmp:/tmp    network_mode: "host"    restart: unless-stopped    command: run --poll-interval 1000

This will mount our chain configuration and settings folder while also exposing ports `26657`, `1317`, and `9093`.

After creating a `compose.yml` file with the contents above, you’ll be able to start your Union node with `docker compose`.

Before starting your Union node for the first time, you should configure your node correctly.

For some configuration recommendations see our [Node Configuration](/infrastructure/node-operators/node-configuration) page.

To run your node in detached mode, run:

    docker compose --file path/to/compose.yaml up --detach
