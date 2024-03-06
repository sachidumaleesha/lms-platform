import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { debugCode } from "../codeDebuggerModel";

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

    const { proLanguage, code } = values;

    const solution = await debugCode(proLanguage, code);

    const genCode = await db.codeDebugger.update({
      where: {
        id: codeId,
        userId,
      },
      data: {
        ...values,
        solution
      },
    });

    return NextResponse.json(genCode);
  } catch (error) {
    console.log("[CODE_DEBUGGER_Patch_ID]", error);
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

    const genCode = await db.codeDebugger.findUnique({
      where: {
        id: params.codeId,
        userId: userId,
      },
    });

    if (!genCode) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const deleteGenCode = await db.codeDebugger.delete({
      where: {
        id: params.codeId,
      },
    });

    return NextResponse.json(deleteGenCode);
  } catch (error) {
    console.log("[CODE_DEBUGGER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
