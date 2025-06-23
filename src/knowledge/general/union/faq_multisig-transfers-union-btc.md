Multisig Transfers on btc.union.build
=====================================

This guide will walk you through sending transfers to and from Safe Wallet and Keplr multisigs. We will use uniBTC as the transfer asset and Ethereum and Babylon as the example networks. The guide requires that you have both a Safe Wallet and Keplr multisig that are funded with the gas tokens and assets you intend to transfer (in this guide ETH, BABY, uniBTC).

[Video Tutorial](#video-tutorial)
---------------------------------

If you prefer video tutorials, you can also follow [the video version of this guide](https://youtu.be/ajd3wHlyDYQ):

[![Union Multisig Video Thumbnail](/faq/union-multisig-video.png)](https://youtu.be/ajd3wHlyDYQ)

[Ethereum Multisig to Babylon Multisig](#ethereum-multisig-to-babylon-multisig)
-------------------------------------------------------------------------------

To start a multisig transfer with Safe, you will first need a multisig account created with [https://app.safe.global/](https://app.safe.global/).

Once you have a multisig created, you can follow the steps below to conduct your transfer with [https://btc.union.build](https://btc.union.build).

Note

Only the user creating the transaction needs to use the Union BTC app, other signers will only need access to signing through Safe Wallet.

### [Steps](#steps)

1.  Go to the “My custom apps” tab and click “Add custom Safe App”

Note

Union is working with Safe Wallet to have Union BTC listed on their official apps page.

![safe01](/faq/safe-01.png)

2.  Then enter the address `https://btc.union.build` into the “Safe App URL” field and check the box agreeing to use this app at your own risk. You can now add the app to Safe by clicking “Add”

![safe02](/faq/safe-02.png)

3.  Once added, you can now open the Union BTC Safe App.
    
4.  Once inside, you will need to connect your Safe wallet to the app. To do so, click “My Wallets” in the bottom left and then select “Safe Wallet”.
    

![safe03](/faq/safe-03.png) ![safe04](/faq/safe-04.png)

5.  With your wallet connected, you can now select the asset you would like to send, and it’s destination. In this case, we’re selected uniBTC on Ethereum as the source asset and uniBTC on Babylon as the destination asset. Then set your amount.
    
6.  Set the receiver. In our case, a Keplr multisig account. To do this, go to your Keplr multisig account and copy the address. Then go back to Safe and select the wallet icon. Here, paste in the Keplr address you copied.
    

![safe05](/faq/safe-05.png) ![safe06](/faq/safe-06.png)

7.  Finally, you can send the transfer which should prompt you to sign and submit the transaction via safe.
    
8.  If the multisig wallet needs more than one signer you will need to _**wait on this page**_ of the UI until the required threshold of signers has signed the transaction.
    

Note

Future versions of the Union app will show how many signers are still needed

[Babylon Multisig to Safe Multisig](#babylon-multisig-to-safe-multisig)
-----------------------------------------------------------------------

Once you’ve created your Keplr Multisig for Babylon, you can follow to steps below to submit a Union transfer with it.

### [Steps](#steps-1)

1.  Generate the transaction JSON. Go to [https://btc.union.build](https://btc.union.build) and select “Keplr Multisig”

![keplr01](/faq/keplr-01.png)

2.  Copy your Keplr Multisig address and paste it into the “SENDER” field

![keplr02](/faq/keplr-02.png)

3.  Select your source and destination assets. In this case we’re sending uniBTC from Babylon to Ethereum as uniBTC.
    
4.  Copy your Safe Wallet multisig address and paste it into the “RECEIVER” field. _**NOTE**_: Remove the prefix `eth:` from what the Safe copy button provides.
    

![keplr03](/faq/keplr-03.png)

5.  Specify the amount you would like to send.
    
6.  Finally, click “Export Message”
    

![keplr04](/faq/keplr-04.png)

7.  Now you can select the copy button to get the JSON blob Keplr will need

![keplr05](/faq/keplr-05.png)

7.  Now you will need to import the transaction into Keplr’s multisig UI at [https://multisig.keplr.app/](https://multisig.keplr.app/). Here you will want to select “Import Transaction” and then paste the JSON blob.
    
8.  After the transaction has been imported, you can continue signing it normally.
    