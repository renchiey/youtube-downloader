import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeContext } from "@/contexts/ThemeContext";
import { validateYoutubeUrl } from "@/lib/utils";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";

export default function Home() {
  const { theme, updateTheme } = useContext(ThemeContext) as ThemeContextType;
  const [fileFormat, setFileFormat] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const router = useRouter();

  const handleDownload = () => {
    if (!validateYoutubeUrl(youtubeLink)) {
      setErrorMessage("Invalid URL.");
    } else if (!fileFormat) {
      setErrorMessage("Select a file type.");
    } else {
      router.push(`/download/${youtubeLink}`);
      return;
    }

    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    errorTimeoutRef.current = setTimeout(() => setErrorMessage(""), 3000);
  };

  return (
    <div className="flex justify-center">
      <div className="max-w-[500px] w-full mt-10">
        <Label className="font-semibold">Enter youtube link</Label>
        <div className="flex gap-5">
          <Input
            placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            onChange={(e) => setYoutubeLink(e.target.value)}
          />
          <Select onValueChange={(format) => setFileFormat(format)}>
            <SelectTrigger className="w-[150px] cursor-pointer">
              <SelectValue placeholder="File type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"mp3"}>mp3</SelectItem>
              <SelectItem value={"mp4"}>mp4</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full flex flex-col items-center mt-5 gap-2">
          <Button className=" bg-blue-900" onClick={handleDownload}>
            Download
          </Button>
          <p className="h-5">{errorMessage}</p>
        </div>
      </div>
    </div>
  );
}
