import winston from 'winston';
import config from '../config';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  config.isProduction
    ? winston.format.json()
    : winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
          let log = `${timestamp} [${level}]: ${message}`;
          if (stack) log += `\n${stack}`;
          if (Object.keys(meta).length > 0) {
            log += `\n${JSON.stringify(meta, null, 2)}`;
          }
          return log;
        })
      )
);

export const logger = winston.createLogger({
  level: config.isProduction ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'echo-outfits-api' },
  transports: [
    new winston.transports.Console(),
    // Add file transports in production if needed
    ...(config.isProduction
      ? [
          new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
          new winston.transports.File({ filename: 'logs/combined.log' }),
        ]
      : []),
  ],
});

// Create a stream for Morgan HTTP request logging
export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};
