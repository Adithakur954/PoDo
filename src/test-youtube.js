import { downloadYouTubeVideo } from "./services/youtube.service.js";
const url = "https://youtu.be/PWuJ5-WiEgY";
const outputPath = "tmp/youtube-test.mp4";
try {
    await downloadYouTubeVideo(url, outputPath);
    console.log("YouTube video downloaded successfully");
    console.log("Saved to:", outputPath);
}
catch (error) {
    console.error("YouTube download failed:", error);
}
//# sourceMappingURL=test-youtube.js.map