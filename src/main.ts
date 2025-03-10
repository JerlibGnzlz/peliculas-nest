// import { NestFactory } from "@nestjs/core";
// import { AppModule } from "./app.module";
// import { ValidationPipe } from "@nestjs/common";
// import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   // Enable validation globally
//   app.useGlobalPipes(new ValidationPipe());

//   // Configure Swagger
//   const config = new DocumentBuilder()
//     .setTitle("Movies API")
//     .setDescription("API for managing movies")
//     .setVersion("1.0")
//     .addBearerAuth( // Add JWT Bearer authentication
//       {
//         type: "http",
//         scheme: "bearer",
//         bearerFormat: "JWT",
//       },
//       "JWT-auth" // Name of the security scheme
//     )
//     .build();
//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup("api", app, document); // Swagger UI at /api

//   await app.listen(3000);
// }
// bootstrap();


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe());

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Movies API')
    .setDescription('API for managing movies')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger UI at /api

  // Get the port from the environment variable or fallback to 3000
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000); // Default to 3000 if not found

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
