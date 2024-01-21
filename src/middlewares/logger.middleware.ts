import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor(private readonly logger: Logger) {}

    use(req: Request, res: Response, next: NextFunction) {
        const sessionId = randomUUID();

        // Request
        this.logger.log(
            `${sessionId} | REQUEST: [${req.method}] ${req.originalUrl} Body: ${JSON.stringify(
                req.body
            )} Referer: "${req.get('referer')}" UA: "${req.get('user-agent')}" IP: ${req.ip}`
        );

        // Response
        res.on('close', () => {
            const { statusCode, statusMessage } = res;
            const { method, originalUrl: url } = req;

            this.logger.log(`${sessionId} | RESPONSE: [${method}] ${url} ${statusCode} ${statusMessage}`);
        });

        next();
    }
}
