
/**
 * @file src/utils/jwt.ts
 * @description Contains utils for creating and verifying Json Web Tokens.
 */


import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRES_MINUTES } from "./constants";
import { CustomError } from "./types";



/**
 * @description Token Already Expired Error
 */
export class TokenAlreadyExpiredError extends CustomError {};


/**
 * @description Json Web Token Error
 */
export class JWTError extends CustomError {};


/**
 * @description Util function used for creating a JWT based on an user's information and a secret key.
 * @param dataToEncode user information given as payload to the JWT signing (creation) operation
 * @param expiresMinutes validity duration for the access token (expressed in minutes)
 * @returns an access token (string)
 */
export async function createAccessToken(dataToEncode: object, expiresMinutes: number = ACCESS_TOKEN_EXPIRES_MINUTES) : Promise<string>
{
    if (!SECRET_KEY)
    {
        return "";
    }

    const token = jwt.sign(dataToEncode, SECRET_KEY, {expiresIn: expiresMinutes*60, algorithm: ALGORITHM});

    return token;
}


/**
 * @description Util function used for the verification of a JWT.
 * @param token JWT that needs to be verified
 * @returns result (true/false) of the token verification operation
 */
export async function validAccessToken(token: string) : Promise<boolean>
{
    if (!SECRET_KEY)
    {
        return false;
    }

    try
    {
        const decodedToken = jwt.verify(token, SECRET_KEY, {algorithms: [ALGORITHM]});
        return (decodedToken !== null);

    } catch (error) {
        if (error instanceof TokenExpiredError)
        {
            throw new TokenAlreadyExpiredError({errorCode: error.name, errorMessage: error.message});
        }
        else if (error instanceof JsonWebTokenError)
        {
            throw new JWTError({errorCode: error.name, errorMessage: error.message});
        }
        else
        {
            return false;
        }
    }
}
