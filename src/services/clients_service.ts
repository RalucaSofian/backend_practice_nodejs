
/**
 * @file src/services/clients_service.ts
 * @description Contains calls to DB.
 * Responsible with validating inputs and outputs.
 */


import { AppDataSource } from "../data-source";

import {
    Client, ClientDoesNotExistError, CreateClientInputDTO,
    DeleteClientError, UpdateClientError, UpdateClientInputDTO } from "../models/clients_model";
import { QueryError, QueryInfo } from "../utils/query";
import { getFindOptions } from "./service_utils";



/**
 * @description Create a Client object and save it in the DB
 * @param createClientInput DTO
 * @returns a Client Object
 */
export async function createClient(createClientInput: CreateClientInputDTO) : Promise<Client>
{
    const newClient          = await AppDataSource.getRepository(Client).create(createClientInput);
    const createClientResult = await AppDataSource.getRepository(Client).save(newClient);

    return createClientResult;
}


/**
 * @description Get a single Client object from the DB, based on its ID
 * @param clientId ID (as number) of the Client object
 * @returns a Client object on success
 */
export async function getClientById(clientId: number) : Promise<Client>
{
    const client = await AppDataSource.getRepository(Client).findOne({
        where: {id: clientId},
        relations: ['user']
    });

    if (null === client)
    {
        throw new ClientDoesNotExistError();
    }

    return client;
}


/**
 * @description Get all Client objects from the DB. This call also supports queries
 * @param queryInfo Query Info object
 * @returns an array of Client objects
 */
export async function getAllClients(queryInfo: QueryInfo = {}) : Promise<Client[]>
{
    const filtersValid = Client.validQueryFilters(queryInfo);
    if (false === filtersValid)
    {
        throw new QueryError({errorCode: "InvalidFilterField", errorMessage: "Filter Field does not belong to Entity"});
    }

    const clientsRepo     = await AppDataSource.getRepository(Client);
    const findOptions     = getFindOptions<Client>(queryInfo);
    findOptions.relations = ['user'];

    const clients = await clientsRepo.find(findOptions);

    return clients;
}


/**
 * @description Update a Client object's properties in the DB, based on its ID
 * @param clientId ID of the object that needs to be updated
 * @param updateClientInput properties of the object that need to be updated
 * @returns an updated Client object on success
 */
export async function updateClient(clientId: number, updateClientInput: UpdateClientInputDTO) : Promise<Client>
{
    const existingClient = await AppDataSource.getRepository(Client).findOneBy({id: clientId});
    if (null === existingClient)
    {
        throw new ClientDoesNotExistError();
    }
    else
    {
        // merge into existing entity
        AppDataSource.getRepository(Client).merge(existingClient, updateClientInput);
        const updatedClient = await AppDataSource.getRepository(Client).save(existingClient);
        if (null === updatedClient)
        {
            throw new UpdateClientError();
        }
        else
        {
            const updatedClient = await AppDataSource.getRepository(Client).findOne({
                where: {id: clientId},
                relations: ['user']
            });
            return updatedClient as Client;
        }
    }
}


/**
 * @description Delete a Client object from the DB, based on its ID
 * @param clientId ID of the object that needs to be deleted
 * @returns a message (string) on success
 */
export async function deleteClient(clientId: number) : Promise<string>
{
    const existingClient = await AppDataSource.getRepository(Client).findOneBy({id: clientId});
    if (null === existingClient)
    {
        throw new ClientDoesNotExistError();
    }
    else
    {
        const deleteResult = AppDataSource.getRepository(Client).delete(clientId);
        if (null === deleteResult)
        {
            throw new DeleteClientError();
        }
        else
        {
            return "Delete Success";
        }
    }
}
