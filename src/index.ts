import "dotenv/config";
import readline from "readline";
import OpenAI from "openai";
import corpus from "./corpus.json";
import Fuse, { FuseResult } from "fuse.js";

// Initialize OpenAI with API Key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Set up fuzzy search
const fuse = new Fuse(corpus, {
  keys: ["question"],
  minMatchCharLength: 3,
});

// Uses fuzzy search RAG to find relevant questions and answers for context.
function getContext(query: string): FuseResult<(typeof corpus)[0]>[] {
  let context = fuse.search(query);
  return context;
}

// Function to generate a response using OpenAI
async function generateResponse(query: string): Promise<string> {
  const context = getContext(query);

  let messages: { role: "system" | "user"; content: string }[] = [
    {
      role: "system",
      content: `Provide a succinct answer to the user's qustion.`,
    },
  ];

  // If there is relevant context, add it to the prompt
  if (context.length > 0) {
    let contextString = `Use these question + answer pairs to help generate a response: \n\n`;
    for (let item of context) {
      contextString += `Q: ${item.item.question} \n A: ${item.item.answer} \n\n`;
    }
    messages.push({ role: "system", content: contextString });
  }

  // Add the user's query to the prompt
  messages.push({ role: "user", content: query });

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [...messages],
  });
  return (
    response.choices[0]?.message?.content || "Error: No response generated."
  );
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "Ask me anything: ",
});

// Chat
async function chat() {
  console.log("Type 'exit' any time to quit.", "\n");
  rl.prompt();

  rl.on("line", async (input) => {
    let message = input.toLowerCase().trim()
    if (message == "exit") rl.emit('close')
      
    console.log("Let me think..."); // optional message
    const response = await generateResponse(input);
    console.log(response);

    rl.prompt(); // re-prompts the user
  }).on("close", () => {
    console.log("Thanks for the chat. Let's do it again soon!");
    process.exit(0);
  });
}

chat();
