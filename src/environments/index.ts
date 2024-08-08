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

export const STORAGE_BUCKET: string = process.env.STORAGE_BUCKET;
export const STORAGE_KEY: string = process.env.STORAGE_KEY;
export const STORAGE_SECRET_KEY: string = process.env.STORAGE_SECRET_KEY;
export const STORAGE_ENDPOINT: string = process.env.STORAGE_ENDPOINT;
export const STORAGE_REGION: string = process.env.STORAGE_REGION;
export const STORAGE_FILE_BASE_URL: string = process.env.STORAGE_FILE_BASE_URL;

export const NOTIFY_VIDEO_STATUS_URL: string =
  process.env.NOTIFY_VIDEO_STATUS_URL || 'http://localhost:4000';
