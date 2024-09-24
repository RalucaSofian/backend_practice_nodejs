
/**
 * @file src/utils/types.ts
 * @description Contains custom data types.
 */


import { QueryInfo } from "./query";



/**
 * @description Custom data type that extracts only the Fields of a Type
 * (excludes functions)
 */
export type FieldsOnly<Type> =
{
    // the sub-set of keys in Type, which are not functions
    [Key in keyof Type as Type[Key] extends Function ? never : Key] : Type[Key]
};


/**
 * @description Custom Error type, with customizable Error Code and Error Message
 */
export class CustomError extends Error
{
    errorCode: string | undefined;
    errorMessage: string | undefined;

    constructor(errorInfo: Partial<CustomError>)
    {
        super(errorInfo.errorMessage);
        this.errorCode = errorInfo.errorCode;
        this.errorMessage = errorInfo.errorMessage;
    }
};


/**
 * @description Custom Base Entity, with functionality for validating the filter fields of a query
 */
export class BaseModelEntity
{
    static filterFields: string[] = [];

    static validQueryFilters(queryInfo: QueryInfo) : boolean
    {
        if ((queryInfo.filters) && (queryInfo.filters.length > 0))
        {
            for (const queryFilter of queryInfo.filters)
            {
                if (!this.filterFields.includes(queryFilter.field))
                {
                    return false;
                }
            }
        }
        return true;
    }
};
