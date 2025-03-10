import { IsString, IsOptional, IsEnum, IsDateString, IsNumber, IsArray } from "class-validator";
import { MediaType } from "@prisma/client";

export class CreateMediaDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsDateString()
    releaseDate?: string;

    @IsEnum(MediaType)
    mediaType: MediaType;

    @IsOptional()
    @IsNumber()
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
    @IsNumber()
    seasonCount?: number;

    @IsOptional()
    @IsNumber()
    episodeCount?: number;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    rating?: number;

    @IsOptional()
    @IsString()
    posterUrl?: string;

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