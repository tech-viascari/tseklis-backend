import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";

import auth_route from "./routes/auth_route.js";
import quotes_route from "./routes/quotes_route.js";
import users_route from "./routes/user_route.js";
import permission_route from "./routes/permission_route.js";
import roles_route from "./routes/roles_route.js";
import legal_entities_route from "./routes/legal_entities_route.js";
import gis_document_route from "./routes/gis_document_route.js";

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
app.use(users_route);
app.use(permission_route);
app.use(roles_route);
app.use(legal_entities_route);
app.use(gis_document_route);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
