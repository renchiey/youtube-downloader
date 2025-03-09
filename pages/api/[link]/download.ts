// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { validateYoutubeUrl } from "@/lib/utils";
import type { NextApiRequest, NextApiResponse } from "next";
import youtubeDl from "youtube-dl-exec";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const youtubeLink = req.query["link"] as string;

  console.log(youtubeLink);

  if (!youtubeLink || !validateYoutubeUrl(youtubeLink)) {
    res.status(40).json({ error: "Invalid youtube URL." });
  }

  // youtubeDl("https://www.youtube.com/watch?v=6xKWiCMKKJg", {
  //   dumpSingleJson: true,
  //   noCheckCertificates: true,
  //   noWarnings: true,
  //   preferFreeFormats: true,
  //   addHeader: ["referer:youtube.com", "user-agent:googlebot"],
  // }).then((output) => console.log(output));

  res.status(200).json({ name: "John Doe" });
}
