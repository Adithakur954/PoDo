
### Even better: use it as your personal Node.js notebook

As we learn new concepts, you can keep sections like:

```text
LEARNING_NOTES.md

# Clipping Learning Notes

## 1. Express

## 2. TypeScript

## 3. Zod

## 4. Multer

## 5. req.file vs req.body

## 6. Promises

## 7. async/await

## 8. child_process

## 9. execFile()

## 10. spawn()

## 11. FFmpeg

## 12. FFprobe

## 13. File cleanup

## 14. unlink()



### unlink()
unlink() is a Node.js filesystem function that deletes a file. we can access through import { unlink } from "node:fs/promises";
and here /promose i simportent part andit rertun promise and await because Deleting a file involves talking to the operating system.

That operation doesn't necessarily finish instantly.


instanceof Error
In JavaScript/TypeScript, the value caught by:

catch (error)
It could theoretically be anything:

throw new Error("Something went wrong");

or even:

throw "Something went wrong";
So TypeScript doesn't automatically let us assume:

error.message

is available.

This:

error instanceof Error

asks:

"Is this value actually an Error object?"

If yes, TypeScript then knows that properties like:

error.message

are safe to use.

NodeJS.ErrnoException

Node provides a type describing errors that can contain filesystem-related information.

We can tell TypeScript:

"For this particular situation, treat this error as a Node filesystem error."

That's what this does:

(error as NodeJS.ErrnoException)

The as keyword is a TypeScript type assertion.
## Error Objects

When an operation fails, JavaScript can give us an Error object.

An Error can contain useful information such as:

- `error.name` → general error name
- `error.message` → human-readable description
- `error.code` → specific system error code
- `error.syscall` → operation that failed
- `error.path` → file/path involved

### ENOENT

`ENOENT` means the requested file or directory does not exist.

### NodeJS.ErrnoException

Node filesystem errors can contain properties such as `code`, `syscall`, and `path`.

TypeScript does not automatically know that every caught error has these properties.

We can use a type assertion:

```ts
(error as NodeJS.ErrnoException).code
## Cleanup after file processing

Temporary files should be deleted after they are no longer needed.

`unlink()` from `node:fs/promises` deletes a file.

However, if an error occurs before `unlink()` is reached, the cleanup code may never execute.

This is why JavaScript provides `finally`.

`finally` is used for cleanup code that should run whether the operation succeeds or fails.

Example:

try {
  // operation
} catch (error) {
  // handle error
} finally {
  // cleanup
}
## finally and temporary-file cleanup

`finally` is useful for cleanup code that should run whether an operation
succeeds or fails.

Example:

try {
  // processing
} catch (error) {
  // handle error
} finally {
  // cleanup
}

In our video pipeline:

- The uploaded source video is temporary.
- FFmpeg uses the source video to create clips.
- After processing, the source video is no longer needed.
- `finally` deletes the uploaded source video.

Generated clips are different because we still need them after processing.

Another cleanup problem is that old generated clips can remain in `tmp/`.
If the application tries to create `clip-1.mp4` again, FFmpeg asks whether
it should overwrite the existing file.

This means temporary output files also need a cleanup strategy.

###=================================================================
## mkdir()

`mkdir()` is a Node.js filesystem function used to create directories.

It comes from:

import { mkdir } from "node:fs/promises";

Example:

await mkdir("tmp/jobs/my-job", { recursive: true });

The `recursive: true` option means Node can create the parent
directories too if they do not already exist.

For example, if `tmp/jobs` does not exist:

await mkdir("tmp/jobs/my-job", { recursive: true });

can create:

tmp/
└── jobs/
    └── my-job/


    ## Unique job directories

Each video-processing request gets a unique job ID.

We generate it with:

import { randomUUID } from "node:crypto";

const jobId = randomUUID();

A job directory can then be created:

const jobDir = `tmp/jobs/${jobId}`;

await mkdir(jobDir, { recursive: true });

Generated clips are stored inside that directory:

