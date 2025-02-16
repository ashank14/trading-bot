
import { Connection, Keypair, Transaction, VersionedTransaction, sendAndConfirmTransaction } from '@solana/web3.js'
import { NATIVE_MINT } from '@solana/spl-token'
import axios from 'axios'
import { API_URLS } from '@raydium-io/raydium-sdk-v2'
import bs58 from "bs58"; 

 

const connection=new Connection("https://solana-mainnet.g.alchemy.com/v2/Mp5gtp72KbToY9ANJEg7n_iCg5coojtW");
const owner = Keypair.fromSecretKey(bs58.decode("2CjWX2pWbeX39NJLEmLiDPU1jL7HK9NFxAcbQaAMuCvtndibx87V2CMnvoxkK4ZEtF82KACDEykxSW12D6rE2Ruu"));


//3ADmrXxgrPWjwANzPvqtmfR2sAfwhci8DH62vUodHx6wrdKXCtKFReCpuLLg47jZTRGNwZyqU77y4UtXj9eSsbDK
const isV0Tx = true;

const slippage=10;

export async function swap(address:string,amount:number ){


  //priority fee
  const { data } = await axios.get<{
    id: string
    success: boolean
    data: { default: { vh: number; h: number; m: number } }
  }>(`${API_URLS.BASE_HOST}${API_URLS.PRIORITY_FEE}`)

    //get quote
    const { data: swapResponse } = await axios.get(
        `${ 
          API_URLS.SWAP_HOST
        }/compute/swap-base-in?inputMint=${NATIVE_MINT}&outputMint=${address}&amount=${amount}&slippageBps=${
          slippage * 100}&txVersion=V0 `    
      ) // Use the URL xxx/swap-base-in or xxx/swap-base-out to define the swap type
       
      //create txn
      const { data: swapTransactions } = await axios.post<{
        id: string
        version: string
        success: boolean
        data: { transaction: string }[]
      }>(`${API_URLS.SWAP_HOST}/transaction/swap-base-in`, {
        computeUnitPriceMicroLamports: String(data.data.default.h),
        swapResponse,
        txVersion:"V0",
        wallet: owner.publicKey.toBase58(),
        wrapSol: true,
        unwrapSol: false, // true means output mint receive sol, false means output mint received wsol
      })

      console.log(swapTransactions);

      //Deserialize
      const allTxBuf = swapTransactions.data.map((tx) => Buffer.from(tx.transaction, 'base64'))
      const allTransactions = allTxBuf.map((txBuf) =>
        isV0Tx ? VersionedTransaction.deserialize(txBuf) : Transaction.from(txBuf)
      )
    
      console.log(`total ${allTransactions.length} transactions`, swapTransactions);


      //Sign and execute
      let idx = 0
      
      for (const tx of allTransactions) {
        idx++
        const transaction = tx as VersionedTransaction
        transaction.sign([owner])
        const txId = await connection.sendTransaction(tx as VersionedTransaction, { skipPreflight: true })
        const { lastValidBlockHeight, blockhash } = await connection.getLatestBlockhash({
          commitment: 'finalized',
        })
        console.log(`${idx} transaction sending..., txId: ${txId}`)
        await connection.confirmTransaction(
          {
            blockhash,
            lastValidBlockHeight,
            signature: txId,
          },
          'confirmed'
        )
        console.log(`${idx} transaction confirmed`)
      }
} 