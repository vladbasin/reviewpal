import util from 'util';
import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'warn',
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    }),
    format.errors({ stack: true })
  ),
  transports: [new transports.Console()],
});

console.log = (...args): void => {
  logger.info(util.format(...args));
};

console.error = (...args): void => {
  logger.error(util.format(...args));
};

console.warn = (...args): void => {
  logger.warn(util.format(...args));
};

console.debug = (...args): void => {
  logger.debug(util.format(...args));
};
