import { Injectable, NotFoundException, ConflictException } from "@nestjs/common"
import type { PrismaService } from "../prisma/prisma.service"
import type { CreateSeriesDto } from "./dto/create-series.dto"
import type { UpdateSeriesDto } from "./dto/update-series.dto"

@Injectable()
export class SeriesService {
    constructor(private prisma: PrismaService) { }

    async create(createSeriesDto: CreateSeriesDto) {
        try {
            return await this.prisma.series.create({
                data: {
                    ...createSeriesDto,
                    releaseDate: createSeriesDto.releaseDate ? new Date(createSeriesDto.releaseDate) : null,
                },
            })
        } catch (error) {
            if (error.code === "P2002") {
                throw new ConflictException(`Series with externalId '${createSeriesDto.externalId}' already exists`)
            }
            console.error("Error creating series:", error)
            throw error
        }
    }

    async findAll() {
        return this.prisma.series.findMany()
    }

    async findOne(id: string) {
        const series = await this.prisma.series.findUnique({
            where: { id },
        })
        if (!series) {
            throw new NotFoundException(`Series with ID ${id} not found`)
        }
        return series
    }

    async update(id: string, updateSeriesDto: UpdateSeriesDto) {
        try {
            return await this.prisma.series.update({
                where: { id },
                data: {
                    ...updateSeriesDto,
                    releaseDate: updateSeriesDto.releaseDate ? new Date(updateSeriesDto.releaseDate) : undefined,
                },
            })
        } catch (error) {
            throw new NotFoundException(`Series with ID ${id} not found`)
        }
    }

    async remove(id: string) {
        try {
            return await this.prisma.series.delete({
                where: { id },
            })
        } catch (error) {
            throw new NotFoundException(`Series with ID ${id} not found`)
        }
    }

    async addStarWarsSeries() {
        // Since SWAPI doesn't have TV series data, we'll add them manually
        const starWarsSeries = [
            {
                title: "The Mandalorian",
                description:
                    "After the fall of the Empire, a lone gunfighter makes his way through the lawless galaxy with his foundling companion, Grogu.",
                creator: "Jon Favreau",
                releaseDate: new Date("2019-11-12"),
                seasons: 3,
                episodes: 24,
                characters: [],
                planets: [],
                posterUrl:
                    "https://m.media-amazon.com/images/M/MV5BN2M5YWFjN2YtYzU2YS00NzBlLTgwZWUtYWQzNWFhNDkyYjg3XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg",
                trailerUrl: "https://www.youtube.com/watch?v=aOC8E8z_ifw",
                externalId: "sw-series-mandalorian",
            },
            {
                title: "The Book of Boba Fett",
                description:
                    "Bounty hunter Boba Fett and mercenary Fennec Shand navigate the underworld when they return to Tatooine to claim Jabba the Hutt's territory.",
                creator: "Jon Favreau",
                releaseDate: new Date("2021-12-29"),
                seasons: 1,
                episodes: 7,
                characters: [],
                planets: [],
                posterUrl:
                    "https://m.media-amazon.com/images/M/MV5BZjllZjE1MWEtYTJhZC00MWIyLTliMjEtYzM3ODc4YzQ2MjFlXkEyXkFqcGdeQXVyODIyOTEyMzY@._V1_.jpg",
                trailerUrl: "https://www.youtube.com/watch?v=rOJ1cw6mohw",
                externalId: "sw-series-boba-fett",
            },
            {
                title: "Obi-Wan Kenobi",
                description:
                    "Jedi Master Obi-Wan Kenobi watches over young Luke Skywalker and evades the Empire's elite Jedi hunters during his exile on Tatooine.",
                creator: "Deborah Chow",
                releaseDate: new Date("2022-05-27"),
                seasons: 1,
                episodes: 6,
                characters: [],
                planets: [],
                posterUrl:
                    "https://m.media-amazon.com/images/M/MV5BOTAxOTlmOTAtMjA0Yy00YjVjLWE3OTQtYjAzMWMxOTdhZDZkXkEyXkFqcGdeQXVyMTM1MTE1NDMx._V1_.jpg",
                trailerUrl: "https://www.youtube.com/watch?v=3Yh_6_zItPU",
                externalId: "sw-series-obi-wan",
            },
            {
                title: "Andor",
                description:
                    "Prequel series to Star Wars' 'Rogue One'. In an era filled with danger, deception and intrigue, Cassian will embark on the path that is destined to turn him into a Rebel hero.",
                creator: "Tony Gilroy",
                releaseDate: new Date("2022-09-21"),
                seasons: 1,
                episodes: 12,
                characters: [],
                planets: [],
                posterUrl:
                    "https://m.media-amazon.com/images/M/MV5BNDgxNTIyZTMtMzYxNi00NmRjLWFiMTEtM2U4MTFmODkzNzM1XkEyXkFqcGdeQXVyMTM1MTE1NDMx._V1_.jpg",
                trailerUrl: "https://www.youtube.com/watch?v=cKOegEuCcfw",
                externalId: "sw-series-andor",
            },
            {
                title: "Ahsoka",
                description: "Ahsoka Tano investigates an emerging threat to the galaxy following the fall of the Empire.",
                creator: "Dave Filoni",
                releaseDate: new Date("2023-08-22"),
                seasons: 1,
                episodes: 8,
                characters: [],
                planets: [],
                posterUrl:
                    "https://m.media-amazon.com/images/M/MV5BYjhkOWNlNzQtYzAyMC00NGIyLWI2ZmYtNTllMzgzZjFkN2JkXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg",
                trailerUrl: "https://www.youtube.com/watch?v=J7-zia4oHNo",
                externalId: "sw-series-ahsoka",
            },
        ]

        let addedCount = 0

        for (const series of starWarsSeries) {
            // Check if series already exists
            const existingSeries = await this.prisma.series.findUnique({
                where: { externalId: series.externalId },
            })

            if (!existingSeries) {
                await this.prisma.series.create({
                    data: series,
                })
                addedCount++
            }
        }

        return {
            message: "Star Wars TV series added successfully",
            newItemsAdded: addedCount,
            totalItems: starWarsSeries.length,
        }
    }
}

