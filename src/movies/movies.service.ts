import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class MoviesService {
    private readonly swapiApiUrl = process.env.SWAPI_API_URL || "https://swapi.dev/api/films/";

    constructor(
        private prisma: PrismaService,
        private httpService: HttpService,
    ) { }

    async create(createMovieDto: CreateMovieDto) {
        try {
            return await this.prisma.movie.create({
                data: {
                    ...createMovieDto,
                    releaseDate: createMovieDto.releaseDate ? new Date(createMovieDto.releaseDate) : null,
                },
            });
        } catch (error) {
            if (error.code === "P2002") {
                throw new ConflictException(`Movie with externalId '${createMovieDto.externalId}' already exists`);
            }
            console.error("Error creating movie:", error);
            throw error;
        }
    }

    async findAll() {
        return this.prisma.movie.findMany();
    }

    async findOne(id: string) {
        const movie = await this.prisma.movie.findUnique({
            where: { id },
        });
        if (!movie) {
            throw new NotFoundException(`Movie with ID ${id} not found`);
        }
        return movie;
    }

    async update(id: string, updateMovieDto: UpdateMovieDto) {
        try {
            return await this.prisma.movie.update({
                where: { id },
                data: {
                    ...updateMovieDto,
                    releaseDate: updateMovieDto.releaseDate ? new Date(updateMovieDto.releaseDate) : undefined,
                },
            });
        } catch (error) {
            throw new NotFoundException(`Movie with ID ${id} not found`);
        }
    }

    async remove(id: string) {
        try {
            return await this.prisma.movie.delete({
                where: { id },
            });
        } catch (error) {
            throw new NotFoundException(`Movie with ID ${id} not found`);
        }
    }

    async fetchStarWarsMoviesFromApi() {
        try {
            const response = await firstValueFrom(this.httpService.get(this.swapiApiUrl));
            return response.data.results;
        } catch (error) {
            console.error("Error fetching Star Wars movies from API:", error);
            throw new Error("Failed to fetch Star Wars movies from API");
        }
    }

    async syncStarWarsMovies() {
        try {
            const response = await firstValueFrom(this.httpService.get(this.swapiApiUrl));
            const films = response.data.results;
            let syncCount = 0;

            for (const film of films) {
                const existingMovie = await this.prisma.movie.findUnique({
                    where: { externalId: film.url },
                });

                const movieData = {
                    title: film.title,
                    episodeId: film.episode_id,
                    openingCrawl: film.opening_crawl,
                    director: film.director,
                    producer: film.producer,
                    releaseDate: new Date(film.release_date),
                    characters: film.characters,
                    planets: film.planets,
                    starships: film.starships,
                    vehicles: film.vehicles,
                    species: film.species,
                    externalId: film.url,
                };

                if (existingMovie) {
                    await this.prisma.movie.update({
                        where: { id: existingMovie.id },
                        data: movieData,
                    });
                } else {
                    await this.prisma.movie.create({
                        data: movieData,
                    });
                    syncCount++;
                }
            }

            return {
                message: "Star Wars movies synchronized successfully",
                newItemsAdded: syncCount,
                totalItems: films.length,
            };
        } catch (error) {
            console.error("Error syncing Star Wars movies:", error);
            throw new Error("Failed to sync Star Wars movies");
        }
    }
}