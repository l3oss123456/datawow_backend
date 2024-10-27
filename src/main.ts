import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/module/app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { GeneralErrorFilter } from './middleware/generalError.middileware';
import { ValidationPipe } from './utils/validation.pipe';
import { IoAdapter } from '@nestjs/platform-socket.io';
// import { AuthGuard } from '@nestjs/passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalGuards(AuthGuard('jwt'));
  // app.useGlobalGuards(new JwtAuthGuard()); // Now you can use the instantiated guard
  app.setGlobalPrefix(`api`);
  app.enableCors();
  app.useGlobalFilters(new GeneralErrorFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useWebSocketAdapter(new IoAdapter(app)); // Make sure to add this line
  // app.useGlobalFilters(new SequelizeUniqueConstraintErrorFilter());
  // app.use(requestIp.mw());

  const config = new DocumentBuilder()
    .setTitle('Api Swagger')
    .setDescription('All backend api')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT);
}
bootstrap();
