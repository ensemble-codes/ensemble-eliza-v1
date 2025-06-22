Docker Compose
==============

This guide assumes you are familiar with running a Union validator. If not, start with the [validator guide](/joining-testnet/getting-started/).

[docker-compose](https://docs.docker.com/compose/) is a tool for running containers in a declarative manner. This allows for better automation, upgrades, and monitoring.

[Configuration](#configuration)
-------------------------------

Our base `compose.yml` is fairly simple:

    services:  node:    image: "ghcr.io/unionlabs/uniond-release:$UNIOND_VERSION"    volumes:      - ~/.union:/.union      - /tmp:/tmp    network_mode: "host"    restart: unless-stopped    command: start --home /.union

Pay special attention to the `volumes` key. Here we map an already initialized `~/.uniond` directory to the `node` service. The `~/.uniond` directory should contain a `config` and `data` directory. To properly set these up, check out the [validator guide](/joining-testnet/getting-started/).

[Monitoring](#monitoring)
-------------------------

We suggest adding additional monitoring services, such as [datadog](https://www.datadoghq.com/).
