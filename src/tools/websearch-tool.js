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
exports.websearchTool = void 0;
const ai_1 = require("ai");
const zod_1 = require("zod");
const core_1 = require("@tavily/core");
const tvly = (0, core_1.tavily)({ apiKey: process.env.TAVILY_API_KEY });
exports.websearchTool = (0, ai_1.tool)({
    description: "Search the web for information",
    parameters: zod_1.z.object({
        queries: zod_1.z.array(zod_1.z.string().describe("The query to search for")),
    }),
    execute: (_a) => __awaiter(void 0, [_a], void 0, function* ({ queries }) {
        const results = yield Promise.all(queries.map((singleQuery) => tvly.search(singleQuery, {
            maxResults: 10,
            searchDepth: "advanced",
        })));
        return results;
    }),
});
