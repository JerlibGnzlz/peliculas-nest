import { IsString, IsOptional, IsInt, IsDateString, IsArray } from "class-validator";

export class CreateMovieDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsInt()
    episodeId?: number;

    @IsOptional()
    @IsString()
    openingCrawl?: string;

    @IsOptional()
    @IsString()
    director?: string;

    @IsOptional()
    @IsString()
    producer?: string;

    @IsOptional()
    @IsDateString()
    releaseDate?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    characters?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    planets?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    starships?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    vehicles?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    species?: string[];

    @IsString()
    externalId: string;
}