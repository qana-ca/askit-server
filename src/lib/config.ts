import * as joi from 'joi';

export const config = {
    load: () => ({
        NODE_ENV: process.env.NODE_ENV,
        ASKIT_SERVER_PORT: Number(process.env.ASKIT_SERVER_PORT),
        LOBBY_MAX_LIFETIME: Number(process.env.LOBBY_MAX_LIFETIME),
        THROTTLER_TTL: Number(process.env.THROTTLER_TTL),
        THROTTLER_LIMIT: Number(process.env.THROTTLER_LIMIT),
        LOGGER_ERROR_MAX_FILES: process.env.LOGGER_ERROR_MAX_FILES,
        LOGGER_COMBINED_MAX_FILES: process.env.LOGGER_COMBINED_MAX_FILES
    }),
    validationSchema: joi.object({
        NODE_ENV: joi.string().valid('development', 'production').required(),
        ASKIT_SERVER_PORT: joi.number().required(),
        LOBBY_MAX_LIFETIME: joi.number().required(),
        THROTTLER_TTL: joi.number().required(),
        THROTTLER_LIMIT: joi.number().required(),
        LOGGER_ERROR_MAX_FILES: joi.string().required(),
        LOGGER_COMBINED_MAX_FILES: joi.string().required()
    })
};
