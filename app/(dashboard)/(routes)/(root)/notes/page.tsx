"use client";

import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs";
import { Edit, File, PlusCircle, Trash } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Input } from "@/components/ui/input";
import NewNotePage from "./new/page";

const NotesPage = () => {
  // async function dbHandler() {
  //   "use server"
  //   const { userId } = auth();

  //   if (!userId) {
  //     redirect("/");
  //   }

  //   const notes = await db.note.findMany({
  //     where: {
  //       userId,
  //     },
  //     orderBy: {
  //       createdAt: "desc",
  //     },
  //   });
  // }

  // dbHandler();

  const newNote = () => {
    return <NewNotePage />;
  };

  return (
    <div className="px-6 py-10">
      <div className="flex justify-between">
        <Input placeholder="Filter note..." className="max-w-sm" />
        <Button onClick={newNote}>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </div>
    </div>
  );
};

export default NotesPage;
