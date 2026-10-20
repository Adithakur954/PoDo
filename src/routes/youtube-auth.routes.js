import { Router } from "express";
import { exchangeCodeForTokens, getYoutubeAuthorizationUrl } from "../services/youtube-auth.service.js";
import { saveYouTubeRefreshToken } from "../services/youtube-token.service.js";
const router = Router();
router.get("/auth", (_req, res) => {
    console.log("YouTube auth route reached");
    const authorizationUrl = getYoutubeAuthorizationUrl();
    console.log("Authorization URL generated:", Boolean(authorizationUrl));
    res.redirect(authorizationUrl);
});
router.get("/oauth2callback", async (req, res) => {
    const code = req.query.code;
    if (typeof code !== "string") {
        res.status(400).send("Google authorization code is missing.");
        return;
    }
    try {
        const tokens = await exchangeCodeForTokens(code);
        if (tokens.refresh_token) {
            await saveYouTubeRefreshToken(tokens.refresh_token);
        }
        console.log("Google authorization completed.");
        console.log("Refresh token received:", Boolean(tokens.refresh_token));
        res.status(200).send("YouTube authorization successful! You can close this browser tab.");
    }
    catch (error) {
        console.error("Google token exchange failed:", error);
        res.status(500).send("Could not complete Google authorization.");
    }
});
export default router;
//# sourceMappingURL=youtube-auth.routes.js.map