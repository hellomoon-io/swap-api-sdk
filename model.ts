import {Keypair, VersionedTransaction} from "@solana/web3.js";

export type Action = "exactIn" | "exactOut";

export type GetQuoteRequest = {
  tokenIn: string;
  tokenOut: string;
  action: Action;
  amount: string;
  slippageBps?: number; // optional since it has a default in Rust
  maxHops?: number; // optional since it has a default in Rust
  exemptFees?: boolean; // optional since it has a default in Rust
};

type GenericQuote = {
  pool: string;
  swapContext: any; // This might need a more specific type depending on your needs
  direction: string;
  amountIn: string; // u64 as string
  amountOut: string; // u64 as string
  feeTaken: string; // u64 as string
  token0Impact: string; // Bps as decimal string
  token1Impact: string; // Bps as decimal string
};


export type GetQuoteResponse = {
  aggregatorFee: string; // u64 as string
  slot: string; // u64 as string
  timestamp: string; // u64 as string
  path: GenericQuote[]; // Vec of quotes
  minAmountOutOrMaxIn: string; // u64 as string
};

export type GetVersionedTransactionRequest = {
  tokenIn: string;
  tokenOut: string;
  action: Action; // assuming Action is an enum with these values
  amount: string; // u64 is represented as string in JS due to precision
  userPubkey: string;
  maxHops?: number; // optional since it has a default
  slippageBps?: number; // optional since it has a default
  computeBudget?: number,
  priorityFee?: number,
};

export type GetTxnResponse = {
  txn: string;
};

export type ExecuteTransactionParams = {
  keyPair: Keypair,
  txn: VersionedTransaction
};
