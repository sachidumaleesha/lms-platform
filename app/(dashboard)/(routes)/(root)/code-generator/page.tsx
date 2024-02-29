// "use client";

// import * as z from "zod";
// import axios from "axios";
// import { Code } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { useState } from "react";
// import { toast } from "react-hot-toast";
// import ReactMarkdown from "react-markdown";
// import { useRouter } from "next/navigation";
// import { ChatCompletionRequestMessage } from "openai";

// import { BotAvatar } from "@/components/bot-avatar";
// import { Heading } from "@/components/heading";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
// import { cn } from "@/lib/utils";
// import { Loader } from "@/components/loader";
// import { UserAvatar } from "@/components/user-avatar";
// import { Empty } from "@/components/ui/empty";
// import { useProModal } from "@/hooks/use-pro-modal";

// import { formSchema } from "./constants";

// const CodePage = () => {
//   const router = useRouter();
//   const proModal = useProModal();
//   const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       prompt: ""
//     }
//   });

//   const isLoading = form.formState.isSubmitting;

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     try {
//       const userMessage: ChatCompletionRequestMessage = { role: "user", content: values.prompt };
//       const newMessages = [...messages, userMessage];

//       const response = await axios.post('/api/code', { messages: newMessages });
//       setMessages((current) => [...current, userMessage, response.data]);

//       form.reset();
//     } catch (error: any) {
//       if (error?.response?.status === 403) {
//         proModal.onOpen();
//       } else {
//         toast.error("Something went wrong.");
//       }
//     } finally {
//       router.refresh();
//     }
//   }

//   return (
//     <div>
//       <Heading
//         title="Code Generation"
//         description="Generate code using descriptive text."
//         icon={Code}
//         iconColor="text-green-700"
//         bgColor="bg-green-700/10"
//       />
//       <div className="px-4 lg:px-8">
//         <div>
//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(onSubmit)}
//               className="
//                 rounded-lg
//                 border
//                 w-full
//                 p-4
//                 px-3
//                 md:px-6
//                 focus-within:shadow-sm
//                 grid
//                 grid-cols-12
//                 gap-2
//               "
//             >
//               <FormField
//                 name="prompt"
//                 render={({ field }) => (
//                   <FormItem className="col-span-12 lg:col-span-10">
//                     <FormControl className="m-0 p-0">
//                       <Input
//                         className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
//                         disabled={isLoading}
//                         placeholder="Simple toggle button using react hooks."
//                         {...field}
//                       />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />
//               <Button className="col-span-12 lg:col-span-2 w-full" type="submit" disabled={isLoading} size="icon">
//                 Generate
//               </Button>
//             </form>
//           </Form>
//         </div>
//         <div className="space-y-4 mt-4">
//           {isLoading && (
//             <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
//               <Loader />
//             </div>
//           )}
//           {messages.length === 0 && !isLoading && (
//             <Empty label="No conversation started." />
//           )}
//           <div className="flex flex-col-reverse gap-y-4">
//             {messages.map((message) => (
//               <div
//                 key={message.content}
//                 className={cn(
//                   "p-8 w-full flex items-start gap-x-8 rounded-lg",
//                   message.role === "user" ? "bg-white border border-black/10" : "bg-muted",
//                 )}
//               >
//                 {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
//                 <ReactMarkdown components={{
//                   pre: ({ node, ...props }) => (
//                     <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
//                       <pre {...props} />
//                     </div>
//                   ),
//                   code: ({ node, ...props }) => (
//                     <code className="bg-black/10 rounded-lg p-1" {...props} />
//                   )
//                 }} className="text-sm overflow-hidden leading-7">
//                   {message.content || ""}
//                 </ReactMarkdown>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//    );
// }

// export default CodePage;

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function codeGenerator() {
  return (
    <div className="px-4 lg:px-8 py-4">
      <Tabs defaultValue="account" className="">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">New Chat</TabsTrigger>
          <TabsTrigger value="password">History</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Make changes to your account here. Click save when {"you're"} done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Pedro Duarte" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="@peduarte" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, {"you'll"} be logged out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
