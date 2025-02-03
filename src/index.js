import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";

import auth_route from "./routes/auth_route.js";
import quotes_route from "./routes/quotes_route.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: [
      process.env.LOCALHOST_CLIENT_URL,
      process.env.STAGING_CLIENT_URL,
      process.env.PRODUCTION_CLIENT_URL,
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "20mb" })); //file size limit
app.use(cookieParser());

app.use(auth_route);
app.use(quotes_route);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
