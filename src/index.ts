import { openai } from "@ai-sdk/openai";
import { CoreMessage, streamText } from "ai";
import "dotenv/config";
import * as readline from "node:readline/promises";
import { websearchTool } from "./tools/websearch-tool";

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const messages: CoreMessage[] = [];

function formatResultsAsPrettyJSON(responses: any): string {
  return JSON.stringify(responses, null, 2);
}

async function main() {
  while (true) {
    const userInput = await terminal.question("You: ");
    messages.push({ role: "user", content: userInput });

    try {
      const result = streamText({
        model: openai("o4-mini"),
        system:
          "Formatting re-enabled. You are an AI search engine assistant who performs a search first and then discusses it with citations to the sentences.",
        tools: { websearchTool },
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
              const prettyOutput = formatResultsAsPrettyJSON(
                event.chunk.result
              );
              console.log("Results:\n", prettyOutput);
              break;
            }
            default:
              break;
          }
        },
      });

      process.stdout.write("\nAssistant response:\n\n");
      for await (const delta of result.textStream) {
        if (delta !== "") process.stdout.write(delta);
      }
      process.stdout.write("\n\n");

      const response = await result.response;
      messages.push(...response.messages);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
}

main().catch(console.error);
