import 'reflect-metadata'
import dotenv from 'dotenv'
import { DataSource } from 'typeorm'

dotenv.config()

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,       // use DB_USER, not DB_USERNAME
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  ssl: { rejectUnauthorized: false },  // required for Supabase

  synchronize: true,                   // only dev
  logging: false,
  entities: ['src/entities/**/*.ts'], // better path
  migrations: [],
  subscribers: [],
})
