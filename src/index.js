"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = require("@ai-sdk/openai");
const ai_1 = require("ai");
require("dotenv/config");
const readline = __importStar(require("node:readline/promises"));
const websearch_tool_1 = require("./tools/websearch-tool");
const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const messages = [];
function formatResultsAsPrettyJSON(responses) {
    return JSON.stringify(responses, null, 2);
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        while (true) {
            const userInput = yield terminal.question("You: ");
            messages.push({ role: "user", content: userInput });
            try {
                const result = (0, ai_1.streamText)({
                    model: (0, openai_1.openai)("o4-mini"),
                    system: "Formatting re-enabled. You are an AI search engine assistant who performs a search first and then discusses it with citations to the sentences.",
                    tools: { websearchTool: websearch_tool_1.websearchTool },
                    maxSteps: 5,
                    messages,
                    onChunk(event) {
                        switch (event.chunk.type) {
                            case "tool-call":
                                console.log("Called:", event.chunk.toolName);
                                break;
                            case "tool-call-delta":
                                console.log(JSON.stringify(event.chunk.argsTextDelta));
                                break;
                            case "tool-result": {
                                const prettyOutput = formatResultsAsPrettyJSON(event.chunk.result);
                                console.log("Results:\n", prettyOutput);
                                break;
                            }
                            default:
                                break;
                        }
                    },
                });
                process.stdout.write("\nAssistant response:\n\n");
                try {
                    for (var _d = true, _e = (e_1 = void 0, __asyncValues(result.textStream)), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                        _c = _f.value;
                        _d = false;
                        const delta = _c;
                        if (delta !== "")
                            process.stdout.write(delta);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                process.stdout.write("\n\n");
                const response = yield result.response;
                messages.push(...response.messages);
            }
            catch (error) {
                console.error("An error occurred:", error);
            }
        }
    });
}
main().catch(console.error);
