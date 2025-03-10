import { Module } from "@nestjs/common"
import { MoviesController } from "./movies.controller"
import { PrismaModule } from "../prisma/prisma.module"
import { HttpModule } from "@nestjs/axios"
import { MoviesService } from "./movies.service"

@Module({
    imports: [PrismaModule, HttpModule],
    controllers: [MoviesController],
    providers: [MoviesService],
})
export class MoviesModule { }

