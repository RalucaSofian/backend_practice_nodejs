
/**
 * @file src/models/model_utils.ts
 * @description Contains utils for the model module.
 */


import { AuthUser } from "./auth_model";
import { Client } from "./clients_model";
import { Foster } from "./foster_model";
import { Pet } from "./pets_model";



/**
 * @description Function used to populate the 'filterFields' property of the a model
 */
function populateModelFilterFields(ModelClass: any, modelInstance: any)
{
    if (ModelClass.filterFields.length > 0)
    {
        return;
    }

    for (const field in modelInstance)
    {
        ModelClass.filterFields.push(field);
    }
}


/**
 * @description Function used to populate the 'filterFields' for all models
 */
export function populateModelFields()
{
    console.log("\n -- Populate Model Filter Fields --");

    populateModelFilterFields(AuthUser, new AuthUser().toAuthUserDTO());
    populateModelFilterFields(Pet, new Pet().toPetDTO());
    populateModelFilterFields(Client, new Client().toClientDTO());
    populateModelFilterFields(Foster, new Foster().toFosterDTO());

    console.log("AuthUser filterFields = ", AuthUser.filterFields);
    console.log("Pet      filterFields = ", Pet.filterFields);
    console.log("Client   filterFields = ", Client.filterFields);
    console.log("Foster   filterFields = ", Foster.filterFields);
    console.log("\n")
}
