Direct
======

Direct IBC connections are what most chains leverage, and are currently the only option when leveraging the vanilla IBC stack. Union’s hub-and-spoke model is supported, but has to leverage [packet-forward middleware](https://github.com/cosmos/ibc-apps/tree/main/middleware/packet-forward-middleware). There are a few fundamental downsides to PFM, described in our research on [statelenses](https://research.union.build/Union-Research-4f780b07025b4c9b8014b8aeea68dbad?p=9e3d6578ec0e48fca8e502a0d28f485c&pm=s) and [intents](https://research.union.build/Union-Research-4f780b07025b4c9b8014b8aeea68dbad?p=10c79e5af45d80a3a0f8dde7159138af&pm=s).

Tip

Use [`recursive connections`](/protocol/connections/recursive) and [`ucs03-zkgm-0`](/protocol/channels/ucs03-zkgm) instead for faster bridging and lower costs.
