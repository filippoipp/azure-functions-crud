import { DataSource } from "typeorm";

const basePath = './dist/';

export const AppDataSource = new DataSource({
    type: 'mssql',
    host: 'my-db-server.database.windows.net',
    port: 1433,
    username: 'CloudSA40b90788',
    password: '123#Gotebu65',
    database: 'my_project_db',
    entities: [`${basePath}shared/entities/*{.ts,.js}`],
    migrations: [`${basePath}infra/database/migrations/*{.ts,.js}`],
    subscribers: [],
});