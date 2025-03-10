import { Controller, Get, Post, Param, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { RolesGuard } from "../auth/roles.guard"
import { Roles } from "../auth/roles.decorator"
import { StarWarsService } from "./star-wars.service"

@Controller("star-wars")
export class StarWarsController {
    constructor(private readonly starWarsService: StarWarsService) { }

    @Post("sync/films")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("ADMIN")
    syncFilms() {
        return this.starWarsService.syncStarWarsFilms()
    }

    @Post("sync/tv-series")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("ADMIN")
    syncTVSeries() {
        return this.starWarsService.addStarWarsTVSeries()
    }

    @Post("sync/all")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("ADMIN")
    async syncAll() {
        const filmsResult = await this.starWarsService.syncStarWarsFilms()
        const tvSeriesResult = await this.starWarsService.addStarWarsTVSeries()

        return {
            films: filmsResult,
            tvSeries: tvSeriesResult,
            message: "All Star Wars media synchronized successfully",
        }
    }

    @Get("films")
    async getFilmsFromAPI() {
        return this.starWarsService.fetchFilms()
    }

    @Get('films/:id')
    async getFilmByIdFromAPI(@Param('id') id: string) {
        return this.starWarsService.fetchFilmById(id);
    }
}

