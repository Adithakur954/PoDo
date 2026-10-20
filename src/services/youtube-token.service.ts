
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const tokenFilePath = path.resolve("tmp/youtube-tokens.json");

export async function saveYouTubeRefreshToken(
  refreshToken: string
): Promise<void> {
  await mkdir(path.dirname(tokenFilePath), { recursive: true });

  await writeFile(
    tokenFilePath,
    JSON.stringify({ refresh_token: refreshToken }, null, 2),
    "utf8"
  );
}

export async function getYouTubeRefreshToken(): Promise<string>{

  const fileContent = await readFile(tokenFilePath, "utf8");

  const tokenData: {refresh_token?: string} = JSON.parse(fileContent);

  if (!tokenData.refresh_token) {
    throw new Error("No refresh token found");
  }

  return tokenData.refresh_token;
}