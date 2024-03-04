import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { codeId: string } }
) {
  try {
    const { userId } = auth();
    const { codeId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const CodeSnippet = await db.codeSnippet.update({
      where: {
        id: codeId,
        userId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(CodeSnippet);
  } catch (error) {
    console.log("[Code_Patch_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { codeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const CodeSnippet = await db.codeSnippet.findUnique({
      where: {
        id: params.codeId,
        userId: userId,
      },
    });

    if (!CodeSnippet) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const deleteCodeSnippet = await db.codeSnippet.delete({
      where: {
        id: params.codeId,
      },
    });

    return NextResponse.json(deleteCodeSnippet);
  } catch (error) {
    console.log("[CODE_SNIPPET_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
