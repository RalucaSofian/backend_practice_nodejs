
/**
 * @file src/services/auth_service.ts
 * @description Contains calls to DB.
 * Responsible with validating inputs and outputs.
 */


import { AppDataSource } from "../data-source";

import {
    AuthUser, DeleteUserError, LoginInputDTO, LoginResponseDTO,
    LoginUserError, RegisterInputDTO, UpdateUserInputDTO,
    UpdateUserError, UserDoesNotExistError, UserAlreadyExistsError } from "../../src/models/auth_model";
import { generatePasswordHash, verifyPasswordHash } from "../utils/hashing";
import { createAccessToken } from "../utils/jwt";
import { QueryError, QueryInfo } from "../utils/query";
import { getFindOptions } from "./service_utils";
import { createClient } from "./clients_service";



/**
 * @description Create an Auth User and save it in the DB.
 * Also create a Client DB object for the current Auth User
 * @param registerInput DTO
 * @returns an Auth User object
 */
export async function registerUser(registerInput: RegisterInputDTO) : Promise<AuthUser>
{
    const checkUserExists = await AppDataSource.getRepository(AuthUser).findOneBy({email : registerInput.email});
    if (checkUserExists)
    {
        throw new UserAlreadyExistsError();
    }

    const hashedPassword   = await generatePasswordHash(registerInput.password);
    registerInput.password = hashedPassword;

    const authUser           = await AppDataSource.getRepository(AuthUser).create(registerInput);
    const registerUserResult = await AppDataSource.getRepository(AuthUser).save(authUser);

    // also create a Client object for the current User
    const newClientInput = {
        user: authUser,
        description: `${authUser.name} (${authUser.phone})`
    };
    const newClientResult = await createClient(newClientInput);
    console.log("[service] Created Client object for current Auth User. Result = ", newClientResult);

    return registerUserResult;
}


/**
 * @description Login an Auth User
 * @param loginInput DTO
 * @returns a login token (JWT) on success
 */
export async function loginUser(loginInput: LoginInputDTO) : Promise<LoginResponseDTO>
{
    const authUser = await AppDataSource.getRepository(AuthUser).findOneBy({email : loginInput.email});
    var isPasswordValid = false;
    if (null !== authUser)
    {
        isPasswordValid = await verifyPasswordHash(loginInput.password, authUser.password);
        if (true === isPasswordValid)
        {
            const token = await createAccessToken({email: loginInput.email});
            if ("" !== token)
            {
                return {loginToken: token};
            }
            else
            {
                throw new LoginUserError();
            }
        }
        else
        {
            throw new LoginUserError();
        }
    }
    else
    {
        throw new LoginUserError();
    }
}


/**
 * @description Get a single Auth User object from the DB, based on its ID
 * @param userId ID (as number) of the Auth User object
 * @returns an Auth User object on success
 */
export async function getUserById(userId: number) : Promise<AuthUser>
{
    const authUser = await AppDataSource.getRepository(AuthUser).findOneBy({id: userId});
    if (null === authUser)
    {
        throw new UserDoesNotExistError();
    }

    return authUser;
}


/**
   @description Get all Auth User objects from the DB. This call also supports queries
 * @param queryInfo Query Info object
 * @returns an array of Auth User objects
 */
export async function getAllUsers(queryInfo: QueryInfo = {}) : Promise<AuthUser[]>
{
    const filtersValid = AuthUser.validQueryFilters(queryInfo);
    if (false === filtersValid)
    {
        throw new QueryError({errorCode: "InvalidFilterField", errorMessage: "Filter Field does not belong to Entity"});
    }

    const usersRepo   = await AppDataSource.getRepository(AuthUser);
    const findOptions = getFindOptions<AuthUser>(queryInfo);
    const users       = await usersRepo.find(findOptions);

    return users;
}


/**
 * @description Update an Auth User object's properties in the DB, based on its ID
 * @param userId ID of the object that needs to be updated
 * @param updateUserInput properties of the object that need to be updated
 * @returns an updated Auth User object on success
 */
export async function updateUser(userId: number, updateUserInput: UpdateUserInputDTO) : Promise<AuthUser>
{
    const existingUser = await AppDataSource.getRepository(AuthUser).findOneBy({id: userId});
    if (null === existingUser)
    {
        throw new UserDoesNotExistError();
    }
    else
    {
        // merge into existing entity
        AppDataSource.getRepository(AuthUser).merge(existingUser, updateUserInput);
        const authUser = await AppDataSource.getRepository(AuthUser).save(existingUser);
        if (null === authUser)
        {
            throw new UpdateUserError();
        }
        else
        {
            return authUser;
        }
    }
}


/**
 * @description Delete an Auth User object from the DB, based on its ID
 * @param userId ID of the object that needs to be deleted
 * @returns a message (string) on success
 */
export async function deleteUser(userId: number) : Promise<string>
{
    const existingUser = await AppDataSource.getRepository(AuthUser).findOneBy({id: userId});
    if (null === existingUser)
    {
        throw new UserDoesNotExistError();
    }
    else
    {
        const deleteResult = await AppDataSource.getRepository(AuthUser).delete(userId);
        if (null === deleteResult)
        {
            throw new DeleteUserError();
        }
        else
        {
            return "Delete Success";
        }
    }
}
