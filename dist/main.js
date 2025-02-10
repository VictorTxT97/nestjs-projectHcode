"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const log_interceptor_1 = require("./interceptors/log.interceptor");
const promises_1 = require("fs/promises");
async function bootstrap() {
    try {
        await (0, promises_1.mkdir)('storage/photos', { recursive: true });
    }
    catch (err) {
        if (err instanceof Error && err.code !== 'EEXIST') {
            console.error('Erro ao criar o diretório:', err);
        }
    }
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useGlobalInterceptors(new log_interceptor_1.LogInterceptor());
    await app.listen(3000);
}
bootstrap();
