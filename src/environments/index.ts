import { Environment } from '@stokei/nestjs';
import * as dotenv from 'dotenv';

dotenv.config();

// ---------- ENVIRONMENT ----------
export const NODE_ENV: string = process.env.NODE_ENV || Environment.DEVELOPMENT;
export const IS_PRODUCTION: boolean = NODE_ENV === Environment.PRODUCTION;
export const IS_DEVELOPMENT: boolean = NODE_ENV === Environment.DEVELOPMENT;

// ---------- SERVER ----------
export const SERVER_HOST: string = process.env.HOST || 'localhost';
export const SERVER_PORT: number = +process.env.PORT || 5000;
export const SERVER_URL: string =
  process.env.URL || `http://${SERVER_HOST}:${SERVER_PORT}`;

export const REDIS_HOST: string = process.env.REDIS_HOST || 'localhost';
export const REDIS_PORT = parseInt(process.env.REDIS_PORT) || 80;
export const REDIS_USERNAME: string = process.env.REDIS_USERNAME;
export const REDIS_PASSWORD: string = process.env.REDIS_PASSWORD;

export const DIGITALOCEAN_BUCKET: string = process.env.DIGITALOCEAN_BUCKET;
export const DIGITALOCEAN_KEY: string = process.env.DIGITALOCEAN_KEY;
export const DIGITALOCEAN_SECRET_KEY: string =
  process.env.DIGITALOCEAN_SECRET_KEY;

export const STOKEI_API_BASE_URL: string =
  process.env.STOKEI_API_BASE_URL || 'http://localhost:4000';
