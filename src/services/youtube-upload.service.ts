
import { google } from "googleapis";
import { createReadStream } from "node:fs";
import { getYouTubeRefreshToken } from "./youtube-token.service.js";
import { createYoutubeOAuthClient } from "./youtube-auth.service.js";

export async function uploadVideoToYouTube(
  filePath: string,
  title: string,
  description: string
): Promise<string> {
  const refreshToken = await getYouTubeRefreshToken();

  const oauthClient = createYoutubeOAuthClient();
  oauthClient.setCredentials({
    refresh_token: refreshToken,
  });

  const youtube = google.youtube({
    version: "v3",
    auth: oauthClient,
  });

  const response = await youtube.videos.insert({
    part: ["snippet", "status"],
    requestBody: {
      snippet: {
        title,
        description,
      },
      status: {
        privacyStatus: "private",
      },
    },
    media: {
      body: createReadStream(filePath),
    },
  });

  const videoId = response.data.id;

  if (!videoId) {
    throw new Error("YouTube did not return an uploaded video ID.");
  }

  return videoId;
}
