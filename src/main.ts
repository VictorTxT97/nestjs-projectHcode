import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LogInterceptor } from './interceptors/log.interceptor';
import { mkdir } from 'fs/promises';

async function bootstrap() {
  // Verifica e cria o diretório somente se necessário
  try {
    await mkdir('storage/photos', { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') {
      console.error('Erro ao criar o diretório:', err);
    }
  }

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalInterceptors(new LogInterceptor());

  await app.listen(3000);
}
bootstrap();

