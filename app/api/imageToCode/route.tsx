import { NextResponse } from "next/server";

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

import axios from "axios";

export async function POST(req: Request) {
  const { imageUrl } = await req.json();
  const MODEL_NAME = "gemini-1.0-pro-vision-latest";
  const API_KEY = process.env.GEMINI_API;

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.4,
      topK: 32,
      topP: 1,
      maxOutputTokens: 4096,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    const imageBase64 = Buffer.from(imageResponse.data).toString("base64");

    const parts = [
      {
        inlineData: {
          mimeType: "image/png",
          data: imageBase64,
        },
      },
      {
        text: "\n\nGive me the code of the above image with proper indentation. \n\n",
      },
    ];

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.log("[ImageToCode]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
