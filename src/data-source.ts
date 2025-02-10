import { DataSource } from 'typeorm';
import { UserEntity } from './user/entity/user.entity';
import 'dotenv/config'; // Carrega automaticamente as variáveis do .env


export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [UserEntity], // Adicione todas as suas entidades aqui
  migrations: ['src/migrations/*.ts'], // Diretório das migrations em TypeScript
  synchronize: false, // Manter como false para evitar alterações automáticas no banco
});
