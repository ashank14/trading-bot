
import { getTweets } from "./get-tweets";
import { getAddress } from "./get-Address";

interface Tweet {
    content: string,
    createdAt:string,
    id:string
}

//get user from username
//create a list of usernames and get their userids into an array 



//send user to main to get tweets in a loop

async function main(userId:string){
    //get tweets 
    /*const newTweets: Tweet[]= await getTweets(userId);
    newTweets.map(x=>{
        const newAddress=getAddress(x.content); //get token/contract address from llm
    });

    console.log(newTweets);*/
    const res=getAddress("hello");
    console.log(res);
}


main("2758205289");