# Swap API Client
A TypeScript client for interacting with the Swap API on Solana. This client provides methods for getting quotes, creating transactions, and executing token swaps on the Solana blockchain.

## Features

* Get quotes for token swaps
* Generate versioned transactions
* Execute transactions with proper signing and simulation
* Support for exact-in and exact-out swaps
* Configurable slippage tolerance
* Maximum hop limit for routing

Installation
Copy
```
npm install @hellomoon/swap-api
```

### Quick Start
```
import { clientFactory } from '@hellomoon/swap-api';

const client = clientFactory({
    rpcUrl: "YOUR_SOLANA_RPC_URL",
    apiUrl: "YOUR_CUSTOM_API_URL",
    accessToken: "YOUR_ACCESS_TOKEN"
});
```

### Get a quote
```
const quote = await client.getQuote({
    tokenIn: "TOKEN_IN_PUBKEY",
    tokenOut: "TOKEN_OUT_PUBKEY",
    action: "exactIn",
    amount: "1000000", // Amount in lamports
    slippageBps: 50, // 0.5% slippage tolerance
    userPubkey: "USER_PUBKEY",
    maxHops: 2
});
```


### Get and execute a transaction
```
const txnResponse = await client.getVersionedTransaction({
    tokenIn: "TOKEN_IN_PUBKEY",
    tokenOut: "TOKEN_OUT_PUBKEY",
    action: "exactIn",
    amount: "1000000",
    slippageBps: 50,
    userPubkey: "USER_PUBKEY",
    maxHops: 2,
    computeBudget: 1000000,
    priorityFee: 100000
});

const versionedTxn = client.convertTransaction(txnResponse.txn);
const signature = await client.executeTransaction({
    keyPair: yourKeyPair, // Your Solana KeyPair
    txn: versionedTxn
});
```
