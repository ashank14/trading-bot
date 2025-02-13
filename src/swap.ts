
import { Connection, Keypair, Transaction, VersionedTransaction, sendAndConfirmTransaction } from '@solana/web3.js'
import { NATIVE_MINT } from '@solana/spl-token'
import axios from 'axios'
import { API_URLS } from '@raydium-io/raydium-sdk-v2'
import bs58 from "bs58"; 

 

const connection=new Connection("https://solana-mainnet.g.alchemy.com/v2/Mp5gtp72KbToY9ANJEg7n_iCg5coojtW");
const owner = Keypair.fromSecretKey(bs58.decode("3ADmrXxgrPWjwANzPvqtmfR2sAfwhci8DH62vUodHx6wrdKXCtKFReCpuLLg47jZTRGNwZyqU77y4UtXj9eSsbDK"));
//3ADmrXxgrPWjwANzPvqtmfR2sAfwhci8DH62vUodHx6wrdKXCtKFReCpuLLg47jZTRGNwZyqU77y4UtXj9eSsbDK

const slippage=10;

export async function swap(address:string,amount:number ){
 
    const { data: swapResponse } = await axios.get(
        `${ 
          API_URLS.SWAP_HOST
        }/compute/swap-base-in?inputMint=${NATIVE_MINT }&outputMint=${address}&amount=${amount}&slippageBps=${
          slippage * 100}&txVersion=${0}`
      ) // Use the URL xxx/swap-base-in or xxx/swap-base-out to define the swap type
       

} 