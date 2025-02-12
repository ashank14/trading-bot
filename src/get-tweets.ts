import axios from "axios";

interface Tweet {
    content: string,
    createdAt:string,
    id:string
}

const THRESHOLD=1000*60*60*24; 

export async function getTweets(userId: string): Promise<Tweet[]> {
    let config = { 
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://twitter241.p.rapidapi.com/user-tweets?user=${userId}&count=5`,
        headers: { 
            'x-rapidapi-host': 'twitter241.p.rapidapi.com', 
            'x-rapidapi-key': 'bf05cf0c9dmsh98d271e2c9eab67p16e1bajsna891d1b66569'
        }
    };

    try {
        const response = await axios.request(config);
        
        const entries = response.data?.result?.timeline?.instructions
            ?.find((inst: any) => inst.entries)?.entries || [];

        const tweets: Tweet[] = entries.map((x: any) => ({
            content: x?.content?.itemContent?.tweet_results?.result?.legacy?.full_text || "No content",
            createdAt:x?.content?.itemContent?.tweet_results?.result?.legacy?.created_at,
            id:x?.content?.itemContent?.tweet_results?.result?.legacy?.id_str
        }));
        console.log(Date.now());
        return tweets.filter(x=> new Date(x.createdAt).getTime()> Date.now()-THRESHOLD);
    } catch (error) {
        console.error("Error fetching tweets:", error);
        return [];
    }
}
