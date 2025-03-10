import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { AuthModule } from "./auth/auth.module"
import { UsersModule } from "./users/users.module"
import { PrismaModule } from "./prisma/prisma.module"
import { MoviesModule } from "./movies/movies.module"
import { ScheduleModule } from "@nestjs/schedule"
import { APP_GUARD } from "@nestjs/core"
import { JwtAuthGuard } from "./auth/jwt-auth.guard"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    MoviesModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

