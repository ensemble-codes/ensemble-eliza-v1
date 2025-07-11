Ceremony
========

Union’s Ceremony has the following components:

*   Web app [ceremony.union.build](https://ceremony.union.build)
*   [MPC client](https://github.com/unionlabs/union/pkgs/container/union%2Fmpc-client), running in the terminal
*   The coordinator, managing the queue and aggregating uploads.

We use [Nix](https://nixos.org) to create fully reproducible builds of all components and provide commands so that you can build them yourself.

[Web App](#web-app)
-------------------

Deployed on [ceremony.union.build](https://ceremony.union.build), Handles auth and shows queue status. Also shows all contributions.

You can build it locally like this:

Terminal window

    GIT_LFS_SKIP_SMUDGE=true nix build github:unionlabs/union/release/ceremony#ceremony

[MPC Client](#mpc-client)
-------------------------

Image published [here](https://github.com/unionlabs/union/pkgs/container/union%2Fmpc-client), handles the generation of the contribution, generation of the gpg key, and signs/uploads the contributions.

You can build it locally like this on a `x86_64-linux` machine:

Terminal window

    GIT_LFS_SKIP_SMUDGE=true nix build github:unionlabs/union/bbfaa2f39d0183c2fd6c1d2505fad6c64ddb39e1#packages.x86_64-linux.mpc-client -L

and load the image like this on a `x86_64-linux` machine::

Terminal window

    docker load -i ./result

[MPC Coordinator](#mpc-coordinator)
-----------------------------------

The coordinator has two components:

1.  Postgres, managing the queue and contributions. Hosted by Supabase.
2.  The `mpc-coordinator` service, verifying incoming contributions. Hosted by Hetzner.

You can see the database schema [here](https://github.com/unionlabs/union/blob/bbfaa2f39d0183c2fd6c1d2505fad6c64ddb39e1/mpc/coordinator/database.sql), and you can build the service locally like this on a `x86_64-linux` machine:

Terminal window

    GIT_LFS_SKIP_SMUDGE=true nix build github:unionlabs/union/bbfaa2f39d0183c2fd6c1d2505fad6c64ddb39e1#packages.x86_64-linux.mpc-coordinator -L

There are no trust assumptions on the database, as at the end of the ceremony all contributions will be published and verifiable by all.
