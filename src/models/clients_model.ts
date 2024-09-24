
/**
 * @file src/models/clients_model.ts
 * @description Contains the Client model description.
 */


import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AuthUser, AuthUserDTO } from "./auth_model";
import { BaseModelEntity, FieldsOnly } from "../utils/types";



/**
 * @description Client Entity. Reflects 'clients' Data Base table
 */
@Entity("clients")
export class Client extends BaseModelEntity
{
    @PrimaryGeneratedColumn()
    id?: number;

    @OneToOne(() => AuthUser)
    @JoinColumn({name: "user_id"})
    user?: AuthUser;
    @Column()
    user_id?: number;

    @Column()
    description?: string;

    @Column({type: 'tsvector'})
    search_vector!: string;

    static filterFields: string[] = [];

    toClientDTO() : ClientDTO
    {
        return {
            id: this.id,
            user: this.user?.toAuthUserDTO(),
            description: this.description
        };
    }
}


/**
 * @description Client Data Transfer Object
 */
export type ClientDTO = Omit<FieldsOnly<Client>, 'search_vector' | 'user_id'| 'user'> & {user?: AuthUserDTO};


/**
 * @description Create Client Input Data Transfer Obj
 */
export type CreateClientInputDTO = Partial<Omit<ClientDTO, 'id'>>;


/**
 * @description Update Client Input Data Transfer Obj
 */
export type UpdateClientInputDTO = Partial<Omit<ClientDTO, 'id'>>;


/**
 * @description Client Does Not Exist Error
 */
export class ClientDoesNotExistError extends Error {};


/**
 * @description Update Client Error
 */
export class UpdateClientError extends Error {};


/**
 * @description Delete Client Error
 */
export class DeleteClientError extends Error {};
