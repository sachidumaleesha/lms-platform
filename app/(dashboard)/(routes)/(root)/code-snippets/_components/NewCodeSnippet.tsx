"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { DialogContent, DialogTrigger, Dialog } from "@/components/ui/dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  name: z.string().min(5, {
    message: "name must be at least 2 characters.",
  }),
  code: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
});

export const NewCodeSnippet = () => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      code: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await axios.post("/api/codeSnippets/", data);
      toast.success("Code snippet created");
      console.log(data);
      form.reset();
      setIsDialogOpen(false); // Close dialog after successful form submission
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">New Code Snippet</span>
        </Button>
      </DialogTrigger>
      {isDialogOpen && (
        <DialogContent className="sm:max-w-[500px] rounded-lg">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Python code to verify email address."
                        {...field}
                      />
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
                        placeholder="Paste code here"
                        className="resize-none"
                        rows={20}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </DialogContent>
      )}
    </Dialog>
  );
};
