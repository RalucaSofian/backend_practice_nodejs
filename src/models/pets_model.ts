
/**
 * @file src/models/pets_model.ts
 * @description Contains the Pet model description.
 */


import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseModelEntity, FieldsOnly } from "../utils/types";
import { Foster } from "./foster_model";



/**
 * @description Pet Entity. Reflects 'pets' Data Base table
 */
@Entity("pets")
export class Pet extends BaseModelEntity
{
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name!: string;

    @Column()
    species?: string;

    @Column()
    gender?: string;

    @Column()
    age?: number;

    @Column()
    description?: string;

    @Column({type: 'tsvector'})
    search_vector!: string;

    @OneToMany(
        () => Foster,
        (foster: Foster) => foster.pet
    )
    foster_instances?: Foster[];

    static filterFields: string[] = [];

    toPetDTO() : PetDTO
    {
        return {
            id: this.id,
            name: this.name,
            species: this.species,
            gender: this.gender,
            age: this.age,
            description: this.description
        };
    }
};


/**
 * @description Pet Data Transfer Object
 */
export type PetDTO = Omit<FieldsOnly<Pet>, 'search_vector'>;


/**
 * @description Create Pet Input Data Transfer Obj
 */
export type CreatePetInputDTO = Omit<PetDTO, 'id'>;


/**
 * @description Update Pet Input Data Transfer Obj
 */
export type UpdatePetInputDTO = Partial<Omit<PetDTO, 'id'>>;


/**
 * @description Pet Does Not Exist Error
 */
export class PetDoesNotExistError extends Error {};


/**
 * @description Update Pet Error
 */
export class UpdatePetError extends Error {};


/**
 * @description Delete Pet Error
 */
export class DeletePetError extends Error {};
