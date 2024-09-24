
/**
 * @file src/controllers/pets_controller.ts
 * @description Contains calls to services.
 * Responsible with setting proper HTTP responses
 */


import { Request, Response } from "express";

import { createPet, deletePet, getAllPets, getPetById, updatePet } from "../services/pets_service";
import { DeletePetError, Pet, PetDoesNotExistError, UpdatePetError } from "../models/pets_model";
import { parseQueryParams, QueryError } from "../utils/query";



/**
 * @description Handler used for the creation of a Pet object
 * @param req express HTTP Request object
 * @param resp express HTTP Response object
 */
export async function createPetHandler(req: Request, resp: Response)
{
    const createPetInput  = req.body;
    const createPetResult = await createPet(createPetInput);

    resp.send(createPetResult.toPetDTO());
}


/**
 * @description Handler used for retrieving a single Pet object,
 * based on its ID
 * @param req express HTTP Request object
 * @param resp express HTTP Response object
 */
export async function getPetByIdHandler(req: Request, resp: Response)
{
    try
    {
        const petId            = Number(req.params.pet_id);
        const getPetByIdResult = await getPetById(petId);
        resp.send(getPetByIdResult.toPetDTO());

    } catch (error) {
        if (error instanceof PetDoesNotExistError)
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
 * @description Handler used for retrieving all Pet objects,
 * or just a part of them, in case the request contains a query
 * @param req express HTTP Request object
 * @param resp express HTTP Response object
 */
export async function getAllPetsHandler(req: Request, resp: Response)
{
    try
    {
        const queryInfo = parseQueryParams(req.query);
        if (queryInfo)
        {
            console.log("[controller] ", queryInfo);
        }

        const getAllPetsResult = await getAllPets(queryInfo);
        const pets             = getAllPetsResult.map((pet: Pet) => { return pet.toPetDTO() });
        resp.send(pets);

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
 * @description Handler used for updating properties of a Pet object,
 * based on its ID
 * @param req express HTTP Request object
 * @param resp express HTTP Response object
 */
export async function updatePetHandler(req: Request, resp: Response)
{
    try
    {
        const petId           = Number(req.params.pet_id);
        const updatePetInput  = req.body;
        const updatePetResult = await updatePet(petId, updatePetInput);
        resp.send(updatePetResult.toPetDTO());

    } catch (error) {
        if (error instanceof PetDoesNotExistError)
        {
            resp.statusCode = 404;
            resp.send("Not Found");
            return;
        }
        else if (error instanceof UpdatePetError)
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
 * @description Handler used for deleting a Pet object,
 * based on its ID
 * @param req express HTTP Request object
 * @param resp express HTTP Response object
 */
export async function deletePetHandler(req: Request, resp: Response)
{
    try
    {
        const petId           = Number(req.params.pet_id);
        const deletePetResult = await deletePet(petId);
        resp.send(deletePetResult);

    } catch (error) {
        if (error instanceof PetDoesNotExistError)
        {
            resp.statusCode = 404;
            resp.send("Not Found");
            return;
        }
        else if (error instanceof DeletePetError)
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
