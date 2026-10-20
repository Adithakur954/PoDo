import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
const tokenFilePath = path.resolve("tmp/youtube-tokens.json");
export async function saveYouTubeRefreshToken(refreshToken) {
    await mkdir(path.dirname(tokenFilePath), { recursive: true });
    await writeFile(tokenFilePath, JSON.stringify({ refresh_token: refreshToken }, null, 2), "utf8");
}
export async function getYouTubeRefreshToken() {
    const fileContent = await readFile(tokenFilePath, "utf8");
    const tokenData = JSON.parse(fileContent);
    if (!tokenData.refresh_token) {
        throw new Error("No refresh token found");
    }
    return tokenData.refresh_token;
}
//# sourceMappingURL=youtube-token.service.js.map