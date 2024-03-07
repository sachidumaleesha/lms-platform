import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { getAssistant } from "./conversationModel";

export async function POST(req: Request) {
  const { userId } = auth();
  const { question } = await req.json();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const response = await getAssistant(question);
    return NextResponse.json(response);
  } catch (error) {
    console.log("[CodeAssistant]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
