"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { EditCodeBlock } from "./editCodeBlock";

interface CodeBlock {
  id: string;
  prompt: string;
  generatedCode: string;
  // Add other properties if needed
}

interface CodeBlocksProps {
  data: CodeBlock[];
}

export const CodeBlock: React.FC<CodeBlocksProps> = ({ data }) => {
  const router = useRouter();

  const onDelete = async (codeId: string) => {
    try {
      await axios.delete(`/api/codeGenerator/${codeId}`);
      toast.success("Generated Code deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {data.map((code) => (
          <Card>
            <CardHeader>
              <CardTitle className="line-clamp-1">{code.prompt}</CardTitle>
            </CardHeader>
            <CardContent className="border border-dashed border-black mx-6 p-5 rounded-md line-clamp-1">
              {code.generatedCode}
            </CardContent>
            <CardFooter className="flex flex-col gap-2 mt-5">
              {/* <Button className="w-full" variant="outline"> */}
                <EditCodeBlock dataSet={code} />
              {/* </Button> */}
              <Button className="w-full" onClick={() => onDelete(code.id)}>
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
