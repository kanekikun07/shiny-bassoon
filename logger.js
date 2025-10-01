const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

const logFormat = format.printf(({ timestamp, level, message }) => {
  return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

const transportConsole = new transports.Console({
  level: 'debug',
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    logFormat
  )
});

const transportFile = new transports.DailyRotateFile({
  filename: path.join('logs', 'proxy_relay-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'info',
  format: format.combine(
    format.timestamp(),
    logFormat
  )
});

const logger = createLogger({
  level: 'debug',
  transports: [
    transportConsole,
    transportFile
  ],
  exitOnError: false,
});

module.exports = logger;
