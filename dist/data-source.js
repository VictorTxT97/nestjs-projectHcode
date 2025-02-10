"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user/entity/user.entity");
require("dotenv/config"); // Carrega automaticamente as variáveis do .env
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [user_entity_1.UserEntity], // Adicione todas as suas entidades aqui
    migrations: ['src/migrations/*.ts'], // Diretório das migrations em TypeScript
    synchronize: false, // Manter como false para evitar alterações automáticas no banco
});
