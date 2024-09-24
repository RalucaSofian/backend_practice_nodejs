
/**
 * @file src/services/foster_service.ts
 * @description Contains calls to DB.
 * Responsible with validating inputs and outputs.
 */


import { AppDataSource } from "../data-source";

import {
    CreateFosterInputDTO, DeleteFosterError, Foster,
    FosterDoesNotExistError, UpdateFosterError, UpdateFosterInputDTO } from "../models/foster_model";
import { QueryError, QueryInfo } from "../utils/query";
import { getFindOptions } from "./service_utils";



/**
 * @description Create a Foster object and save it in the DB
 * @param createFosterInput DTO
 * @returns a Foster object
 */
export async function createFoster(createFosterInput: CreateFosterInputDTO) : Promise<Foster>
{
    const newFoster          = await AppDataSource.getRepository(Foster).create(createFosterInput);
    const createFosterResult = await AppDataSource.getRepository(Foster).save(newFoster);

    return createFosterResult;
}


/**
 * @description Get a single Foster object from the DB, based on its ID
 * @param fosterId ID (as number) of the Foster object
 * @returns a Foster object on success
 */
export async function getFosterById(fosterId: number) : Promise<Foster>
{
    const foster = await AppDataSource.getRepository(Foster).findOne({
        where: {id: fosterId},
        relations: ['user', 'pet']
    });

    if (null === foster)
    {
        throw new FosterDoesNotExistError();
    }

    return foster;
}


/**
 * @description Get all Foster objects from the DB. This call also supports queries
 * @param queryInfo Query Info object
 * @returns an array of Foster objects
 */
export async function getAllFoster(queryInfo: QueryInfo = {}) : Promise<Foster[]>
{
    const filtersValid = Foster.validQueryFilters(queryInfo);
    if (false === filtersValid)
    {
        throw new QueryError({errorCode: "InvalidFilterField", errorMessage: "Filter Field does not belong to Entity"});
    }

    const fosterRepo      = await AppDataSource.getRepository(Foster);
    const findOptions     = getFindOptions<Foster>(queryInfo);
    findOptions.relations = ['user', 'pet'];

    const foster = await fosterRepo.find(findOptions);

    return foster;
}


/**
 * @description Update a Foster object's properties in the DB, based on its ID
 * @param fosterId ID of the object that needs to be updated
 * @param updateFosterInput properties of the object that need to be updated
 * @returns an updated Foster object on success
 */
export async function updateFoster(fosterId: number, updateFosterInput: UpdateFosterInputDTO) : Promise<Foster>
{
    const existingFoster = await AppDataSource.getRepository(Foster).findOneBy({id: fosterId});
    if (null === existingFoster)
    {
        throw new FosterDoesNotExistError();
    }
    else
    {
        // merge into existing entity
        AppDataSource.getRepository(Foster).merge(existingFoster, updateFosterInput);
        const updatedFoster = await AppDataSource.getRepository(Foster).save(existingFoster);
        if (null === updatedFoster)
        {
            throw new UpdateFosterError();
        }
        else
        {
            const updatedFoster = await AppDataSource.getRepository(Foster).findOne({
                where: {id: fosterId},
                relations: ['user', 'pet']
            });
            return updatedFoster as Foster;
        }
    }
}


/**
 * @description Delete a Foster object from the DB, based on its ID
 * @param fosterId ID of the object that needs to be deleted
 * @returns a message (string) on success
 */
export async function deleteFoster(fosterId: number) : Promise<string>
{
    const existingFoster = await AppDataSource.getRepository(Foster).findOneBy({id: fosterId});
    if (null === existingFoster)
    {
        throw new FosterDoesNotExistError();
    }
    else
    {
        const deleteResult = AppDataSource.getRepository(Foster).delete(fosterId);
        if (null === deleteResult)
        {
            throw new DeleteFosterError();
        }
        else
        {
            return "Delete Success";
        }
    }
}
