import { Module } from "@nestjs/common"
// import { SeriesService } from "./series.service"
import { SeriesController } from "./series.controller"
import { PrismaModule } from "../prisma/prisma.module"
import { SeriesService } from "./series.service"

@Module({
    imports: [PrismaModule],
    controllers: [SeriesController],
    providers: [SeriesService],
})
export class SeriesModule { }

