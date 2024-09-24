
/**
 * @file src/services/pets_service.ts
 * @description Contains calls to DB.
 * Responsible with validating inputs and outputs.
 */


import { AppDataSource } from "../data-source";

import {
    CreatePetInputDTO, DeletePetError, Pet,
    PetDoesNotExistError, UpdatePetError, UpdatePetInputDTO } from "../models/pets_model";
import { QueryError, QueryInfo } from "../utils/query";
import { getFindOptions } from "./service_utils";



/**
 * @description Create a Pet object and save it in the DB
 * @param createPetInput DTO
 * @returns a Pet object
 */
export async function createPet(createPetInput: CreatePetInputDTO) : Promise<Pet>
{
    const newPet          = await AppDataSource.getRepository(Pet).create(createPetInput);
    const createPetResult = await AppDataSource.getRepository(Pet).save(newPet);

    return createPetResult;
}


/**
 * @description Get a single Pet object from the DB, based on its ID
 * @param petId ID (as number) of the Pet object
 * @returns a Pet object on success
 */
export async function getPetById(petId: number) : Promise<Pet>
{
    const pet = await AppDataSource.getRepository(Pet).findOneBy({id: petId});
    if (null === pet)
    {
        throw new PetDoesNotExistError();
    }

    return pet;
}


/**
   @description Get all Pet objects from the DB. This call also supports queries
 * @param queryInfo Query Info object
 * @returns an array of Pet objects
 */
export async function getAllPets(queryInfo: QueryInfo = {}) : Promise<Pet[]>
{
    const filtersValid = Pet.validQueryFilters(queryInfo);
    if (false === filtersValid)
    {
        throw new QueryError({errorCode: "InvalidFilterField", errorMessage: "Filter Field does not belong to Entity"});
    }

    const petsRepo    = await AppDataSource.getRepository(Pet);
    const findOptions = getFindOptions<Pet>(queryInfo);
    const pets        = await petsRepo.find(findOptions);

    return pets;
}

/**
 * @description Update a Pet object's properties in the DB, based on its ID
 * @param petId ID of the object that needs to be updated
 * @param updatePetInput properties of the object that need to be updated
 * @returns an updated Pet object on success
 */
export async function updatePet(petId: number, updatePetInput: UpdatePetInputDTO) : Promise<Pet>
{
    const existingPet = await AppDataSource.getRepository(Pet).findOneBy({id: petId});
    if (null === existingPet)
    {
        throw new PetDoesNotExistError();
    }
    else
    {
        // merge into existing entity
        AppDataSource.getRepository(Pet).merge(existingPet, updatePetInput);
        const updatedPet = await AppDataSource.getRepository(Pet).save(existingPet);
        if (null === updatedPet)
        {
            throw new UpdatePetError();
        }
        else
        {
            return updatedPet;
        }
    }
}

/**
 * @description Delete a Pet object from the DB, based on its ID
 * @param petId ID of the object that needs to be deleted
 * @returns a message (string) on success
 */
export async function deletePet(petId: number) : Promise<string>
{
    const existingPet = await AppDataSource.getRepository(Pet).findOneBy({id: petId});
    if (null === existingPet)
    {
        throw new PetDoesNotExistError();
    }
    else
    {
        const deleteResult = AppDataSource.getRepository(Pet).delete(petId);
        if (null === deleteResult)
        {
            throw new DeletePetError();
        }
        else
        {
            return "Delete Success";
        }
    }
}
