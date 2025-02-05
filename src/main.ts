import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LogInterceptor } from './interceptors/log.interceptor';
import { mkdir } from 'fs/promises';

async function bootstrap() {
    try {
        await mkdir('storage/photos', { recursive: true });
    } catch (err) {
        if (err instanceof Error && (err as any).code !== 'EEXIST') {

            console.error('Erro ao criar o diretório:', err);
        }
    }

    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalInterceptors(new LogInterceptor());

    await app.listen(3000);
}
bootstrap();

