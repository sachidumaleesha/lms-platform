"use client";

import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, ImageIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { auth } from "@clerk/nextjs";
import { dbHandle } from "@/hooks/use-imageToCode";

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

export default function ImageToCode() {

  // dbHandle()


  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      //   await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Image uploaded");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 m-8">
      {/* left */}
      <div>
        <div className="font-medium flex items-center justify-between">
          Image to code
          <Button onClick={toggleEdit} variant="ghost">
            {isEditing && <>Cancel</>}
            {!isEditing && (
              <>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add an image
              </>
            )}
            {!isEditing && (
              <>
                <Pencil className="h-4 w-4 mr-2" />
                Edit image
              </>
            )}
          </Button>
        </div>
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
      </div>

      {/* right */}
      <div>Right</div>
    </div>
  );
}
