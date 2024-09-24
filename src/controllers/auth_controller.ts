
/**
 * @file src/controllers/auth_controller.ts
 * @description Contains calls to services.
 * Responsible with setting proper HTTP responses.
 */


import { Request, Response } from "express";

import { deleteUser, getAllUsers, getUserById, loginUser, registerUser, updateUser } from "../services/auth_service";
import {
    AuthUser, DeleteUserError, LoginUserError,
    UpdateUserError, UserDoesNotExistError, UserAlreadyExistsError } from "../models/auth_model";
import { parseQueryParams, QueryError } from "../utils/query";



/**
 * @description Handler used for the registration (creation) of an AuthUser
 * @param req express HTTP Request object
 * @param resp express HTTP Response object
 */
export async function registerHandler(req: Request, resp: Response)
{
    try
    {
        const registerUserInput  = req.body;
        const registerUserResult = await registerUser(registerUserInput);
        resp.send(registerUserResult.toAuthUserDTO());

    } catch (error) {
        if (error instanceof UserAlreadyExistsError)
        {
            resp.statusCode = 400;
            resp.send("User Already Exists");
            return;
        }
        else
        {
            resp.statusCode = 500;
            resp.send("Register Failed");
            return;
        }
    }
}


/**
 * @description Handler used for the login of an AuthUser
 * @param req express HTTP Request object
 * @param resp express HTTP Response object
 */
export async function loginHandler(req: Request, resp: Response)
{
    try
    {
        const loginUserInput  = req.body;
        const loginUserResult = await loginUser(loginUserInput);
        resp.send(loginUserResult);

    } catch (error) {
        if (error instanceof LoginUserError)
        {
            resp.statusCode = 401;
            resp.send("Unauthorized");
            return;
        }
        else
        {
            resp.statusCode = 500;
            resp.send("Login Failed");
            return;
        }
    }
}


/**
 * @description Handler used for retrieving a single AuthUser object,
 * based on its ID
 * @param req express HTTP Request object
 * @param resp express HTTP Response object
 */
export async function getUserByIdHandler(req: Request, resp: Response)
{
    try
    {
        const userId           = Number(req.params.user_id);
        const getUsrByIdResult = await getUserById(userId);
        resp.send(getUsrByIdResult.toAuthUserDTO());

    } catch (error) {
        if (error instanceof UserDoesNotExistError)
        {
            resp.statusCode = 404;
            resp.send("Not Found");
            return;
        }
        else
        {
            resp.statusCode = 500;
            resp.send("Get Failed");
            return;
        }
    }
}


/**
 * @description Handler used for retrieving all AuthUser objects or
 * just a part of them, in case the request contains a query
 * @param req express HTTP Request object
 * @param resp express HTTP Response object
 */
export async function getAllUsersHandler(req: Request, resp: Response)
{
    try
    {
        const queryInfo = parseQueryParams(req.query);
        if (queryInfo)
        {
            console.log("[controller] ", queryInfo);
        }

        const getAllUsersResult = await getAllUsers(queryInfo);
        const authUsers         = getAllUsersResult.map((user: AuthUser) => { return user.toAuthUserDTO() });
        resp.send(authUsers);

    } catch (error) {
        if (error instanceof QueryError)
        {
            resp.statusCode = 400;
            resp.send(`Bad Input. Error Code: ${error.errorCode}. Error Message: ${error.errorMessage}`);
            return;
        }
        else
        {
            resp.statusCode = 500;
            resp.send("Get Failed");
            return;
        }
    }
}


/**
 * @description Handler used for updating properties of an AuthUser object,
 * based on its ID
 * @param req express HTTP Request object
 * @param resp express HTTP Response object
 */
export async function updateUserHandler(req: Request, resp: Response)
{
    try
    {
        const updateUserId     = Number(req.params.user_id);
        const updateUserInput  = req.body;
        const updateUserResult = await updateUser(updateUserId, updateUserInput);
        resp.send(updateUserResult.toAuthUserDTO());

    } catch (error) {
        if (error instanceof UserDoesNotExistError)
        {
            resp.statusCode = 404;
            resp.send("Not Found");
            return;
        }
        else if (error instanceof UpdateUserError)
        {
            resp.statusCode = 400;
            resp.send("Update Failed");
            return;
        }
        else
        {
            resp.statusCode = 500;
            resp.send("Update Failed");
            return;
        }
    }
}


/**
 * @description Handler used for deleting an AuthUser object,
 * based on its ID
 * @param req express HTTP Request object
 * @param resp express HTTP Response object
 */
export async function deleteUserHandler(req: Request, resp: Response)
{
    try
    {
        const deleteUserId     = Number(req.params.user_id);
        const deleteUserResult = await deleteUser(deleteUserId);
        resp.send(deleteUserResult);

    } catch (error) {
        if (error instanceof UserDoesNotExistError)
        {
            resp.statusCode = 404;
            resp.send("Not Found");
            return;
        }
        else if (error instanceof DeleteUserError)
        {
            resp.statusCode = 400;
            resp.send("Delete Failed");
            return;
        }
        else
        {
            resp.statusCode = 500;
            resp.send("Delete Failed");
            return;
        }
    }
}
