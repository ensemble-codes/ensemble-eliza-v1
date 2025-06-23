Unjail a Validator
==================

For whatever reason your validator becomes jailed while partaking in the Union network, you can unjail your validator with a simple command.

[The Unjail command](#the-unjail-command)
-----------------------------------------

Once your validator is unbonded and jailed, you can use the unjail command to rejoin the active set.

The unjail command is a transaction command from the slashing module and can be submitted like this:

Terminal window

    uniond tx slashing unjail --from $KEY_NAME

[Epoch Staking & Validator Set Updates](#epoch-staking--validator-set-updates)
------------------------------------------------------------------------------

Just like [creating your validator](/joining-testnet/creating-validators/#epoch-staking--validator-set-updates), once you’ve unjailed your validator, they’ll rejoin the active set at the end of the current epoch.
