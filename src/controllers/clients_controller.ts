
/**
 * @file src/controllers/clients_controller.ts
 * @description Contains calls to services.
 * Responsible with setting proper HTTP responses.
 */


import { Request, Response } from "express";
import { createClient, deleteClient, getAllClients, getClientById, updateClient } from "../services/clients_service";
import { Client, ClientDoesNotExistError, DeleteClientError, UpdateClientError } from "../models/clients_model";
import { parseQueryParams, QueryError } from "../utils/query";



/**
 * @description Handler used for the creation of a Client object
 * @param req express HTTP Request object
 * @param resp express HTTP Response object
 */
export async function createClientHandler(req: Request, resp: Response)
{
    const createClientInput  = req.body;
    const createClientResult = await createClient(createClientInput);

    resp.send(createClientResult.toClientDTO());
}


/**
 * @description Handler used for retrieving a single Client object,
 * based on its ID
 * @param req express HTTP Request object
 * @param resp express HTTP Response object
 */
export async function getClientByIdHandler(req: Request, resp: Response)
{
    try
    {
        const clientId            = Number(req.params.client_id);
        const getClientByIdResult = await getClientById(clientId);
        resp.send(getClientByIdResult.toClientDTO());

    } catch (error) {
        if (error instanceof ClientDoesNotExistError)
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
 * @description Handler used for retrieving all Client objects or
 * just a part of them, in case the request contains a query
 * @param req express HTTP Request object
 * @param resp express HTTP Response object
 */
export async function getAllClientsHandler(req: Request, resp: Response)
{
    try
    {
        const queryInfo = parseQueryParams(req.query);
        if (queryInfo)
        {
            console.log("[controller] ", queryInfo);
        }

        const getAllClientsResult = await getAllClients(queryInfo);
        const clients             = getAllClientsResult.map((client: Client) => { return client.toClientDTO() });
        resp.send(clients);

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
 * @description Handler used for updating properties of a Client object,
 * based on its ID
 * @param req express HTTP Request object
 * @param resp express HTTP Response object
 */
export async function updateClientHandler(req: Request, resp: Response)
{
    try
    {
        const clientId           = Number(req.params.client_id);
        const updateClientInput  = req.body;
        const updateClientResult = await updateClient(clientId, updateClientInput);
        resp.send(updateClientResult.toClientDTO());

    } catch (error) {
        if (error instanceof ClientDoesNotExistError)
        {
            resp.statusCode = 404;
            resp.send("Not Found");
            return;
        }
        else if (error instanceof UpdateClientError)
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
 * @description Handler used for deleting a Client object, based on its ID
 * @param req express HTTP Request object
 * @param resp express HTTP Response object
 */
export async function deleteClientHandler(req: Request, resp: Response)
{
    try
    {
        const clientId           = Number(req.params.client_id);
        const deleteClientResult = await deleteClient(clientId);
        resp.send(deleteClientResult);

    } catch (error) {
        if (error instanceof ClientDoesNotExistError)
        {
            resp.statusCode = 404;
            resp.send("Not Found");
            return;
        }
        else if (error instanceof DeleteClientError)
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
