// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
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
  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  try {
    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Disposition", 'attachment; filename="video.mp4"');

    const process: any = youtubedl.exec(url, {
      format: "bv+ba",
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
