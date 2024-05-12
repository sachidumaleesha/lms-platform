"use client";

import * as z from "zod";
import axios from "axios";
import { PlusCircle, ImageIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { dbHandle } from "@/hooks/use-imageToCode";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

export default function ImageToCode() {
  const [isEditing, setIsEditing] = useState(false);
  const [submittedImageUrl, setSubmittedImageUrl] = useState<string | null>(
    null
  );
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      toast.success("Image uploaded");
      setSubmittedImageUrl(values.imageUrl);
      toggleEdit();
      router.refresh();
      generateCode(values.imageUrl);
    } catch {
      toast.error("Something went wrong");
    }
  };

  const generateCode = async (imageUrl: string) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/imageToCode", { imageUrl });
      if (response) {
        console.log(response);
        setGeneratedCode(
          response.data.content[0].text
        );
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error generating code:", error);
      toast.error("Error generating code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 m-8 mb-8">
      {/* left */}
      <div className="border bg-slate-100 rounded-md p-4 h-fit">
        <div className="font-medium flex items-center justify-between">
          Image to code
          <Button variant="ghost" onClick={toggleEdit}>
            {isEditing && <>Cancel</>}

            {!isEditing && (
              <>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add an image
              </>
            )}
          </Button>
        </div>

        {isEditing && (
          <>
            <FileUpload
              endpoint="imageToCode"
              onChange={(url) => {
                if (url) {
                  onSubmit({ imageUrl: url });
                }
              }}
            />
            <div className="text-xs text-muted-foreground mt-4 text-red-400 tracking-wide font-medium">
              Blur image not recommended
            </div>
          </>
        )}

        {!isEditing &&
          (!submittedImageUrl ? (
            <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
              <ImageIcon className="h-10 w-10 text-slate-500" />
            </div>
          ) : (
            <div className="relative aspect-video mt-2">
              <Image
                src={submittedImageUrl}
                alt="Submitted Image"
                className="object-cover rounded-md"
                fill
              />
            </div>
          ))}
      </div>

      {/* right */}
      <div>
        {generatedCode && (
          <div className="overflow-auto mb-8 p-5 border border-dashed border-black rounded-md">
            <pre>{generatedCode}</pre>
          </div>
        )}
        {!generatedCode &&
          (loading ? (
            <div className="p-5 border border-dashed border-black rounded-md">
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
