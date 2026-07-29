import winston from "winston";
import fs from "node:fs";
import path from "node:path";

const { combine, timestamp, printf, colorize, errors, json } =
  winston.format;

const logDir =
  process.env.LOG_DIR ??
  (process.env.NODE_ENV === "production" ? "/tmp/logs" : "logs");

const isLocalRuntime = !process.env.VERCEL && process.env.NODE_ENV !== "production";

if (isLocalRuntime && !fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const consoleFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: "info",

  transports: [
    new winston.transports.Console({
      format:
        process.env.NODE_ENV === "production"
          ? combine(timestamp(), errors({ stack: true }), json())
          : combine(
              colorize(),
              timestamp({
                format: "YYYY-MM-DD HH:mm:ss",
              }),
              consoleFormat
            ),
    }),
    ...(isLocalRuntime
      ? [
          new winston.transports.File({
            filename: path.join(logDir, "error.log"),
            level: "error",
            format: combine(timestamp(), errors({ stack: true }), json()),
          }),
          new winston.transports.File({
            filename: path.join(logDir, "combined.log"),
            format: combine(timestamp(), errors({ stack: true }), json()),
          }),
        ]
      : []),
  ],

  exceptionHandlers: isLocalRuntime
    ? [
        new winston.transports.File({
          filename: path.join(logDir, "exceptions.log"),
        }),
      ]
    : [],
});

export default logger;
