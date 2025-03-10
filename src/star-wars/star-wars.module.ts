import { Module } from "@nestjs/common"
import { StarWarsController } from "./star-wars.controller"
import { PrismaModule } from "../prisma/prisma.module"
import { HttpModule } from "@nestjs/axios"
import { StarWarsService } from "./star-wars.service"

@Module({
    imports: [PrismaModule, HttpModule],
    controllers: [StarWarsController],
    providers: [StarWarsService],
    exports: [StarWarsService],
})
export class StarWarsModule { }

