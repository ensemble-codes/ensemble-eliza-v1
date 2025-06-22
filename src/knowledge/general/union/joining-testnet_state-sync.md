State Sync
==========

If the network has produced many blocks or has seen several binary upgrades, you may find it significantly easier to join the test network via state sync.

[Joining The Network Via State Sync](#joining-the-network-via-state-sync)
-------------------------------------------------------------------------

To join the network with state sync, you will need to

1.  Get trusted height information from an RPC
    
2.  Configure your node to use state sync
    
3.  Start your node
    

### [Getting Trusted Height Information](#getting-trusted-height-information)

Before joining the network using state sync, you will need to use one of our RPC nodes to obtain the current trusted height and the block hash of the trusted height.

To do this, you can run the following command:

    curl --silent $RPC_ENDPOINT/block | \  jq --raw-output '.result.block.header.height + "\n" + .result.block_id.hash'

You should then see output in the form of:

    <trusted_height><trusted_hash>

### [Configuring Your Node to Use State Sync](#configuring-your-node-to-use-state-sync)

Now, to configure your node to use state sync, you’ll need to edit the TOML file `~/.union/config/config.toml`.

Find the `statesync` TOML table, and using the information from the last step, set the fields as such:

    [statesync]enable = truerpc_servers = "<STATE_SYNC_NODE_1>,<STATE_SYNC_NODE_2>"trust_height = <trusted_height>trust_hash = "<trusted_hash>"trust_period = "400s"

Note

Two nodes are required here, however, the nodes do not need to be unique. You can have the same node listed twice.

### [Start Your Node](#start-your-node)

Now you should be able to start your node normally. You should see log messages saying it has “Discovered a new snapshot”
