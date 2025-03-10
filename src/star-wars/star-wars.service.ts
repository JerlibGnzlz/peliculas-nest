import { Injectable, Logger } from "@nestjs/common"
import type { HttpService } from "@nestjs/axios"
import type { PrismaService } from "../prisma/prisma.service"
import { firstValueFrom } from "rxjs"
import { Cron, CronExpression } from "@nestjs/schedule"

@Injectable()
export class StarWarsService {
    private readonly logger = new Logger(StarWarsService.name)
    private readonly baseUrl = "https://swapi.dev/api"

    constructor(
        private readonly httpService: HttpService,
        private readonly prisma: PrismaService,
    ) { }

    // Fetch all films from SWAPI
    async fetchFilms() {
        try {
            const response = await firstValueFrom(this.httpService.get(`${this.baseUrl}/films/`))
            return response.data.results
        } catch (error) {
            this.logger.error(`Failed to fetch films: ${error.message}`)
            throw new Error("Failed to fetch films from Star Wars API")
        }
    }

    // Fetch a specific film by ID
    async fetchFilmById(id: string) {
        try {
            const response = await firstValueFrom(this.httpService.get(`${this.baseUrl}/films/${id}/`))
            return response.data
        } catch (error) {
            this.logger.error(`Failed to fetch film ${id}: ${error.message}`)
            throw new Error(`Failed to fetch film ${id} from Star Wars API`)
        }
    }

    // Fetch character details
    async fetchCharacter(url: string) {
        try {
            const response = await firstValueFrom(this.httpService.get(url))
            return response.data
        } catch (error) {
            this.logger.error(`Failed to fetch character ${url}: ${error.message}`)
            return null
        }
    }

    // Fetch planet details
    async fetchPlanet(url: string) {
        try {
            const response = await firstValueFrom(this.httpService.get(url))
            return response.data
        } catch (error) {
            this.logger.error(`Failed to fetch planet ${url}: ${error.message}`)
            return null
        }
    }

    // Sync all Star Wars films to the database
    async syncStarWarsFilms() {
        try {
            const films = await this.fetchFilms()
            let syncCount = 0

            for (const film of films) {
                // Check if film already exists
                const existingMedia = await this.prisma.media.findUnique({
                    where: { externalId: film.url },
                })

                const mediaData = {
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
                    mediaType: "MOVIE",
                    // Add additional fields with placeholder data
                    posterUrl: `https://starwars-visualguide.com/assets/img/films/${film.episode_id}.jpg`,
                    rating: 0, // Default rating
                }

                if (existingMedia) {
                    // Update existing media
                    await this.prisma.media.update({
                        where: { id: existingMedia.id },
                        data: mediaData,
                    })
                } else {
                    // Create new media
                    await this.prisma.media.create({
                        data: mediaData,
                    })
                    syncCount++
                }
            }

            return {
                message: "Star Wars films synchronized successfully",
                newItemsAdded: syncCount,
                totalItems: films.length,
            }
        } catch (error) {
            this.logger.error(`Error syncing Star Wars films: ${error.message}`)
            throw new Error("Failed to sync Star Wars films")
        }
    }

