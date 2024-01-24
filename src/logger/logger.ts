import { WinstonModule } from 'nest-winston';
import { loggerConfig } from 'src/config/config.module';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

export const logger = WinstonModule.createLogger({
    transports: [
        new DailyRotateFile({
            filename: `logs/%DATE%-error.log`,
            level: 'error',
            format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
            datePattern: 'DD-MM-YYYY',
            zippedArchive: true,
            maxFiles: loggerConfig.errorMaxFiles
        }),
        new DailyRotateFile({
            filename: `logs/%DATE%-combined.log`,
            format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
            datePattern: 'DD-MM-YYYY',
            zippedArchive: true,
            maxFiles: loggerConfig.combinedMaxFiles
        }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.cli(),
                winston.format.splat(),
                winston.format.timestamp(),
                winston.format.printf((info) => {
                    return `${info.timestamp} | ${info.level}: ${info.message}`;
                })
            )
        })
    ]
});
