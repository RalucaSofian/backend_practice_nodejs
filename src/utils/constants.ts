
/**
 * @file src/utils/constants.ts
 * @description Contains constants extracted from environment variables
 */


import dotenv from "dotenv";



dotenv.config();


export const SERV_PORT   = process.env.LISTEN_PORT;
export const DB_HOST     = process.env.DB_HOSTNAME;
export const DB_PORT     = process.env.DB_PORT;
export const DB_USER     = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_NAME     = process.env.DB_NAME;

export const SECRET_KEY = process.env.SECRET_KEY;
export const ALGORITHM  = "HS256";
export const ACCESS_TOKEN_EXPIRES_MINUTES = 120;
