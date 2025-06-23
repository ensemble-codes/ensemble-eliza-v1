Creating a Validator
====================

Before trying to create a validator, ensure you have the following task complete:

1.  Initialize your node
    
2.  Complete our intake form
    
3.  Receive UNO tokens
    
4.  Start your node
    
5.  Ensure your node has caught up to the network’s current height
    

Once all of these tasks are finished, you can continue with creating your validator.

[How Delegations Will Work](#how-delegations-will-work)
-------------------------------------------------------

To ensure quick update cycles of the testnet, we ask that you only have a self delegation of 1 UNO. The Union team will delegate more to you to ensure you and the other validators have a similar delegation. This will enable us to maintain the majority of the total voting power so that we can quickly conduct updates to the network.

As we get closer to a mainnet release, we will update staking and slashing parameters and ask for more realistic self delegations. For the meantime, we will ensure to testnet is configured to change quickly with minimum friction.

[Creating your validator](#creating-your-validator)
---------------------------------------------------

Now that you’re ready to create your validator, you can follow the steps below:

### [1) Create a Validator JSON File](#1-create-a-validator-json-file)

    touch validator.json

Add the following content to the file:

validator.json

    {  "pubkey": <PUBKEY>,  "amount": "1000000muno",  "moniker": "<MONIKER>",  "identity": "optional identity signature (ex. UPort or Keybase)",  "website": "validator's (optional) website",  "security": "validator's (optional) security contact email",  "details": "validator's (optional) details",  "commission-rate": "0.1",  "commission-max-rate": "0.2",  "commission-max-change-rate": "0.01",  "min-self-delegation": "1"}

Replacing:

*   `<PUBKEY>` with the result of running `uniond comet show-validator`
*   `<MONIKER>` with your moniker
*   And the optional content with your preferred details

### [2) Run the Create Validator Command](#2-run-the-create-validator-command)

Then you can submit this file using the `create-union-validator` sub-command:

    uniond tx poa create-validator path/to/validator.json \  --from $KEY_NAME \  --chain-id union-testnet-10

_Where `VALIDATOR_JSON_PATH` is the path to your `validator.json`_

Caution

If you’re running a node with a Docker container, your `validator.json` will need to be in a folder accessible by your Docker container.

If you’ve followed our instructions for setting up either of our Docker images, you should be able to place this file under `/.unionvisor` (for Unionvisor containers) or under `/.union` (for union-release containers).

For example, when creating a validator with `unionvisor`, you can

    touch ~/.unionvisor/validator.json
    # Then after editing the json content
    uniond tx poa create-validator /.unionvisor/validator.json \  --from $KEY_NAME \  --chain-id union-testnet-10

Note

If your keys are stored on a machine other than your node, you can pass the `--node-id` flag to override the node ID ensuring it’s the one from the node you’re making into a validator.

Note

If your own node isn’t set up to accept RPC request, you can send them to another node via the `--node` option.

[Epoch Staking & Validator Set Updates](#epoch-staking--validator-set-updates)
------------------------------------------------------------------------------

Union uses [Epoch Staking](/architecture/cometbls/#epoch-based-validator-rotation) to perform validator set updates. This means that the validator set is only updated once per epoch.

If you successfully create your validator during the middle of an epoch, your validator will join the active set once it rotates at the end of the current epoch.
