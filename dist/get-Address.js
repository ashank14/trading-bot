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
exports.getAddress = getAddress;
const openai_1 = __importDefault(require("openai"));
require("dotenv").config();
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
//parse token address from the tweet using an llm
function getAddress(content) {
    return __awaiter(this, void 0, void 0, function* () {
        const completion = yield openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are an AI agent. Given a tweet, identify if it mentions a Solana token by extracting a valid Solana token address (a 44-character base58 string). If a token address is found, return it; otherwise, return null. Ignore non-Solana addresses and irrelevant text. Ensure the output contains only the token address or null, with no additional formatting or explanations. Only return the address if it is a bull post!" },
                {
                    role: "user",
                    content: "this is a solona token:FopX8k2LYo6Rbm5UpLTCzA4pRxzGyU1ZdBt9VK7L1wKa, long it",
                },
            ],
            store: true,
        });
        return (completion.choices[0].message.content);
    });
}
