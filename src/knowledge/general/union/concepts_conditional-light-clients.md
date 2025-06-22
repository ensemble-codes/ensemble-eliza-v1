Conditional Light Clients
=========================

When bridging into L2s such as [Scroll](https://scroll.io), the [IBC](/concepts/ibc) light client on L1AL1\_AL1A​ tracking a L2L2L2 on L1BL1\_BL1B​ needs to take the **Settlement Condition** into account. This is known as a conditional client. Union is the first team to ship conditional IBC clients.

_\* This is a conditional light client_

Above you can see the IBC L2 Light Client architecture. The **L2 Light Client** on L1AL1\_AL1A​ is tracking both the consensus of L2L2L2, and the settlements of L2L2L2 on L1BL1\_BL1B​ through the light client of L1BL1\_BL1B​ on L1AL1\_AL1A​.

The L1AL1\_AL1A​ light client on L2L2L2 is able to track the consensus of L1AL1\_AL1A​ directly, because L1AL1\_AL1A​ does not need to settle.
