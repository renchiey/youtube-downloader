import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingCircle from "@/components/ui/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { validateYoutubeUrl } from "@/lib/utils";
import { useRef, useState } from "react";

export default function Home() {
  const [fileExt, setFileExt] = useState("");
  const [youtubeURL, setYoutubeURL] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!validateYoutubeUrl(youtubeURL)) {
      setErrorMessage("Invalid URL.");
    } else if (!fileExt) {
      setErrorMessage("Select a file type.");
    } else {
      setDownloading(true);

      try {
        const response = await fetch(
          `/api/download?url=${encodeURIComponent(
            youtubeURL
          )}&fileExt=${fileExt}`
        );
        if (!response.ok) {
          setErrorMessage("URL does not exist or is in an invalid format.");

          if (errorTimeoutRef.current) {
            clearTimeout(errorTimeoutRef.current);
          }

          errorTimeoutRef.current = setTimeout(() => setErrorMessage(""), 3000);
          return;
        }

        const reader = response.body?.getReader();

        const chunks: Uint8Array[] = [];
        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;

          chunks.push(value);
        }

        let contentType = "";
        switch (fileExt) {
          case "mp4":
            contentType = "video/mp4";
            break;
          case "mp3":
            contentType = "audio/mpeg";
            break;
          default:
            throw new Error("Should not be here.");
        }

        // Convert received data to a Blob and create a download link
        const blob = new Blob(chunks, { type: contentType });

        const link = document.createElement("a");

        link.href = URL.createObjectURL(blob);

        link.download = `untitled.${fileExt}`;

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
          <Select onValueChange={(format) => setFileExt(format)}>
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
          <Button
            className=" bg-blue-900"
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? "Downloading..." : "Download"}
          </Button>
          <p className="h-5">{errorMessage}</p>
          {downloading && (
            <>
              <LoadingCircle />
              <p>processing</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
