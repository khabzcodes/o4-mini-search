# o4-mini-search

A command-line interface tool that connects to OpenAI's o4-mini model and enhances it with web search capabilities using Tavily.

## Features

- Interactive CLI for conversing with OpenAI's o4-mini model
- Integrated web search functionality powered by Tavily
- Real-time streaming of AI responses and search results
- Persistent conversation context for more meaningful interactions

## Prerequisites

- Node.js (v16 or newer)
- pnpm package manager (v10.8.0)
- Tavily API key
- OpenAI API key

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/khabzcodes/o4-mini-search.git
   cd o4-mini-search
   ```

2. Install dependencies using pnpm:
   ```
   pnpm install
   ```

3. Create a `.env` file in the project root with your API keys:
   ```
   TAVILY_API_KEY=your_tavily_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```

## Usage

1. Build the project:
   ```
   pnpm build
   ```

2. Run the CLI:
   ```
   pnpm start
   ```

3. Start chatting with the assistant. The assistant will automatically search the web when needed to provide accurate and up-to-date information.

Example conversation:
```
You: What are the latest developments in quantum computing?
Called: websearchTool
Results:
 {
  "queries": [
    "latest developments quantum computing"
  ]
}

Assistant response:
Based on the latest information available, quantum computing has seen several significant developments...
```

## Tech Stack

- TypeScript
- OpenAI's o4-mini model (via @ai-sdk/openai)
- Tavily Search API
- AI SDK for tool integration and response streaming
- Zod for schema validation

## Project Structure

- `src/index.ts` - Main entry point and CLI interface
- `src/tools/websearch-tool.ts` - Integration with Tavily web search API

## License

ISC

## Contributing

Feel free to submit issues or pull requests if you have suggestions for improvements or bug fixes.
