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
exports.getTweets = getTweets;
const axios_1 = __importDefault(require("axios"));
const THRESHOLD = 1000 * 60 * 60 * 24;
function getTweets(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
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
            const response = yield axios_1.default.request(config);
            const entries = ((_e = (_d = (_c = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b.timeline) === null || _c === void 0 ? void 0 : _c.instructions) === null || _d === void 0 ? void 0 : _d.find((inst) => inst.entries)) === null || _e === void 0 ? void 0 : _e.entries) || [];
            const tweets = entries.map((x) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
                return ({
                    content: ((_e = (_d = (_c = (_b = (_a = x === null || x === void 0 ? void 0 : x.content) === null || _a === void 0 ? void 0 : _a.itemContent) === null || _b === void 0 ? void 0 : _b.tweet_results) === null || _c === void 0 ? void 0 : _c.result) === null || _d === void 0 ? void 0 : _d.legacy) === null || _e === void 0 ? void 0 : _e.full_text) || "No content",
                    createdAt: (_k = (_j = (_h = (_g = (_f = x === null || x === void 0 ? void 0 : x.content) === null || _f === void 0 ? void 0 : _f.itemContent) === null || _g === void 0 ? void 0 : _g.tweet_results) === null || _h === void 0 ? void 0 : _h.result) === null || _j === void 0 ? void 0 : _j.legacy) === null || _k === void 0 ? void 0 : _k.created_at,
                    id: (_q = (_p = (_o = (_m = (_l = x === null || x === void 0 ? void 0 : x.content) === null || _l === void 0 ? void 0 : _l.itemContent) === null || _m === void 0 ? void 0 : _m.tweet_results) === null || _o === void 0 ? void 0 : _o.result) === null || _p === void 0 ? void 0 : _p.legacy) === null || _q === void 0 ? void 0 : _q.id_str
                });
            });
            console.log(Date.now());
            return tweets.filter(x => new Date(x.createdAt).getTime() > Date.now() - THRESHOLD);
        }
        catch (error) {
            console.error("Error fetching tweets:", error);
            return [];
        }
    });
}
