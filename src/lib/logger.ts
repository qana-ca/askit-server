import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

export const logger = WinstonModule.createLogger({
    transports: [
        new DailyRotateFile({
            filename: `logs/%DATE%-error.log`,
            level: 'error',
            format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
            datePattern: 'DD-MM-YYYY',
            zippedArchive: false,
            maxFiles: '365d'
        }),
        new DailyRotateFile({
            filename: `logs/%DATE%-combined.log`,
            format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
            datePattern: 'DD-MM-YYYY',
            zippedArchive: false,
            maxFiles: '365d'
        }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.cli(),
                winston.format.splat(),
                winston.format.timestamp(),
                winston.format.printf((info) => {
                    return `${info.timestamp} ${info.level}: ${info.message}`;
                })
            )
        })
    ]
});
