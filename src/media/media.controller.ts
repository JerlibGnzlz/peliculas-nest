import { Controller, Get, Post, Query, UseGuards } from "@nestjs/common"
import type { MediaService } from "./media.service"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { RolesGuard } from "../auth/roles.guard"
import { Roles } from "../auth/roles.decorator"
import { Public } from "../auth/public.decorator"

@Controller("media")
export class MediaController {
    constructor(private readonly mediaService: MediaService) { }

    @Get()
    @Public()
    findAllMedia() {
        return this.mediaService.findAllMedia()
    }

    @Get('search')
    @Public()
    searchMedia(@Query('q') query: string) {
        return this.mediaService.searchMedia(query);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("ADMIN")
    @Post("sync")
    syncAllStarWarsMedia() {
        return this.mediaService.syncAllStarWarsMedia()
    }
}

