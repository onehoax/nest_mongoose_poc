import { AppModule } from "@app/app/app.module";
import { Environment } from "@app/shared/enum/environment.enum";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix: string = "api";
  app.setGlobalPrefix(globalPrefix);

  const configService: ConfigService = app.get(ConfigService);
  const appName: string = configService.get<string>("APP_NAME");
  const port: number = configService.get<number>("PORT") ?? 3001;
  const env: Environment =
    configService.get<Environment>("NODE_ENV") ?? Environment.DEV;

  const config = new DocumentBuilder()
    .setTitle(appName)
    .setDescription(`${appName} App Documentation`)
    .setVersion("0.1")
    .addBearerAuth()
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  if (env !== Environment.PROD) {
    const swaggerPrefix: string = "docs";
    SwaggerModule.setup(swaggerPrefix, app, document);
    Logger.debug(
      `Swagger docs is running on: http://localhost:${port}/${swaggerPrefix}`,
      bootstrap.name,
    );
  }

  await app.listen(port);
  Logger.debug(
    `Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}
bootstrap();
