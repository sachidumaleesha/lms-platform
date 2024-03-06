"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Textarea } from "@/components/ui/textarea";

import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  fromLanguage: z.string().min(2, {
    message: "language must be at least 2 characters.",
  }),
  toLanguage: z.string().min(2, {
    message: "language must be at least 2 characters.",
  }),
  code: z.string().min(10, {
    message: "Code must be at least 10 characters.",
  }),
});

export default function CodeTranslator() {
  const [translatedCode, setTranslatedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fromLanguage: "",
      toLanguage: "",
      code: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true);
      const response = await axios.post("/api/codeTranslator", data);
      if (response) {
        setTranslatedCode(response.data.candidates[0].content.parts[0].text);
      } else {
        throw new Error("Invalid response format");
      }
      toast.success("Code translated!");
    } catch (error) {
      console.error("Error generating ai code:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 m-8 mb-8">
      {/* left */}
      <div className="border bg-slate-100 rounded-md p-4 h-fit">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fromLanguage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From: Programming Language</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g: Javascript" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="toLanguage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To: Programming Language</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g: Python" {...field} />
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
                      placeholder="e.g: const number = 4"
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
              Translate
              <Sparkles className="w-5 h-5" />
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
  );
}
