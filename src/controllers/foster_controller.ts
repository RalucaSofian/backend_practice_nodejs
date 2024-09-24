
/**
 * @file src/controllers/foster_controller.ts
 * @description Contains calls to services.
 * Responsible with setting proper HTTP responses.
 */


import { Request, Response } from "express";
import { createFoster, deleteFoster, getAllFoster, getFosterById, updateFoster } from "../services/foster_service";
import { DeleteFosterError, Foster, FosterDoesNotExistError, UpdateFosterError } from "../models/foster_model";
import { parseQueryParams, QueryError } from "../utils/query";



/**
 * @description Handler used for the creation of a Foster object
 * @param req express HTTP Request object
 * @param resp express HTTP Response object
 */
export async function createFosterHandler(req: Request, resp: Response)
{
    const createFosterInput  = req.body;
    const createFosterResult = await createFoster(createFosterInput);

    resp.send(createFosterResult.toFosterDTO());
}


/**
 * @description Handler used for retrieving a single Foster object,
 * based on its ID
 * @param req express HTTP Request object
 * @param resp express HTTP Response object
 */
export async function getFosterByIdHandler(req: Request, resp: Response)
{
    try
    {
        const fosterId            = Number(req.params.foster_id);
        const getFosterByIdResult = await getFosterById(fosterId);
        resp.send(getFosterByIdResult.toFosterDTO());

    } catch (error) {
        if (error instanceof FosterDoesNotExistError)
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
 * @description Handler used for retrieving all Foster objects,
 * or just a part of them, in case the request contains a query
 * @param req express HTTP Request object
 * @param resp express HTTP Response object
 */
export async function getAllFosterHandler(req: Request, resp: Response)
{
    try
    {
        const queryInfo = parseQueryParams(req.query);
        if (queryInfo)
        {
            console.log("[controller] ", queryInfo);
        }

        const getAllFosterResult = await getAllFoster(queryInfo);
        const foster             = getAllFosterResult.map((foster: Foster) => { return foster.toFosterDTO() });
        resp.send(foster);

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
 * @description Handler used for updating properties of a Foster object,
 * based on its ID
 * @param req express HTTP Request object
 * @param resp express HTTP Response object
 */
export async function updateFosterHandler(req: Request, resp: Response)
{
    try
    {
        const fosterId           = Number(req.params.foster_id);
        const updateFosterInput  = req.body;
        const updateFosterResult = await updateFoster(fosterId, updateFosterInput);
        resp.send(updateFosterResult.toFosterDTO());

    } catch (error) {
        if (error instanceof FosterDoesNotExistError)
        {
            resp.statusCode = 404;
            resp.send("Not Found");
            return;
        }
        else if (error instanceof UpdateFosterError)
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
 * @description Handler used for deleting a Foster object, based on its ID
 * @param req express HTTP Request object
 * @param resp express HTTP Response object
 */
export async function deleteFosterHandler(req: Request, resp: Response)
{
    try
    {
        const fosterId           = Number(req.params.foster_id);
        const deleteFosterResult = await deleteFoster(fosterId);
        resp.send(deleteFosterResult);

    } catch (error) {
        if (error instanceof FosterDoesNotExistError)
        {
            resp.statusCode = 404;
            resp.send("Not Found");
            return;
        }
        else if (error instanceof DeleteFosterError)
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