    // Add TV series data (since SWAPI doesn't have TV series, we'll add them manually)
    async addStarWarsTVSeries() {
        const tvSeries = [
            {
                title: "The Mandalorian",
                releaseDate: new Date("2019-11-12"),
                mediaType: "TV_SERIES",
                seasonCount: 3,
                episodeCount: 24,
                description:
                    "After the fall of the Empire, a lone gunfighter makes his way through the lawless galaxy with his foundling companion, Grogu.",
                rating: 8.7,
                posterUrl:
                    "https://m.media-amazon.com/images/M/MV5BN2M5YWFjN2YtYzU2YS00NzBlLTgwZWUtYWQzNWFhNDkyYjg3XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg",
                characters: [],
                planets: [],
                starships: [],
                vehicles: [],
                species: [],
            },
            {
                title: "The Book of Boba Fett",
                releaseDate: new Date("2021-12-29"),
                mediaType: "TV_SERIES",
                seasonCount: 1,
                episodeCount: 7,
                description:
                    "Bounty hunter Boba Fett and mercenary Fennec Shand navigate the underworld when they return to Tatooine to claim Jabba the Hutt's territory.",
                rating: 7.3,
                posterUrl:
                    "https://m.media-amazon.com/images/M/MV5BZjllZjE1MWEtYTJhZC00MWIyLTliMjEtYzM3ODc4YzQ2MjFlXkEyXkFqcGdeQXVyODIyOTEyMzY@._V1_.jpg",
                characters: [],
                planets: [],
                starships: [],
                vehicles: [],
                species: [],
            },
            {
                title: "Obi-Wan Kenobi",
                releaseDate: new Date("2022-05-27"),
                mediaType: "TV_SERIES",
                seasonCount: 1,
                episodeCount: 6,
                description:
                    "Jedi Master Obi-Wan Kenobi watches over young Luke Skywalker and evades the Empire's elite Jedi hunters during his exile on Tatooine.",
                rating: 7.1,
                posterUrl:
                    "https://m.media-amazon.com/images/M/MV5BOTAxOTlmOTAtMjA0Yy00YjVjLWE3OTQtYjAzMWMxOTdhZDZkXkEyXkFqcGdeQXVyMTM1MTE1NDMx._V1_.jpg",
                characters: [],
                planets: [],
                starships: [],
                vehicles: [],
                species: [],
            },
            {
                title: "Andor",
                releaseDate: new Date("2022-09-21"),
                mediaType: "TV_SERIES",
                seasonCount: 1,
                episodeCount: 12,
                description:
                    "Prequel series to Star Wars' 'Rogue One'. In an era filled with danger, deception and intrigue, Cassian will embark on the path that is destined to turn him into a Rebel hero.",
                rating: 8.3,
                posterUrl:
                    "https://m.media-amazon.com/images/M/MV5BNDgxNTIyZTMtMzYxNi00NmRjLWFiMTEtM2U4MTFmODkzNzM1XkEyXkFqcGdeQXVyMTM1MTE1NDMx._V1_.jpg",
                characters: [],
                planets: [],
                starships: [],
                vehicles: [],
                species: [],
            },
            {
                title: "Ahsoka",
                releaseDate: new Date("2023-08-22"),
                mediaType: "TV_SERIES",
                seasonCount: 1,
                episodeCount: 8,
                description: "Ahsoka Tano investigates an emerging threat to the galaxy following the fall of the Empire.",
                rating: 7.8,
                posterUrl:
                    "https://m.media-amazon.com/images/M/MV5BYjhkOWNlNzQtYzAyMC00NGIyLWI2ZmYtNTllMzgzZjFkN2JkXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg",
                characters: [],
                planets: [],
                starships: [],
                vehicles: [],
                species: [],
            },
        ]

        let addedCount = 0

        for (const series of tvSeries) {
            // Check if series already exists
            const existingSeries = await this.prisma.media.findFirst({
                where: {
                    title: series.title,
                    mediaType: "TV_SERIES",
                },
            })

            if (!existingSeries) {
                await this.prisma.media.create({
                    data: series,
                })
                addedCount++
            }
        }

        return {
            message: "Star Wars TV series added successfully",
            newItemsAdded: addedCount,
            totalItems: tvSeries.length,
        }
    }

    // Run daily at midnight to sync Star Wars data
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async scheduledSync() {
        this.logger.log("Running scheduled sync of Star Wars media")
        try {
            await this.syncStarWarsFilms()
            this.logger.log("Scheduled sync of films completed successfully")

            await this.addStarWarsTVSeries()
            this.logger.log("Scheduled sync of TV series completed successfully")
        } catch (error) {
            this.logger.error(`Scheduled sync failed: ${error.message}`)
        }
    }
}

