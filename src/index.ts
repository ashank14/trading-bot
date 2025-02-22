
import { getTweets } from "./get-tweets";
import { getAddress } from "./get-Address";
import { swap } from "./swap";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import axios from "axios";

interface Tweet {
    content: string,
    createdAt:string,
    id:string
}


const SOL_AMOUNT= 1*LAMPORTS_PER_SOL;
//get user from username
//create a list of usernames and get their userids into an array 
const usernames:string[]=["user1"];
const userid:any[]=[];


const fetchid = async()=>{
    for(let user of usernames){

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://twitter241.p.rapidapi.com/user?username=${user}`,
            headers: { 
            'x-rapidapi-host': 'twitter241.p.rapidapi.com', 
            'x-rapidapi-key': 'bf05cf0c9dmsh98d271e2c9eab67p16e1bajsna891d1b66569'
            }
        };
        
        const res:any=await axios.request(config);
        

        userid.push(res.data.result.data.user.result.rest_id);
    }    
}





//send user to main to get tweets in a loop


async function main(){
    
    //get tweets 
    
    
    //we have an array of all the users we are tracking
    const newTweets: Tweet[]=[];

    //loop through the array, get user's tweet into array, send to llm for token address,swap
    
    setInterval(async () => {

        for(let id of userid){
            const tweetsperuser:Tweet[]=await getTweets(id);
            for(let tweet of tweetsperuser){
                const newAddress=await getAddress(tweet.content);
                if(newAddress!=null){
                    swap(newAddress,SOL_AMOUNT);
                }
            }
        }
        
    }, 5000);
      

}

(async () => {
    await fetchid(); // Ensure user IDs are fetched before starting main
    main();
})();