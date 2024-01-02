import * as joi from 'joi';

export interface ConfigServiceEnv {
    LOBBY_MAX_LIFETIME: string;
}

export const config = {
    load: () => ({
        NODE_ENV: process.env.NODE_ENV,
        APP_PORT: Number(process.env.APP_PORT),
        LOBBY_MAX_LIFETIME: Number(process.env.LOBBY_MAX_LIFETIME)
    }),
    validationSchema: joi.object({
        NODE_ENV: joi.string().valid('development', 'production').required(),
        APP_PORT: joi.number().required(),
        LOBBY_MAX_LIFETIME: joi.number().required()
    }),
    const: {
        ONEC_ECP_VALIDATE_CERTIFICATE_OPERATION: 'ValidateCertificateAndGetInfo',
        ONEC_ECP_GET_FILE_HASH_OPERATION: 'HashData'
    }
};
