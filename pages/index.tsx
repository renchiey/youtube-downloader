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
  const [youtubeURL, setYoutubeURL] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);

  const router = useRouter();

  const handleDownload = async () => {
    if (!validateYoutubeUrl(youtubeURL)) {
      setErrorMessage("Invalid URL.");
    } else if (!fileFormat) {
      setErrorMessage("Select a file type.");
    } else {
      // try {
      //   const url = youtubeURL;

      //   const res = await fetch("/api/download", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ url }),
      //   });

      //   const data = await res.json();

      //   if (res.ok) {
      //     console.log("success");
      //   } else {
      //     console.log(`Error: ${data.error}`);
      //   }
      // } catch (error) {
      //   console.log(`error occurred ${error}`);
      // }

      setDownloading(true);
      setProgress(0);

      try {
        const response = await fetch(
          `/api/download?url=${encodeURIComponent(youtubeURL)}`
        );
        if (!response.ok) throw new Error("Failed to download");

        const totalSize = response.headers.get("Content-Length") || "1000000"; // Fallback size
        let receivedSize = 0;
        const reader = response.body?.getReader();

        const chunks: Uint8Array[] = [];
        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;

          console.log("here", value);
          chunks.push(value);
          receivedSize += value.length;

          // Update progress percentage
          setProgress(Math.round(receivedSize / +totalSize) * 10);
        }

        // Convert received data to a Blob and create a download link
        const blob = new Blob(chunks, { type: "video/mp4" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "video.mp4";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Download failed:", error);
      }

      setDownloading(false);
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
            onChange={(e) => setYoutubeURL(e.target.value)}
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
            {downloading ? "Downloading..." : "Download"}
          </Button>
          <p className="h-5">{errorMessage}</p>
          {downloading && (
            <div className="mt-4 w-96 bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-500 h-4 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {downloading && <p className="mt-2">{progress}%</p>}
        </div>
      </div>
    </div>
  );
}
