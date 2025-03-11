import { NextApiRequest, NextApiResponse } from "next";
import youtubedl from "youtube-dl-exec";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const url = req.query.url as string;
  const fileExt = req.query.fileExt as FileExtension;

  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  if (!fileExt) {
    return res.status(400).json({ error: "No file extension provided" });
  }

  let contentType = "";
  let format = "bv+ba";
  switch (fileExt) {
    case "mp4":
      contentType = "video/mp4";
      break;
    case "mp3":
      contentType = "audio/mpeg";
      format = "ba";
      break;
    default:
      return res
        .status(400)
        .json({ error: "Unsupported file extension provided" });
  }

  try {
    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="untitled.${fileExt}"`
    );

    const process: any = youtubedl.exec(url, {
      format: format,
      output: "-",
    });

    // Stream video to client
    process.stdout.pipe(res);

    process.stderr.on("data", (data: any) => {
      const message = data.toString();
      console.log("Progress:", message); // Logs progress in server
    });

    process.on("close", () => {
      res.end();
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export const config = {
  api: {
    responseLimit: false,
  },
};
