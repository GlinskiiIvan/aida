import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import { ValidationPipe } from "src/pipes/validation.pipe";
import { GlobalExceptionFilter } from "src/filters/global-exception.filter";
import { OperationCodeInterceptor } from "src/interceptors/operation-code.interceptor";

async function bootstrap() {
  const PORT = Number(process.env.PORT) || 5000;
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);

  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle("MRI-backend")
    // .setDescription('The nestjs course API description')
    .setVersion("1.0.0")
    .addTag("MRI")
    .addBearerAuth(
      {
        description: "Введите JWT токен для авторизации",
        name: "Authorization",
        bearerFormat: "Bearer",
        scheme: "Bearer",
        type: "http",
        in: "Header",
      },
      "token",
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/api/docs", app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new OperationCodeInterceptor(app.get(Reflector)));

  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}
bootstrap();
