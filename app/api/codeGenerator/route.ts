import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { generateCode } from "./codeGeneratorModel";

export async function POST(req: Request) {
  const { userId } = auth();
  const { prompt } = await req.json();

  console.log(prompt);

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const generatedCodeBlock = await generateCode(prompt);

    const generatedCode = await db.generatedCode.create({
      data: {
        userId,
        prompt,
        generatedCode: generatedCodeBlock,
      },
    });

    return NextResponse.json(generatedCode);
  } catch (error) {
    console.log("[CodeGenerator]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
