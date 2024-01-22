import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor(private readonly logger: Logger) {}

    use(req: Request, res: Response, next: NextFunction) {
        const sessionId = randomUUID();
        const dateStart = new Date();

        // Request
        this.logger.log(
            `${sessionId} | Request: [${req.method}] ${req.originalUrl} Body: ${JSON.stringify(
                req.body
            )} Referer: "${req.get('referer')}" UA: "${req.get('user-agent')}" IP: ${
                req.ip
            } | ISO: ${new Date().toISOString()}`
        );

        // Response
        res.on('close', () => {
            const { statusCode, statusMessage } = res;
            const { method, originalUrl: url } = req;

            const dateEnd = new Date();
            const deltaTime = dateEnd.getTime() - dateStart.getTime();

            this.logger.log(
                `${sessionId} | Response: [${method}] ${url} ${statusCode} ${statusMessage} | Delta time: ${deltaTime}ms`
            );
        });

        next();
    }
}
