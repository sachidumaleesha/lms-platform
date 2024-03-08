"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Aperture, Send } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRef, useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

const FormSchema = z.object({
  question: z.string().min(2, {
    message: "Question must be at least 10 characters.",
  }),
});

type FormData = {
  question: string;
};

export default function CodeAssistant() {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);

  const formRef = useRef(null);
  const { handleSubmit, control } = useForm<FormData>();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      question: "",
    },
  });

  function handleSuggestionClick(text: string) {
    handleSubmit((formData) => onSubmit({ ...formData, question: text }))();
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true);
      setQuestion(data.question);
      const response = await axios.post("/api/codeAssistant", data);

      setAnswer(response.data);
      toast.success("Generating answer...");
      form.reset();
    } catch (error) {
      console.error("Error assistant code:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 lg:px-8">
      <div className="max-w-[900px] m-auto w-full">
        {!question && (
          <div>
            {/* heading */}
            <div className="my-8 text-2xl md:text-4xl lg:text-6xl text-[#c4c7c5] font-medium p-5">
              <p>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                  Hello, Dev.
                </span>
              </p>
              <p>How can I help you today?</p>
            </div>

            {/* cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-5">
              <div className="h-52 p-4 bg-[#f0f4f9] rounded-md relative cursor-pointer hover:bg-[#dfe4ea]" onClick={() => handleSuggestionClick("Suggest beautiful places to see on an upcoming road trip")}>
                <p className="text-[#585858] text-lg">
                  Suggest beautiful places to see on an upcoming road trip
                </p>
                <Aperture className="w-8 h-8 p-1 absolute bg-white rounded-md bottom-2 right-2" />
              </div>
              <div className="h-52 p-4 bg-[#f0f4f9] rounded-md relative cursor-pointer hover:bg-[#dfe4ea]">
                <p className="text-[#585858] text-lg">
                  Suggest beautiful places to see on an upcoming road trip
                </p>
                <Aperture className="w-8 h-8 p-1 absolute bg-white rounded-md bottom-2 right-2" />
              </div>
              <div className="h-52 p-4 bg-[#f0f4f9] rounded-md relative cursor-pointer hover:bg-[#dfe4ea]">
                <p className="text-[#585858] text-lg">
                  Suggest beautiful places to see on an upcoming road trip
                </p>
                <Aperture className="w-8 h-8 p-1 absolute bg-white rounded-md bottom-2 right-2" />
              </div>
              <div className="h-52 p-4 bg-[#f0f4f9] rounded-md relative cursor-pointer hover:bg-[#dfe4ea]">
                <p className="text-[#585858] text-lg">
                  Suggest beautiful places to see on an upcoming road trip
                </p>
                <Aperture className="w-8 h-8 p-1 absolute bg-white rounded-md bottom-2 right-2" />
              </div>
            </div>
          </div>
        )}

        {question &&
          (loading ? (
            <div className="mt-12">
              <div className="max-w-[900px] m-auto w-full space-y-8">
                <div className="flex gap-5 items-center">
                  <Image
                    src="/user.png"
                    alt="user"
                    width={45}
                    height={45}
                    className="rounded-full"
                  />
                  <p className="text-md font-medium">{question}</p>
                </div>

                <div className="flex gap-5 max-w-[900px]">
                  <Image
                    src="/star.png"
                    alt="user"
                    width={45}
                    height={45}
                    className="rounded-full h-fit"
                  />
                  <div className="space-y-2 mt-2 h-full overflow-y-auto overflow-x-auto md:overflow-x-hidden">
                    <Skeleton className="h-4 w-[400px] bg-slate-400" />
                    <Skeleton className="h-4 w-[400px] bg-slate-400" />
                    <Skeleton className="h-4 w-[400px] bg-slate-400" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-12">
              <div className="max-w-[900px] m-auto w-full space-y-8">
                {/* Question */}
                <div className="flex gap-5 items-center">
                  <Image
                    src="/user.png"
                    alt="user"
                    width={45}
                    height={45}
                    className="rounded-full"
                  />
                  <p className="text-md font-medium">{question}</p>
                </div>

                {/* Answer */}
                <div className="flex gap-5 ">
                  <Image
                    src="/star.png"
                    alt="user"
                    width={45}
                    height={45}
                    className="rounded-full h-fit"
                  />
                  <pre className="max-w-[900px] max-h-[500px] h-full overflow-y-auto md:overflow-x-hidden overflow-scroll whitespace-pre-wrap">
                    {answer}
                  </pre>
                </div>
              </div>
            </div>
          ))}

        {/* search input */}
        <div className="p-5">
          <div className="mb-10 absolute bottom-0">
            <div className="max-w-[900px] mx-auto">
              <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex gap-2"
              >
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl className="flex-grow">
                        <Input
                          placeholder="How to become a good developer?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">
                  <Send />
                </Button>
              </form>
            </Form>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
