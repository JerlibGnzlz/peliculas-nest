import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from "@nestjs/common";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { Public } from "../auth/public.decorator";
import { MoviesService } from "./movies.service";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller("movies")
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) { }

    @Get()
    @Public()
    findAll() {
        return this.moviesService.findAll();
    }

    @Get("swapi")
    @Public()
    fetchStarWarsMoviesFromApi() {
        return this.moviesService.fetchStarWarsMoviesFromApi();
    }


    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("USER")
    @Get(":id")
    @ApiBearerAuth("JWT-auth")
    findOne(@Param("id") id: string) {
        return this.moviesService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("ADMIN")
    @Post()
    @ApiBearerAuth("JWT-auth")
    create(@Body() createMovieDto: CreateMovieDto) {
        return this.moviesService.create(createMovieDto);
    }



    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("ADMIN")
    @Patch(":id")
    @ApiBearerAuth("JWT-auth")
    @ApiResponse({ status: 200, description: "Movie updated successfully" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 403, description: "Forbidden" })
    @ApiResponse({ status: 404, description: "Movie not found" })
    update(@Param("id") id: string, @Body() updateMovieDto: UpdateMovieDto) {
        return this.moviesService.update(id, updateMovieDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("ADMIN")
    @Delete(":id")
    @ApiBearerAuth("JWT-auth")
    remove(@Param("id") id: string) {
        return this.moviesService.remove(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("ADMIN")
    @Post("sync")
    @ApiBearerAuth("JWT-auth")

    syncStarWarsMovies() {
        return this.moviesService.syncStarWarsMovies();
    }
}