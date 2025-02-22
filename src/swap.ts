
import { Connection, Keypair, Transaction, VersionedTransaction, sendAndConfirmTransaction,PublicKey } from '@solana/web3.js'
import { NATIVE_MINT } from '@solana/spl-token'
import axios from 'axios'
import { API_URLS } from '@raydium-io/raydium-sdk-v2'
import bs58 from "bs58"; 

 

const connection=new Connection("https://mainnet.helius-rpc.com/?api-key=c7cecebd-d2b8-47c3-9317-3cbca20c79f7");
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
      console.log(swapResponse);

    
      

      const tokensReceived=swapResponse.data.outputAmount;

      
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




      
      //track pnl
      const profit=20;
      const loss=15;
      
      const interval = setInterval(async () => {
        // Fetch latest price
        const { data: swapResponse } = await axios.get(
          `${API_URLS.SWAP_HOST}/compute/swap-base-in?inputMint=${address}&outputMint=${NATIVE_MINT}&amount=${tokensReceived}&slippageBps=${
            slippage * 100}&txVersion=V0`
        );
    
        const receivedSol = swapResponse.data.outputAmount;
        const pnl = ((receivedSol - amount) / amount) * 100;
    
        console.log(`PnL: ${pnl.toFixed(2)}%`);
    
        if (pnl >= profit || pnl <= -loss) {
          console.log(`Selling due to PnL condition met.`);
          
          // Execute sell order here

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
              }/compute/swap-base-in?inputMint=${address}&outputMint=${NATIVE_MINT}&amount=${tokensReceived}&slippageBps=${
                slippage * 100}&txVersion=V0 `    
            ) // Use the URL xxx/swap-base-in or xxx/swap-base-out to define the swap type
            console.log(swapResponse);
            
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
              wrapSol: false,
              unwrapSol: true, // true means output mint receive sol, false means output mint received wsol 
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


    
          clearInterval(interval); // Stop checking PnL
        }
      }, 5000); 
      
} 