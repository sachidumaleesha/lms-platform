import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs";
import { Edit, File, PlusCircle, Trash } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Input } from "@/components/ui/input";

import {NewCodeSnippet} from "./_components/NewCodeSnippet";
import {CodeSnippets} from "./_components/codeSnippets";

const CodeSnippetsPage = async() => {

  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const codeSnippets = await db.codeSnippet.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="px-6 py-10">
      <div className="flex justify-between gap-2">
        <Input placeholder="Filter code snippets..." className="max-w-sm"/>
        <NewCodeSnippet/>
      </div>

      <div className="mt-12">
        <CodeSnippets data={codeSnippets}/>
      </div>
      
    </div>
  );
};

export default CodeSnippetsPage;
