Frequently Asked Questions
==========================

As we continue onboarding validators and expanding the testnet, we’ll populate this page with FAQs in regard to becoming a validator on the Union Testnet.

### [How can I become a validator?](#how-can-i-become-a-validator)

The Union testnet validator set is currently proof-of-authority, mirroring the mainnet configuration. We are not actively seeking new validators at this time.

### [Why can’t I submit transactions to `localhost` when using `docker run`?](#why-cant-i-submit-transactions-to-localhost-when-using-docker-run)

Ensure you have exposed your host machine’s network via the `--network` flag in docker.

### [My query commands aren’t using values from my client config? (uniond v0.25.0 and lower)](#my-query-commands-arent-using-values-from-my-client-config-uniond-v0250-and-lower)

Due to [an issue in the cosmos-sdk](https://github.com/cosmos/cosmos-sdk/issues/18868), commands using AutoCLI do not respect the `--home` flag and instead always try and read the default home. As a temporary fix, we’ve removed the behavior reading the default home, always require a `--home` flag, and moved all `tx` commands away from AutoCLI. However, `query` commands still use AutoCLI and won’t read the `--home` flag.

To get around this behavior, we suggest always supplying `--node` and `--chain-id` when using query commands.

### [Can I have access to the Union GitHub repository?](#can-i-have-access-to-the-union-github-repository)

You can find the Union monorepo at [unionlabs/union](https://github.com/unionlabs/union/)

### [Other questions?](#other-questions)

Please [join our Discord](https://discord.union.build) and ask around in our community.
