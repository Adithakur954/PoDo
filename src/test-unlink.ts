import { unlink } from "node:fs/promises";

try {
  await unlink("tmp/jobs/clip-2.mp4");

  console.log("File deleted successfully");
} catch (error) {
  if (error instanceof Error) {
    console.log("----- ERROR OBJECT -----");

    console.log("name:", error.name);
    console.log("message:", error.message);

    // Node.js filesystem errors also contain these properties.
    console.log("code:", (error as NodeJS.ErrnoException).code);
    console.log("syscall:", (error as NodeJS.ErrnoException).syscall);
    console.log("path:", (error as NodeJS.ErrnoException).path);

    console.log("------------------------");
  }
}