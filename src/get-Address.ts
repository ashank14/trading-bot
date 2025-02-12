
import OpenAI from "openai";
require("dotenv").config();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  
//parse token address from the tweet using an llm
export async function getAddress(content:string){
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are an AI agent. Given a tweet, identify if it mentions a Solana token by extracting a valid Solana token address (a 44-character base58 string). If a token address is found, return it; otherwise, return null. Ignore non-Solana addresses and irrelevant text. Ensure the output contains only the token address or null, with no additional formatting or explanations." },
            {
                role: "user",
                content: "this is a solona token:FopX8k2LYo6Rbm5UpLTCzA4pRxzGyU1ZdBt9VK7L1wKa",
            },
        ],
        store: true,
    });
    console.log(completion.choices[0].message);
    return(completion.choices[0].message);

}