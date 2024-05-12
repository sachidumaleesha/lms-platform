import { NextResponse } from "next/server";
import axios from "axios";
import { auth } from "@clerk/nextjs";
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API,
});

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { imageUrl } = await req.json();

  try {
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');

    const msg = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1000,
      temperature: 0,
      system: "Give me the code of the above image with proper indentation and do not give any explanation. Do not add any special characters (e.g: ```, ```html, ```python etc) at the beginning and end of the code block.",
      messages: [
        {
          "role": "user",
          "content": [
            {
              "type": "image",
              "source": {
                "type": "base64",
                "media_type": "image/jpeg",
                "data": imageBase64
              }
            }
          ]
        }
      ]
    });

    return new Response(JSON.stringify(msg), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.log("[ImageToCode]", error);
    return new Response("Internal Error", { status: 500 });
  }
}
