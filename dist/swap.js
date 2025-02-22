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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swap = swap;
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const axios_1 = __importDefault(require("axios"));
const raydium_sdk_v2_1 = require("@raydium-io/raydium-sdk-v2");
const bs58_1 = __importDefault(require("bs58"));
const connection = new web3_js_1.Connection("https://mainnet.helius-rpc.com/?api-key=c7cecebd-d2b8-47c3-9317-3cbca20c79f7");
const owner = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode("2CjWX2pWbeX39NJLEmLiDPU1jL7HK9NFxAcbQaAMuCvtndibx87V2CMnvoxkK4ZEtF82KACDEykxSW12D6rE2Ruu"));
//3ADmrXxgrPWjwANzPvqtmfR2sAfwhci8DH62vUodHx6wrdKXCtKFReCpuLLg47jZTRGNwZyqU77y4UtXj9eSsbDK
const isV0Tx = true;
const slippage = 10;
function swap(address, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        //priority fee
        const { data } = yield axios_1.default.get(`${raydium_sdk_v2_1.API_URLS.BASE_HOST}${raydium_sdk_v2_1.API_URLS.PRIORITY_FEE}`);
        //get quote
        const { data: swapResponse } = yield axios_1.default.get(`${raydium_sdk_v2_1.API_URLS.SWAP_HOST}/compute/swap-base-in?inputMint=${spl_token_1.NATIVE_MINT}&outputMint=${address}&amount=${amount}&slippageBps=${slippage * 100}&txVersion=V0 `); // Use the URL xxx/swap-base-in or xxx/swap-base-out to define the swap type
        console.log(swapResponse);
        const mintInfo = yield connection.getParsedAccountInfo(new web3_js_1.PublicKey(address));
        console.log("inputAmount:", swapResponse.data.inputAmount);
        console.log("outputAmount:", swapResponse.data.outputAmount);
        const currentprice = Number((swapResponse.data.outputAmount / swapResponse.data.inputAmount));
        console.log(currentprice);
        //create txn
        const { data: swapTransactions } = yield axios_1.default.post(`${raydium_sdk_v2_1.API_URLS.SWAP_HOST}/transaction/swap-base-in`, {
            computeUnitPriceMicroLamports: String(data.data.default.h),
            swapResponse,
            txVersion: "V0",
            wallet: owner.publicKey.toBase58(),
            wrapSol: true,
            unwrapSol: false, // true means output mint receive sol, false means output mint received wsol
        });
        console.log(swapTransactions);
        //Deserialize
        const allTxBuf = swapTransactions.data.map((tx) => Buffer.from(tx.transaction, 'base64'));
        const allTransactions = allTxBuf.map((txBuf) => isV0Tx ? web3_js_1.VersionedTransaction.deserialize(txBuf) : web3_js_1.Transaction.from(txBuf));
        console.log(`total ${allTransactions.length} transactions`, swapTransactions);
        //Sign and execute
        let idx = 0;
        for (const tx of allTransactions) {
            idx++;
            const transaction = tx;
            transaction.sign([owner]);
            const txId = yield connection.sendTransaction(tx, { skipPreflight: true });
            const { lastValidBlockHeight, blockhash } = yield connection.getLatestBlockhash({
                commitment: 'finalized',
            });
            console.log(`${idx} transaction sending..., txId: ${txId}`);
            yield connection.confirmTransaction({
                blockhash,
                lastValidBlockHeight,
                signature: txId,
            }, 'confirmed');
            console.log(`${idx} transaction confirmed`);
        }
    });
}