tmp/jobs/<jobId>/clip-1.mp4
tmp/jobs/<jobId>/clip-2.mp4
tmp/jobs/<jobId>/clip-3.mp4

This prevents different processing requests from trying to create
the same output filenames.

### Resource lifecycle

Temporary resources have a lifecycle:

create → use → finish → cleanup

For our video pipeline:

source video:
upload → process → delete

generated clips:
create → use/serve → eventually delete
## rm()

`rm()` comes from:

import { rm } from "node:fs/promises";

`unlink()` is mainly used to delete a single file.

`rm()` can delete a file or directory.

For a directory containing files, we can use:

await rm("tmp/jobs/my-job", { recursive: true });

`recursive: true` means Node is allowed to remove the
directory and everything inside it.

Example:

tmp/jobs/my-job/
├── clip-1.mp4
├── clip-2.mp4
└── clip-3.mp4

After:

await rm("tmp/jobs/my-job", { recursive: true });

the entire `my-job` directory is removed.

### Important

Deleting a directory recursively is powerful.

We should only give `rm()` a path that our application created
and knows is safe to delete.
# YouTube Video Import

## 1. Why are we adding YouTube import?

Our application currently accepts a local video file through Multer.

We also want the user to be able to provide a YouTube URL.

The important design idea is that both inputs should eventually become the same thing:

```text
Local file
    ↓
Temporary video file
    ↓
        sourceVideoPath
    ↓
FFprobe
    ↓
Clip planning
    ↓
FFmpeg
    ↓
Generated clips
```

And:

```text
YouTube URL
    ↓
Download video
    ↓
Temporary video file
    ↓
        sourceVideoPath
    ↓
FFprobe
    ↓
Clip planning
    ↓
FFmpeg
    ↓
Generated clips
```

We should not create two separate video-processing pipelines.

Different input sources should **converge into one common processing pipeline**.

---

## 2. `youtube-dl-exec`

We installed:

```bash
npm install youtube-dl-exec
```

`youtube-dl-exec` provides a Node.js interface for `yt-dlp`.

`yt-dlp` is responsible for downloading the media from YouTube.

Our Node.js application does not need to understand all of YouTube's media-delivery details.

Instead:

```text
Node.js
   ↓
youtube-dl-exec
   ↓
yt-dlp
   ↓
YouTube
```

---

## 3. Python requirement

`youtube-dl-exec` uses `yt-dlp`, which requires Python.

Our machine has:

```text
Python 3.13
```

so the requirement is satisfied.

---

## 4. Creating a YouTube service

We created:

```text
src/services/youtube.service.ts
```

The service contains:

```ts
import youtubeDl from "youtube-dl-exec";

export async function downloadYouTubeVideo(
  url: string,
  outputPath: string
): Promise<void> {
  await youtubeDl(url, {
    output: outputPath,
  });
}
```

### Why use a service?

The controller should handle HTTP-related work:

```text
request
validation
response
```

The service handles the actual YouTube operation:

```text
YouTube URL
    ↓
download video
```

This keeps responsibilities separated.

---

## 5. Why does the function return `Promise<void>`?

Downloading a video takes time.

Therefore the function is asynchronous:

```ts
async function downloadYouTubeVideo(...)
```

An asynchronous function returns a Promise.

We don't return the video data itself because the video is written to a file.

Therefore:

```ts
Promise<void>
```

means:

> "This operation will finish in the future, but it doesn't return a value."

We can use:

```ts
await downloadYouTubeVideo(url, outputPath);
```

After the `await` finishes, the download operation has completed.

---

## 6. `Promise<number>` vs `Promise<void>`

We already had:

```ts
getVideoDuration(...): Promise<number>
```

because the operation eventually gives us a number:

```text
FFprobe
   ↓
71.420767
```

So:

```text
Promise<number>
```

means:

> A future result that will contain a number.

Our clip creation function is:

```ts
createVideoClip(...): Promise<void>
```
