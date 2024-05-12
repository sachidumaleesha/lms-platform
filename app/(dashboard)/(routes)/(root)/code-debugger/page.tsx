"use client";

import { Button } from "@/components/ui/button";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { History } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const FormSchema = z.object({
  proLanguage: z.string().min(2, {
    message: "Language must be at least 2 characters.",
  }),
  code: z.string().min(10, {
    message: "Code must be at least 10 characters.",
  }),
});

export default function CodeDebugger() {
  const [translatedCode, setTranslatedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      proLanguage: "",
      code: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setTranslatedCode(null);
      setLoading(true);
      const response = await axios.post("/api/codeDebugger", data);
      if (response) {
        setTranslatedCode(response.data.solution);
      } else {
        throw new Error("Invalid response format");
      }
      toast.success("Code translated!");
    } catch (error) {
      console.error("Error debugging code:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 lg:px-8 py-4">
      <div className="flex justify-end mb-4">
        <Button>
          <Link href="/code-debugger/debug-history" className="flex items-center gap-x-1">
            <History className="w-5 h-5" />
            History
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* left */}
        <div className="border bg-slate-100 rounded-md p-4 h-fit">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="proLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Programming Language</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g: Javascript" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g: cont number = 4"
                        className="resize-none"
                        rows={15}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Debug
              </Button>
            </form>
          </Form>
        </div>

        {/* right */}
        <div className="border bg-slate-100 rounded-md p-4 h-fit">
          {translatedCode && (
            <div className="overflow-auto p-5 border border-dashed border-black rounded-md">
              <pre>{translatedCode}</pre>
            </div>
          )}
          {!translatedCode &&
            (loading ? (
              <div className="p-5 overflow-auto border border-dashed border-black rounded-md">
                <pre>Code Line Here</pre>
                <div className="space-y-2 mt-2">
                  <Skeleton className="h-4 w-[550px] bg-slate-400" />
                  <Skeleton className="h-4 w-[500px] bg-slate-400" />
                  <Skeleton className="h-4 w-[525px] bg-slate-400" />
                  <Skeleton className="h-4 w-[450px] bg-slate-400" />
                  <Skeleton className="h-4 w-[500px] bg-slate-400" />
                  <Skeleton className="h-4 w-[550px] bg-slate-400" />
                  <Skeleton className="h-4 w-[400px] bg-slate-400" />
                </div>
              </div>
            ) : (
              <div className="p-5 border border-dashed border-black rounded-md">
                <pre>Code Line Here</pre>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
