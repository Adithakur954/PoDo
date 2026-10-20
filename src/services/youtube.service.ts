import { youtubeDl } from "youtube-dl-exec";

export async function downloadYouTubeVideo(
  url: string,
  outputPath: string
): Promise<void> {
  await youtubeDl(url, {
    output: outputPath,
    mergeOutputFormat: "mp4",
  });
}