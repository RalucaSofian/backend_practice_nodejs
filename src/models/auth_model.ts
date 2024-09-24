
/**
 * @file src/models/auth_model.ts
 * @description Contains the Auth User model description.
 */


import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { BaseModelEntity, FieldsOnly } from "../utils/types";



/**
 * @description Auth User Entity. Reflects 'auth_users' Data Base table
 */
@Entity("auth_users")
export class AuthUser extends BaseModelEntity
{
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    email!: string;

    @Column()
    password!: string;

    @Column()
    name?: string;

    @Column()
    address?: string;

    @Column()
    phone?: string;

    @Column({type: 'tsvector'})
    search_vector!: string;

    static filterFields: string[] = [];

    toAuthUserDTO() : AuthUserDTO
    {
        return {
            id: this.id,
            email: this.email,
            name: this.name,
            address: this.address,
            phone: this.phone
        };
    }
};


/**
 * @description Auth User Data Transfer Object
 */
export type AuthUserDTO = Omit<FieldsOnly<AuthUser>, 'password' | 'search_vector'>;


/**
 * @description Register Input Data Transfer Object
 */
export type RegisterInputDTO = Omit<FieldsOnly<AuthUser>, 'id' | 'search_vector'>;


/**
 * @description Login Input Data Transfer Object
 */
export type LoginInputDTO = Pick<AuthUser, 'email' | 'password'>;


/**
 * @description Login Response Data Transfer Object
 */
export type LoginResponseDTO =
{
    loginToken: string;
};


/**
 * @description Update User Input Data Transfer Object
 */
export type UpdateUserInputDTO = Partial<Omit<AuthUserDTO, 'id'>>;


/**
 * @description Login User Error
 */
export class LoginUserError extends Error {};


/**
 * @description User Already Exists Error
 */
export class UserAlreadyExistsError extends Error {};


/**
 * @description User Does Not Exist Error
 */
export class UserDoesNotExistError extends Error {};


/**
 * @description Update User Error
 */
export class UpdateUserError extends Error {};


/**
 * @description Delete User Error
 */
export class DeleteUserError extends Error {};
