import { tool } from "ai";
import { z } from "zod";
import { tavily } from "@tavily/core";

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

export const websearchTool = tool({
  description: "Search the web for information",
  parameters: z.object({
    queries: z.array(z.string().describe("The query to search for")),
  }),
  execute: async ({ queries }) => {
    const results = await Promise.all(
      queries.map((singleQuery) =>
        tvly.search(singleQuery, {
          maxResults: 10,
          searchDepth: "advanced",
        })
      )
    );
    return results;
  },
});
