import express, { type Express, type Request, type Response } from "express";
import { Server } from "node:http";
import { connectDB } from "./config/mongoDB";

import helmet, { HelmetOptions } from "helmet";
import { xss } from "express-xss-sanitizer";
import cors from "cors";
import hpp from "hpp";

import fileUpload from "express-fileupload";
import sanitize from "./middleware/sanitize";
import rateLimit from "express-rate-limit";
// import {} from "express-serve-static-core";
import morgan from "morgan";

import "colors"; // TODO: replace colors with chalk
import { isDevEnv, Settings } from "./config/settings";
import path from "node:path";
import errorHandler from "./middleware/error";

// import routers
import certificateRouter from "./modules/cms/routes/certificate.routes";
import identityRouter from "./modules/cms/routes/identity.routes";
import timelineRouter from "./modules/cms/routes/timeline.routes";
import projectCategoryRouter from "./modules/cms/routes/project-category.routes";
import projectRouter from "./modules/cms/routes/project.routes";
import sectionRouter from "./modules/cms/routes/section.routes";
import newsTagRouter from "./modules/cms/routes/news-tag.routes";
import newsCategoryRouter from "./modules/cms/routes/news-category.routes";
import newsRouter from "./modules/cms/routes/news.routes";
import navLinkRouter from "./modules/cms/routes/nav-link.routes";
import socialLinkRouter from "./modules/cms/routes/social-link.routes";
import statRouter from "./modules/cms/routes/stat.routes";
import inquiryRouter from "./modules/cms/routes/inquiry.routes";
import serviceRouter from "./modules/cms/routes/service.routes";
import contactInfoRouter from "./modules/cms/routes/contact-info.routes";
import directorRouter from "./modules/cms/routes/director.routes";

const port = Settings.PORT;
const allowedOrigins = Settings.ALLOWED?.split(",").map((o) => o?.trim());
const oneMin = 10 * 60 * 1000;
const oneMinLimit = Settings.MINUTE_RATE_LIMIT;

// path to the public folder relative to entrypoint (index.ts)
// __dirname is the path to the currently running file (index.ts)
const publicPath = path.join(__dirname, "../public");

// TODO: review this before deploying
const defaultHelmetConfig: HelmetOptions = {
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
};

// ----- connect to the database
connectDB();

const app: Express = express();

// ----- setup middleware
app.use(cors({ origin: allowedOrigins }));
app.use(helmet(defaultHelmetConfig)); // set security headers
app.use(xss()); // prevent cross site scripting
app.use(hpp()); // prevent http param pollution

// ----- unsanitized / unparsed routes
// app.use();

// ----- body parser (express based this on the body-parser package)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan(isDevEnv ? "dev" : "combined") as any);
app.use(fileUpload(undefined) as any);
app.use(sanitize); // mongoSanitize // ? not needed with mongoose > 8.x
app.use(rateLimit({ windowMs: oneMin, limit: oneMinLimit }));

// ----- app routes
// app.use();
app.use("/api/v1/certificate/", certificateRouter);
app.use("/api/v1/identity/", identityRouter);
app.use("/api/v1/timeline/", timelineRouter);
app.use("/api/v1/project-category/", projectCategoryRouter);
app.use("/api/v1/project/", projectRouter);
app.use("/api/v1/section/", sectionRouter);
app.use("/api/v1/news-tag/", newsTagRouter);
app.use("/api/v1/news-category/", newsCategoryRouter);
app.use("/api/v1/news/", newsRouter);
app.use("/api/v1/nav-link/", navLinkRouter);
app.use("/api/v1/social-link/", socialLinkRouter);
app.use("/api/v1/stat/", statRouter);
app.use("/api/v1/inquiry/", inquiryRouter);
app.use("/api/v1/service/", serviceRouter);
app.use("/api/v1/contact-info/", contactInfoRouter);
app.use("/api/v1/director/", directorRouter);

// ----- error handler
app.use(errorHandler);

// ---- serve static files
// app.use(express.static("public/static"));
app.use(express.static(path.join(publicPath, "/static")));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/health", (req: Request, res: Response) => {
  res.send("Application Healthy!");
});

// serve default html file for unhandled routes
// can be used for serving a frontend static build
app.get("/*path", (req: Request, res: Response) => {
  const indexPath = path.join(publicPath, "/index.html");
  res.sendFile(indexPath, (err) => res.status(500).send(err));
});

const server = app.listen(port, () =>
  console.log(
    `Server running in ${Settings.NODE_ENV} mode on port ${port}`.yellow,
  ),
);

const closeServer = (server: Server, err: Error | unknown) => {
  console.log(`Error: ${(err as Error)?.message || err}`.red);
  server.close(() => process.exit(1)); // also exit the process
};

process.on("uncaughtException", (err) => closeServer(server, err));
process.on("unhandledRejection", (err) => closeServer(server, err));
