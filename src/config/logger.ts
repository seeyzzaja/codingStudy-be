import winston from "winston";

const { combine, timestamp, printf, colorize, errors, json } =
  winston.format;

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

    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: combine(timestamp(), errors({ stack: true }), json()),
    }),

    new winston.transports.File({
      filename: "logs/combined.log",
      format: combine(timestamp(), errors({ stack: true }), json()),
    }),
  ],

  exceptionHandlers: [
    new winston.transports.File({
      filename: "logs/exceptions.log",
    }),
  ],
});

export default logger;