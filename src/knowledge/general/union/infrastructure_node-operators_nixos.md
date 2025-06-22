NixOS
=====

NixOS deployments can use our **module** to easily manage their validator. It creates a systemd service with a production configuration

Caution

The current example does not support remote signers yet. We will expand the guide once [horcrux](https://github.com/strangelove-ventures/horcrux) support is implemented.

[Configuration](#configuration)
-------------------------------

Below is an example configuration.nix which can be used in production.

Caution

The example currently uses `git+ssh://` syntax rather than `github:` syntax because our repository is not public yet. Once it is, this will be simplified. When this happens, `GIT_LFS_SKIP_SMUDGE` will also no longer be required.

    {  inputs = {    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";    union.url = "git+ssh://git@github.com/unionlabs/union";  };  outputs = { self, nixpkgs, union, ... }:    {      nixosConfigurations.testnet-validator =        let          system = "x86_64-linux";          pkgs = import nixpkgs { inherit system; };        in        nixpkgs.lib.nixosSystem {          inherit system;          modules = [            union.nixosModules.unionvisor            {              system.stateVersion = "23.11";              # Base configuration for openstack-based VPSs              imports = [ "${nixpkgs}/nixos/modules/virtualisation/openstack-config.nix" ];
                  # Allow other validators to reach you              networking.firewall.allowedTCPPorts = [ 80 443 26656 26657 ];
                  # Unionvisor module configuration              services.unionvisor = {                enable = true;                moniker = "your-testnet-moniker";              };
                  # OPTIONAL: Some useful inspection tools for when you SSH into your validator              environment.systemPackages = with pkgs; [                bat                bottom                helix                jq                fastfetch                tree              ];            }          ];        };    };}

You can then deploy the configuration by running

    GIT_LFS_SKIP_SMUDGE=1 nixos-rebuild switch --flake .\#testnet-validator --target-host user@validator.domain -L

[Upgrading](#upgrading)
-----------------------

To upgrade to newer versions, simply run

    nix flake updateGIT_LFS_SKIP_SMUDGE=1 nixos-rebuild switch --flake .\#testnet-validator --target-host user@validator.domain -L

This will pull in the latest changes to union configurations and prepare your node for future upgrades.
