import express from 'express';
import clipRoutes from "./routes/clip.routes.js";
import cors from 'cors';
import youtubeAuthRoutes from "./routes/youtube-auth.routes.js";
// What is express()?
// This:
// const app = express();
// creates an Express application.
const app = express(); //yerh middleware ahi 
app.use(cors());
app.use(express.json());
app.get('/health', (_req, res) => {
    res.send('Server is healthy!');
});
app.use("/api/clip", clipRoutes); //this is the route for clip routes
app.use("/api/youtube", youtubeAuthRoutes); //this is the route for YouTube authentication routes
export default app;
// Route
//   → decides WHERE request goes
// Controller
//   → handles HTTP/request/response
// Schema
//   → validates external data
// Service
//   → performs business logic
//# sourceMappingURL=app.js.map