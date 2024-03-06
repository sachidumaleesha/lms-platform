import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { debugCode } from "./codeDebuggerModel";

export async function POST(req: Request){

    const {userId} = auth()
    const {proLanguage, code} = await req.json()

    if(!userId){
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try{
        const debuggedCode = await debugCode(proLanguage, code);

        const response = await db.codeDebugger.create({
          data: {
            userId,
            language: proLanguage,
            code,
            solution: debuggedCode,
          },
        });
    
        return NextResponse.json(response);
    }
    catch(error){
        console.log("[CodeDebug]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}