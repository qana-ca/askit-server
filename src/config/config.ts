import { Type } from 'class-transformer';
import { Allow, IsNumber, IsString, Min, ValidateNested } from 'class-validator';

export class ApplicationConfig {
    @Allow()
    @IsNumber()
    public readonly port!: number;
}

export class GameConfig {
    @Allow()
    @IsNumber()
    @Min(1)
    public readonly maxLobbyLifetime!: number;
}

export class ThrottlerConfig {
    @Allow()
    @IsNumber()
    public readonly ttl!: number;

    @Allow()
    @IsNumber()
    public readonly limit!: number;
}

export class LoggerConfig {
    @Allow()
    @IsString()
    public readonly errorMaxFiles!: string;

    @Allow()
    @IsString()
    public readonly combinedMaxFiles!: string;
}

export class DatabaseConfig {
    @Allow()
    @IsString()
    public readonly host!: string;

    @Allow()
    @IsNumber()
    public readonly port!: number;

    @Allow()
    @IsString()
    public readonly username!: string;

    @Allow()
    @IsString()
    public readonly password!: string;

    @Allow()
    @IsString()
    public readonly database!: string;
}

export class GoogleAuthConfig {
    @Allow()
    @IsString()
    public readonly clientId!: string;

    @Allow()
    @IsString()
    public readonly clientSecret!: string;
}

export class RootConfig {
    @IsString()
    public readonly NODE_ENV!: string;

    @Type(() => ApplicationConfig)
    @ValidateNested()
    public readonly application!: ApplicationConfig;

    @Type(() => GameConfig)
    @ValidateNested()
    public readonly game!: GameConfig;

    @Type(() => ThrottlerConfig)
    @ValidateNested()
    public readonly throttler!: ThrottlerConfig;

    @Type(() => LoggerConfig)
    @ValidateNested()
    public readonly logger!: LoggerConfig;

    @Type(() => DatabaseConfig)
    @ValidateNested()
    public readonly database!: DatabaseConfig;

    @Type(() => GoogleAuthConfig)
    @ValidateNested()
    public readonly googleAuth!: GoogleAuthConfig;
}
