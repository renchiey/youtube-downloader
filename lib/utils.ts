import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// courtesy of https://stackoverflow.com/questions/28735459/how-to-validate-youtube-url-in-client-side-in-text-box
export function validateYoutubeUrl(url: string) {
  const youtubeRegEx = new RegExp(
    /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
  );

  return youtubeRegEx.test(url);
}
