// import { NestFactory } from "@nestjs/core"
// import { ValidationPipe } from "@nestjs/common"
// import { AppModule } from "./app.module"
// import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule)

//   // Enable validation
//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       transform: true,
//     }),
//   )

//   // Enable CORS
//   app.enableCors()

//   // Setup Swagger
//   const config = new DocumentBuilder()
//     .setTitle("Star Wars API")
//     .setDescription("API for Star Wars movies and TV series")
//     .setVersion("1.0")
//     .addBearerAuth()
//     .build()
//   const document = SwaggerModule.createDocument(app, config)
//   SwaggerModule.setup("api", app, document)

//   await app.listen(3000)
// }
// bootstrap()

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe());

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle("Movies API")
    .setDescription("API for managing movies")
    .setVersion("1.0")
    .addBearerAuth( // Add JWT Bearer authentication
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      "JWT-auth" // Name of the security scheme
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document); // Swagger UI at /api

  await app.listen(3000);
}
bootstrap();