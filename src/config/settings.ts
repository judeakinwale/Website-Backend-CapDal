import dotenv from "dotenv";

// use path relative to project root (package.json)
dotenv.config({ path: "./src/config/.env" });

export const EnvOptions = {
  DEV: "development",
  PROD: "production",
} as const;

export const Settings = {
  APP_NAME: "Website Backend",

  PORT: Number(process.env.PORT || 5000),
  NODE_ENV: process.env.NODE_ENV || EnvOptions.PROD,
  MONGO_URI: process.env.MONGO_URI,

  FILE_UPLOAD_PATH: process.env.FILE_UPLOAD_PATH,
  MAX_FILE_UPLOAD: process.env.MAX_FILE_UPLOAD,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || "1d", // strings like '15m', '2h', '7d' or timestamp in seconds (for jose)
  JWT_COOKIE_EXPIRE: process.env.JWT_COOKIE_EXPIRE || "30m", // same as for JWT_EXPIRE
  JWT_ALGORITHM: process.env.JWT_ALGORITHM || "HS256",
  JWT_ISSUER: process.env.JWT_ISSUER,
  JWT_AUDIENCE: process.env.JWT_AUDIENCE,

  LOGO_URL: process.env.LOGO_URL,

  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_EMAIL: process.env.SMTP_EMAIL,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  FROM_EMAIL: process.env.FROM_EMAIL,
  FROM_NAME: process.env.FROM_NAME,

  // comma separated string of allowed cors endpoints
  ALLOWED: process.env.ALLOWED,
  MINUTE_RATE_LIMIT: Number(process.env.MINUTE_RATE_LIMIT || 1000),
} as const;

export const isDevEnv = Settings.NODE_ENV === EnvOptions.DEV;
