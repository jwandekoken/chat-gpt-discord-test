import dotenv from "dotenv";
dotenv.config();

import { Client, GatewayIntentBits } from "discord.js";
import { Configuration, OpenAIApi } from "openai";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

client.on("messageCreate", async function (message) {
  try {
    if (message.author.bot) {
      return;
    }

    const gptResponse = await openai.createCompletion({
      model: "davinci",
      prompt: `ChatGPT is a friendly chatbot.\n
      ChatGPT: Hello, how are you?\n
      ${message.author.username}: ${message.content}\n
      ChatGPT:`,
      max_tokens: 100,
      stop: ["ChatGPT:", "Júlio César:"],
      temperature: 0.9,
    });

    message.reply(`${gptResponse.data.choices[0].text}`);
    return;
  } catch (error) {
    console.log(error);
  }
});

client.login(process.env.DISCORD_TOKEN);
console.log("ChatGPT Bot is Online on Discord");
