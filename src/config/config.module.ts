import { TypedConfigModule, fileLoader, selectConfig } from 'nest-typed-config';
import { ApplicationConfig, DatabaseConfig, LoggerConfig, RootConfig, ThrottlerConfig } from './config';

export const ConfigModule = TypedConfigModule.forRoot({
    schema: RootConfig,
    load: fileLoader(),
    isGlobal: true
});

export const rootConfig = selectConfig(ConfigModule, RootConfig);
export const applicationConfig = selectConfig(ConfigModule, ApplicationConfig);
export const loggerConfig = selectConfig(ConfigModule, LoggerConfig);
export const throttlerConfig = selectConfig(ConfigModule, ThrottlerConfig);
export const databaseConfig = selectConfig(ConfigModule, DatabaseConfig);
