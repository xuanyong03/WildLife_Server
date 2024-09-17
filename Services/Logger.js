const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize } = format;

// Define custom log format with colorization
const logFormat = printf(({ level, message, timestamp }) => {
  let colorizedTimestamp = timestamp;
  if (level === "info") {
    colorizedTimestamp = `\x1b[32m${timestamp}\x1b[0m`; // Green for info
  } else if (level === "error") {
    colorizedTimestamp = `\x1b[31m${timestamp}\x1b[0m`; // Red for error
  }
  return `${colorizedTimestamp} [${level.toUpperCase()}]:\n${message}`;
});

// Create logger
const logger = createLogger({
  level: "info",
  format: combine(timestamp({ format: "DD-MM-YYYY HH:mm:ss" }), logFormat),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "combined.log" }),
  ],
});

module.exports = logger;
