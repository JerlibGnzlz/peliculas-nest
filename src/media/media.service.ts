import { Injectable } from "@nestjs/common"
import type { PrismaService } from "../prisma/prisma.service"
import type { MoviesService } from "../movies/movies.service"
import { SeriesService } from "src/series/series.service"
// import type { SeriesService } from "../series/series.service"

@Injectable()
export class MediaService {
    constructor(
        private prisma: PrismaService,
        private moviesService: MoviesService,
        private seriesService: SeriesService,
    ) { }

    async findAllMedia() {
        const movies = await this.moviesService.findAll()
        const series = await this.seriesService.findAll()

        return {
            movies,
            series,
        }
    }

    async searchMedia(query: string) {
        const movies = await this.prisma.movie.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { director: { contains: query, mode: "insensitive" } },
                    { producer: { contains: query, mode: "insensitive" } },
                    { openingCrawl: { contains: query, mode: "insensitive" } },
                ],
            },
        })

        const series = await this.prisma.series.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { creator: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                ],
            },
        })

        return {
            movies,
            series,
        }
    }

    async syncAllStarWarsMedia() {
        const moviesResult = await this.moviesService.syncStarWarsMovies()
        const seriesResult = await this.seriesService.addStarWarsSeries()

        return {
            movies: moviesResult,
            series: seriesResult,
            message: "All Star Wars media synchronized successfully",
        }
    }
}

