
/**
 * @file src/models/foster_model.ts
 * @description Contains the Foster model description.
 */

import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseModelEntity, FieldsOnly } from "../utils/types";
import { AuthUser, AuthUserDTO } from "./auth_model";
import { Pet, PetDTO } from "./pets_model";



/**
 * @description Foster Entity. Reflects 'foster' Data Base table
 */
@Entity("foster")
export class Foster extends BaseModelEntity
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

    @ManyToOne(() => Pet)
    @JoinColumn({name: "pet_id"})
    pet!: Pet;
    @Column()
    pet_id!: number;

    @Column({type: 'date'})
    start_date!: Date;

    @Column({type: 'date'})
    end_date?: Date;

    @Column({type: 'tsvector'})
    search_vector!: string;

    static filterFields: string[] = [];

    toFosterDTO() : FosterDTO
    {
        return {
            id: this.id,
            user: this.user?.toAuthUserDTO(),
            description: this.description,
            pet: this.pet?.toPetDTO(),
            start_date: this.start_date,
            end_date: this.end_date
        };
    }
};


/**
 * @description Foster Data Transfer Object
 */
export type FosterDTO = Omit<FieldsOnly<Foster>, 'search_vector' | 'user_id'| 'user' | 'pet_id' | 'pet'> & {user?: AuthUserDTO} & {pet?: PetDTO};


/**
 * @description Create Foster Input Data Transfer Obj
 */
export type CreateFosterInputDTO = Pick<Foster, 'pet_id' | 'start_date'>;


/**
 * @description Update Foster Input Data Transfer Obj
 */
export type UpdateFosterInputDTO = Partial<Omit<FosterDTO, 'id'>>;


/**
 * @description Client Does Not Exist Error
 */
export class FosterDoesNotExistError extends Error {};


/**
 * @description Update Foster Error
 */
export class UpdateFosterError extends Error {};


/**
 * @description Delete Foster Error
 */
export class DeleteFosterError extends Error {};
