"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientFactory = void 0;
var web3_js_1 = require("@solana/web3.js");
var bs58_1 = require("bs58");
var fetchPost = function (baseUrl, url, body) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch("".concat(baseUrl).concat(url), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.json()];
        }
    });
}); };
var getConnection = function (rpcUrl) {
    return new web3_js_1.Connection(rpcUrl);
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
var clientFactory = function (_a) {
    var apiUrl = _a.apiUrl, rpcUrl = _a.rpcUrl;
    var conn = getConnection(rpcUrl);
    return {
        getQuote: function (data) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetchPost(apiUrl, "/get_quote", data)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); },
        getVersionedTransaction: function (data) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetchPost(apiUrl, "/get_transaction", data)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); },
        convertTransaction: function (txn) {
            return web3_js_1.VersionedTransaction.deserialize(bs58_1.default.decode(txn));
        },
        executeTransaction: function (data) { return __awaiter(void 0, void 0, void 0, function () {
            var txn, keyPair, sim;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        txn = data.txn, keyPair = data.keyPair;
                        txn.sign([keyPair]);
                        return [4 /*yield*/, conn.simulateTransaction(txn)];
                    case 1:
                        sim = _a.sent();
                        if (sim.value.err) {
                            console.error(sim.value.err);
                            console.error(sim.value.logs);
                            throw new Error("Transaction Sim Response resulted in error");
                        }
                        return [4 /*yield*/, conn.sendRawTransaction(txn.serialize())];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
    };
};
exports.clientFactory = clientFactory;
