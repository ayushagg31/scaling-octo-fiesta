import fs from "fs";
import { Document } from "langchain/document";
import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

// Convert audio to text using OpenAI whisper
export const AudioLoader = async (filePath) => {
  try {
    const transcript = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-1",
    });
    return {
      transcript: transcript.text,
      // load: () => [new Document({ pageContent: transcript.data.text })],
    };
  } catch (err) {
    throw new Error(`Failed to transcribe: ${err.message}`);
  }
};
