import { Connection, VersionedTransaction } from "@solana/web3.js";
import {
  ExecuteTransactionParams,
  GetQuoteRequest,
  GetQuoteResponse,
  GetTxnResponse,
  GetVersionedTransactionRequest,
} from "./model";
import bs58 from "bs58";

export * from "./model";

export type Endpoint = "/get_quote" | "/get_transaction";

interface AggApiClient {
  /**
   * Used to receive a quote response from aggregator API.
   * @example
   * const params: GetVersionedTransactionRequest = {
   *   tokenIn: "token-in-pubkey", //pubkey as string
   *   tokenOut: "token-out-pubkey", //pubkey as string
   *   action: "exactOut", //specifying amount for tokenOut
   *   slippageBps: 100, //slippage conversion 1% = 100
   *   amount: "1000", //lamports
   *   userPubkey: "user-pub-key", //pubkey as string
   *   maxHops: 2,
   * };
   *
   * const response = await apiClient.getQuote(message);
   * @param {GetQuoteRequest} data Parameters to control quote response
   * @returns {Promise<GetQuoteResponse>}
   */
  getQuote(data: GetQuoteRequest): Promise<GetQuoteResponse>;
  /**
   * Used to receive a versioned transaction to be signed and sent from aggregator API.
   * @example
   * const params: GetVersionedTransactionRequest = {
   *   tokenIn: "token-in-pubkey", //pubkey as string
   *   tokenOut: "token-out-pubkey", //pubkey as string
   *   action: "exactIn", //specifying amount for tokenIn
   *   slippageBps: 50, //slippage conversion 0.5% = 50
   *   amount: "100", //lamports
   *   userPubkey: "user-pub-key", //pubkey as string
   *   maxHops: 2,
   * };
   * const response = await apiClient.getVersionedTransaction(params);
   * const versionedTxn = apiClient.convertTransaction(response.txn);
   * const sig = await apiClient.executeTransaction({
   *   keyPair: key,
   *   txn: versionedTxn,
   * });
   * @param {GetVersionedTransactionRequest} data
   * @returns {Promise<GetTxnResponse>}
   */
  getVersionedTransaction(
    data: GetVersionedTransactionRequest
  ): Promise<GetTxnResponse>;
  /**
   * Takes a bs58 encoded transaction, decodes it and converts it into a VersionedTransaction
   * @param {string} txn
   * @returns {VersionedTransaction}
   */
  convertTransaction(txn: string): VersionedTransaction;
  /**
   * Signs a VersionedTransaction with keyPair, simulates the transaction, then sends it.
   * @param {ExecuteTransactionParams} data
   * @returns {Promise<string>}
   */
  executeTransaction(data: ExecuteTransactionParams): Promise<string>;
}

const fetchPost = async (
  baseUrl: string,
  url: Endpoint,
  body: any,
  access_token: string
) => {
  const response = await fetch(`${baseUrl}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify(body),
  });
  return response.json();
};

const getConnection = (rpcUrl: string) => {
  return new Connection(rpcUrl);
};

/**
 * @example
 * //example of instantiating Client
 * const apiClient = apiClientFactory({rpcUrl: "rpcUrl"});
 * //usage
 * const quote = await apiClient.getQuote({...params});
 * const txn = await apiClient.getMessage({...txnParams});
 * @returns {AggApiClient} instance of AggApiClient
 */
export const clientFactory = ({
  apiUrl,
  rpcUrl,
  accessToken,
}: Readonly<{
  apiUrl: string;
  rpcUrl: string;
  accessToken: string;
}>): AggApiClient => {
  const conn = getConnection(rpcUrl);
  const baseUrl = apiUrl;
  return {
    getQuote: async (data: GetQuoteRequest) => {
      return (await fetchPost(
        baseUrl,
        "/get_quote",
        data,
        accessToken
      )) as GetQuoteResponse;
    },
    getVersionedTransaction: async (data: GetVersionedTransactionRequest) => {
      return (await fetchPost(
        baseUrl,
        "/get_transaction",
        data,
        accessToken
      )) as GetTxnResponse;
    },
    convertTransaction: (txn: string): VersionedTransaction => {
      return VersionedTransaction.deserialize(bs58.decode(txn));
    },
    executeTransaction: async (data: ExecuteTransactionParams) => {
      const { txn, keyPair } = data;
      txn.sign([keyPair]);
      const sim = await conn.simulateTransaction(txn);
      if (sim.value.err) {
        console.error(sim.value.err);
        console.error(sim.value.logs);
        throw new Error("Transaction Sim Response resulted in error");
      }
      return await conn.sendRawTransaction(txn.serialize());
    },
  };
};