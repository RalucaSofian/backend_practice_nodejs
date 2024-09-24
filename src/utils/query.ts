
/**
 * @file src/utils/query.ts
 * @description Contains utils for creating and verifying Json Web Tokens.
 */


/**
 * @example
 * Details on query options:
 * - search: e.g.: search=term
 * - order: e.g.: order=field__asc OR order=field (implicit ascending)
 * - limit and offset: e.g.: limit=number ; offset=number
 * - filter: e.g.: field__operation=value (field__lte=value ; field_in=val1,val2 ; field__is_null=true)
 */


import { CustomError } from "./types";



/**
 * @description Query Error
 */
export class QueryError extends CustomError {};


/**
 * @description Filter Operations
 */
export enum FilterOperation
{
    EQ      = "EQ",
    IS_NULL = "IS_NULL",
    IN      = "IN",
    NOT_IN  = "NOT_IN",
    GT      = "GT",
    GTE     = "GTE",
    LT      = "LT",
    LTE     = "LTE"
};


/**
 * @description Function used to convert a string (from a query) into a FilterOperation
 * @param strFilterOp string that needs to be converted
 * @returns a FilterOperation
 */
function strToFilterOp(strFilterOp: string) : FilterOperation
{
    const lowerCase = strFilterOp.toLowerCase();
    switch(lowerCase)
    {
        case "eq":
            return FilterOperation.EQ;
        case "is_null":
            return FilterOperation.IS_NULL;
        case "in":
            return FilterOperation.IN;
        case "not_in":
            return FilterOperation.NOT_IN;
        case "gt":
            return FilterOperation.GT;
        case "gte":
            return FilterOperation.GTE;
        case "lt":
            return FilterOperation.LT;
        case "lte":
            return FilterOperation.LTE;
        default:
            return FilterOperation.EQ;
    }
}


/**
 * @description Filter Information
 */
type FilterInfo =
{
    field: string;
    operation: FilterOperation;
    value: any;
};


/**
 * @description Order Direction (ASC/DESC)
 */
enum OrderDirection
{
    ASC = "ASC",
    DESC = "DESC"
};


/**
 * @description Order Information
 */
type OrderInfo =
{
    field: string;
    direction: OrderDirection;
};


/**
 * @description Function used to convert a string (from a query) into an OrderDirection
 * @param strOrder string that needs to be converted
 * @returns an OrderDirection
 */
function strToOrderDir(strOrder: string) : OrderDirection
{
    const lowerCase = strOrder.toLowerCase();
    switch(lowerCase)
    {
        case "asc":
            return OrderDirection.ASC;
        case "desc":
        case "dsc":
            return OrderDirection.DESC;
        default:
            return OrderDirection.ASC;
    }
}


/**
 * @description Query Information
 */
export type QueryInfo =
{
    search?: string;
    filters?: FilterInfo[];
    order?: OrderInfo;
    limit?: number;
    offset?: number;
};


/**
 * @description Parse the query string from a HTTP request
 * @param queryObj query string
 * @returns a Query Info object
 */
export function parseQueryParams(queryObj: qs.ParsedQs) : QueryInfo
{
    const queryInfo: QueryInfo = {filters: []};

    for (const key in queryObj)
    {
        const value = String(queryObj[key]);

        if ("search" === key)
        {
            queryInfo.search = value;
        }
        else if ("limit" === key)
        {
            queryInfo.limit = Number(value);
        }
        else if ("offset" === key)
        {
            queryInfo.offset = Number(value);
        }
        else if ("order" === key)
        {
            const fieldAndDirection = value.split("__");
            if (fieldAndDirection.length > 2)
            {
                throw new QueryError({errorCode: "InvalidOrderQuery", errorMessage: "Too many arguments"});
            }

            const field     = fieldAndDirection[0];
            const direction = fieldAndDirection[1];
            if (!direction)
            {
                queryInfo.order = {field: field, direction: OrderDirection.ASC};
            }
            else
            {
                queryInfo.order = {field: field, direction: strToOrderDir(direction)};
            }
        }
        else // filters
        {
            const fieldAndOperation = key.split("__");
            if (fieldAndOperation.length > 2)
            {
                throw new QueryError({errorCode: "InvalidFilterQuery", errorMessage: "Too many arguments"});
            }

            const field     = fieldAndOperation[0];
            const operation = fieldAndOperation[1];
            if (!operation)
            {
                queryInfo.filters?.push({field: field, operation: FilterOperation.EQ, value: value});
            }
            else
            {
                const filterOp = strToFilterOp(operation);
                if (FilterOperation.IS_NULL === filterOp)
                {
                    if ("true" === value.toLowerCase())
                    {
                        queryInfo.filters?.push({field: field, operation: filterOp, value: true});
                    }
                    else if ("false" === value.toLowerCase())
                    {
                        queryInfo.filters?.push({field: field, operation: filterOp, value: false});
                    }
                    else
                    {
                        throw new QueryError({errorCode: "InvalidFilterValue", errorMessage: `Expected Filter Value true/false for ${key}`});
                    }
                }
                else if ((FilterOperation.IN === filterOp) || (FilterOperation.NOT_IN === filterOp))
                {
                    const filterVal = value.split(",");
                    queryInfo.filters?.push({field: field, operation: filterOp, value: filterVal});
                }
                else
                {
                    queryInfo.filters?.push({field: field, operation: filterOp, value: value});
                }
            }
        }
    }

    return queryInfo;
}
