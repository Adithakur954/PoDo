import { execFile, spawn } from "node:child_process";
export function getVideoDuration(filepath) {
    return new Promise((resolve, reject) => {
        execFile("ffprobe", [
            "-v", "error",
            "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            filepath
        ], (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            const duration = Number(stdout.trim());
            if (Number.isNaN(duration)) {
                reject(new Error("Could not determine video duration."));
                return;
            }
            resolve(duration);
        });
    });
}
export function createVideoClip(inputPath, outputPath, start, duration) {
    return new Promise((resolve, reject) => {
        const ffmpeg = spawn("ffmpeg", ["-i", inputPath, "-ss", start.toString(), "-t", duration.toString(), outputPath]);
        ffmpeg.stderr.on("data", (data) => {
            console.error(`FFmpeg error: ${data}`);
        });
        ffmpeg.on("close", (code) => {
            if (code === 0) {
                resolve();
            }
            else {
                reject(new Error(`FFmpeg exited with code ${code}`));
            }
        });
        ffmpeg.on("error", (error) => {
            reject(error);
        });
    });
}
//# sourceMappingURL=video.service.js.map