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
Object.defineProperty(exports, "__esModule", { value: true });
const swap_1 = require("./swap");
const web3_js_1 = require("@solana/web3.js");
const SOL_AMOUNT = 1 * web3_js_1.LAMPORTS_PER_SOL;
//get user from username
//create a list of usernames and get their userids into an array 
//send user to main to get tweets in a loop
function main(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        //get tweets 
        /*const newTweets: Tweet[]= await getTweets(userId);
        
        for(let tweet of newTweets){
            const newAddress=await getAddress(tweet.content);
    
            if(newAddress!=null){
                await swap(newAddress,SOL_AMOUNT);
            }
        }
    
        console.log(newTweets);
        const res=await getAddress("hello");
        console.log(res); */
        const add = "mntJrassAUTAxe14EX6a664x89YMGbKqUFV4qEERVee";
        (0, swap_1.swap)(add, SOL_AMOUNT);
    });
}
main("2758205289");
