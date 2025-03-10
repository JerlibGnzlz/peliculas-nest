import { Module } from "@nestjs/common"
import { MediaService } from "./media.service"
import { MediaController } from "./media.controller"
import { PrismaModule } from "../prisma/prisma.module"
import { MoviesModule } from "../movies/movies.module"
import { SeriesModule } from "src/series/series.module"

@Module({
    imports: [PrismaModule, MoviesModule, SeriesModule],
    controllers: [MediaController],
    providers: [MediaService],
})
export class MediaModule { }

