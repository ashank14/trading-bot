
import { getTweets } from "./get-tweets";
import { getAddress } from "./get-Address";
import { swap } from "./swap";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
 
interface Tweet {
    content: string,
    createdAt:string,
    id:string
}


const SOL_AMOUNT= 1*LAMPORTS_PER_SOL;
//get user from username
//create a list of usernames and get their userids into an array 



//send user to main to get tweets in a loop


async function main(userId:string){
    /*
    //get tweets 
    const newTweets: Tweet[]= await getTweets(userId);
    
    for(let tweet of newTweets){
        const newAddress=await getAddress(tweet.content);

        if(newAddress!=null){
            await swap(newAddress,SOL_AMOUNT);
        }
    }

    console.log(newTweets);
    const res=await getAddress("hello");
    console.log(res); 

    const add="mntJrassAUTAxe14EX6a664x89YMGbKqUFV4qEERVee";
    await swap(add,SOL_AMOUNT);*/
    await swap("419ZC5PrQsdj4iXEUqsnPnubk4trxNbFa81Qvz3jcpgj",SOL_AMOUNT);
    

}


main("2758205289");