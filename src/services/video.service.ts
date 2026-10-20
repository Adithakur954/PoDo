
import {execFile, spawn} from "node:child_process"


export function getVideoDuration(filepath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    execFile("ffprobe",
      [
        "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
      filepath
    ],
    (error, stdout, stderr) => {
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
    }
  );
  })}

export function createVideoClip(
  inputPath: string,
  outputPath: string,
  start: number,
  duration: number
): Promise<void> {

  return new Promise((resolve, reject) =>{
    const ffmpeg = spawn("ffmpeg",
      ["-i", inputPath, "-ss", start.toString(), "-t", duration.toString(), outputPath]
    );

    ffmpeg.stderr.on("data", (data) => {   //.on() is a method used to listen for an event "Whenever FFmpeg produces another piece of output on stderr, give it to me.
      console.error(`FFmpeg error: ${data}`);
    });
    ffmpeg.on("close", (code) =>{
      if(code === 0 ){
        resolve();
      }else {
reject(new Error(`FFmpeg exited with code ${code}`)); }
    });

    ffmpeg.on("error",(error) =>{
      reject(error);
    })
  })
 }