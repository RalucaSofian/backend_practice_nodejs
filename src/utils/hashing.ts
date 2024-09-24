
/**
 * @file src/utils/hashing.ts
 * @description Contains utils for hashing and validating plaintext passwords.
 */


import { hash, compare } from "bcrypt";



/**
 * @description Function used to generate the hashed variant for an input password.
 * @param plainPassword plaintext password
 * @returns the hashed password (string)
 */
export async function generatePasswordHash(plainPassword: string) : Promise<string>
{
    const hashedPassword = await hash(plainPassword, 10);

    return hashedPassword;
}


/**
 * @description Function used to compare the password introduced by the user,
 * with the encrypted one saved in DB.
 * @param loginPassword input password
 * @param databasePassword encrypted password saved in DB
 * @returns true if the passwords match, false otherwise
 */
export async function verifyPasswordHash(loginPassword: string, databasePassword: string): Promise<boolean>
{
    const isPasswordValid = await compare(loginPassword, databasePassword);

    return isPasswordValid;
}
