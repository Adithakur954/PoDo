import { youtubeDl } from "youtube-dl-exec";
export async function downloadYouTubeVideo(url, outputPath) {
    await youtubeDl(url, {
        output: outputPath,
        mergeOutputFormat: "mp4",
    });
}
//# sourceMappingURL=youtube.service.js.map