import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common"
// import type { SeriesService } from "./series.service"
import type { CreateSeriesDto } from "./dto/create-series.dto"
import type { UpdateSeriesDto } from "./dto/update-series.dto"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { RolesGuard } from "../auth/roles.guard"
import { Roles } from "../auth/roles.decorator"
import { Public } from "../auth/public.decorator"
import { SeriesService } from "./series.service"

@Controller("series")
export class SeriesController {
    constructor(private readonly seriesService: SeriesService) { }

    @Get()
    @Public()
    findAll() {
        return this.seriesService.findAll()
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('USER')
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.seriesService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Post()
    create(@Body() createSeriesDto: CreateSeriesDto) {
        return this.seriesService.create(createSeriesDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("ADMIN")
    @Patch(":id")
    update(@Param('id') id: string, @Body() updateSeriesDto: UpdateSeriesDto) {
        return this.seriesService.update(id, updateSeriesDto)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.seriesService.remove(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("ADMIN")
    @Post("add")
    addStarWarsSeries() {
        return this.seriesService.addStarWarsSeries()
    }
}

