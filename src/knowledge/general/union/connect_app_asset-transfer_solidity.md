ucs03-zkgm Asset Transfer Tutorial - Solidity
=============================================

[Prerequisites](#prerequisites)
===============================

This tutorial assumes that you have experience creating contracts in Solidity.

The Union team uses [Nix](https://nixos.org/) to manage developer environments. While this tutorial may mention different developer tools, it will not guide you through setting each one up.

This tutorial uses [foundry](https://book.getfoundry.sh/getting-started/installation) to create and manage the solidity contract.

This tutorial assumes ucs03-zkgm has been deployed to the EVM you’re deploying your contract to.

[Transfer](#transfer)
=====================

To demonstrate asset transfers with ucs03, this tutorial will walk you through creating a simple contract that sends UNO to Union.

[Project Bootstrapping](#project-bootstrapping)
-----------------------------------------------

Initialize a new foundry project to house the Solidity contract.

Terminal window

    forge init ucs03-asset-transfer

This will create a project with the following folder structure.

*   Directoryucs03-asset-transfer
    
    *   foundry.toml
    *   Directorylib
        
        *   forge-std
        
    *   README.md
    *   Directoryscript
        
        *   Counter.s.sol
        
    *   Directorysrc
        
        *   Counter.sol
        
    *   Directorytest
        
        *   Counter.t.sol
        
    

*   Rename `script/Counter.s.sol` -> `script/Transfer.s.sol`
*   Rename `src/Counter.sol` -> `src/Transfer.sol`.
*   Delete the `test/` folder as it won’t be used in this example.

### [Contract Source](#contract-source)

This demonstrates creating an interface, `Ucs03` to expose the transfer function from the already deployed ucs03-zkgm contract. Using the exposed interface of ucs03-zkgm, this contract has a function `transferAsset` to conduct a set transfer of 1 UNO.

This tutorial only takes advantage of the `transfer` function from ucs03-zkgm. To see a full list of functions made available by ucs03-zkgm, refer to the solidity contract in our [repository](https://github.com/unionlabs/union/blob/49dfa17d04b52509e5122d13e79bfc4a65d4a811/evm/contracts/apps/ucs/03-zkgm/Zkgm.sol#L296)

src/Transfer.sol

    pragma solidity ^0.8.27;
    import {IERC20} from "forge-std/interfaces/IERC20.sol";
    interface Ucs03 {  function transfer(      uint32 channelId,      bytes calldata receiver,      address baseToken,      uint256 baseAmount,      bytes calldata quoteToken,      uint256 quoteAmount,      uint64 timeoutHeight,      uint64 timeoutTimestamp,      bytes32 salt  ) external;}
    contract Transfer {    address public constant zkgm = 0x7B7872fEc715C787A1BE3f062AdeDc82b3B06144;    address public constant muno = 0xF2865969cF99A28Bb77e25494fE12D5180fE0efD;    bytes32 public constant salt = bytes32("0xF2865969cF99A28Bb77e25494fE1");
      function transferAsset() public {    IERC20(muno).approve(zkgm, 1000000);
        Ucs03(zkgm).transfer(      90,      hex"1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",      muno,      1000000,      "muno",      1000000,      1000000000000,      2737670312,      salt    );  }}

### [Contract Running Script](#contract-running-script)

script/Transfer.s.sol

    pragma solidity ^0.8.27;
    import {Script, console} from "forge-std/Script.sol";import {Transfer} from "../src/Transfer.sol";import {IERC20} from "forge-std/interfaces/IERC20.sol";
    contract TransferScript is Script {  address public constant UNO = 0xF2865969cF99A28Bb77e25494fE12D5180fE0efD;
      function run() public {    uint256 privateKey = vm.envUint("PRIVATE_KEY");    vm.startBroadcast(privateKey);    Transfer transfer = new Transfer();
        IERC20(UNO).transfer(address(transfer), 1500000);
        console.log("transferring");    transfer.transferAsset();    console.log("complete");    vm.stopBroadcast();  }}

[Deploying the contract](#deploying-the-contract)
-------------------------------------------------

The contract can then be deployed to Holesky as follows.

Terminal window

    forge script script/Transfer.s.sol:TransferScript \  --rpc-url $RPC_URL \  --private-key $PRIVATE_KEY \  --broadcast
