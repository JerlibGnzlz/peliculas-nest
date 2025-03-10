import { IsNotEmpty, IsString, IsOptional, IsArray, IsDateString, IsNumber, IsUrl } from "class-validator"

export class CreateSeriesDto {
    @IsNotEmpty()
    @IsString()
    title: string

    @IsOptional()
    @IsString()
    description?: string

    @IsOptional()
    @IsString()
    creator?: string

    @IsOptional()
    @IsDateString()
    releaseDate?: string

    @IsOptional()
    @IsNumber()
    seasons?: number

    @IsOptional()
    @IsNumber()
    episodes?: number

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    characters?: string[]

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    planets?: string[]

    @IsOptional()
    @IsUrl()
    posterUrl?: string

    @IsOptional()
    @IsUrl()
    trailerUrl?: string

    @IsOptional()
    @IsString()
    externalId?: string
}

