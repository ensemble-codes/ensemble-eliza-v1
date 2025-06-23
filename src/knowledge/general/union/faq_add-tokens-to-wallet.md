Adding Tokens from Union Transfers to Wallets
=============================================

After transferring your assets to a different network, it’s possible your wallet won’t already recognize them.

[Getting the Token Denom](#getting-the-token-denom)
===================================================

To get your assets to show up again after they’ve been transferred, you will need to locate the token denom. Thankfully, btc.union.build makes this easy.

1.  Open up any transfer containing the assets you moved
    
2.  Hover over the asset near the top of the transfer pane
    

![screenshot highlighting where to hover your mouse](/faq/btc_union_token_hover.png)

3.  Copy the token denom from the pop-up

![screenshot highlighting denom info pop-up](/faq/btc_union_token_denom.png)

4.  From here you can add the token to your wallet using the denom

[Adding the Token to Your Wallet](#adding-the-token-to-your-wallet)
===================================================================

This process will be different depending on the wallet you’re using. Here we provide instructions for both Keplr and Leap.

[Keplr](#keplr)
---------------

1.  Open the Keplr extension
    
2.  Scroll down and select “Manage Asset List”
    

![screenshot highlighting where to manage assets in kelpr](/faq/kelpr_manage_assets.png)

3.  Click the ”+” in the top right corner of the extension
    
4.  Select the appropriate chain (for instance “Babylon Genesis”)
    
5.  Paste the token denom under the “Contract Address” field
    
6.  (Optional) Keplr may not autopopulate the remainder of the token information. If Keplr does not, you may copy the remainder of the token information from the pop-up on btc.union.build
    
7.  Click “Confirm”
    

[Leap](#leap)
-------------

1.  Open the Leap extension
    
2.  Select the destination chain (for instance “Babylon Genesis”)
    
3.  Click the gear icon above the list of your tokens
    

![screenshot highlighting where to manage assets in kelpr](/faq/leap_manage_assets.png)

4.  Click the ”+” in the top right corner of the extension
    
5.  Paste the denom into the “Coin minimum denom” field
    
6.  (Optional) Keplr may not autopopulate the remainder of the token information. If Keplr does not, you may copy the remainder of the token information from the pop-up on btc.union.build
    
7.  Click “Add Token”
    

[Finding Sent Packets](#finding-sent-packets)
---------------------------------------------

If your multisig UI does not already link you to your transfer on btc.union.build, you can find you packet [here](https://btc.union.build/explorer/find-packet) using the transaction hash.
