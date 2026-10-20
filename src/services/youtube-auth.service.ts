import { google } from 'googleapis';

export function createYoutubeOAuthClient() {

  return new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    process.env.YOUTUBE_REDIRECT_URI
  );
}

export function getYoutubeAuthorizationUrl(): string{

  const oauthClient = createYoutubeOAuthClient();

  return oauthClient.generateAuthUrl({
    access_type: 'offline',
       scope: ["https://www.googleapis.com/auth/youtube.upload"],
       prompt: 'consent',
  });
}


export async function exchangeCodeForTokens(code: string) {
  const oauthClient = createYoutubeOAuthClient();

  const { tokens } = await oauthClient.getToken(code);

  return tokens;
}



// 2. Understand what we added
// - google.auth.OAuth2(...) creates an OAuth client using your environment variables.
// - generateAuthUrl(...) builds the Google sign-in and consent URL.
// - scope requests permission to upload videos to the authorized YouTube channel.
// - access_type: "offline" requests a refresh token so the backend can obtain new access tokens later.
// - prompt: "consent" asks Google to show the consent screen again, which is useful during initial setup and testing.