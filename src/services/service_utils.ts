
/**
 * @file src/services/service_utils.ts
 * @description Contains utils for the services module.
 */


import {
    Equal, FindManyOptions, In, IsNull, LessThan, LessThanOrEqual,
    MoreThan, MoreThanOrEqual, Not, Raw } from "typeorm";

import { QueryInfo, FilterOperation } from "../utils/query";



/**
 * @description Util function for populating the Find Options.
 * The function will use the Query Info object to set the
 * correct values for the 'where', 'order', 'limit' and 'offset' objects.
 * @param queryInfo Query Info object
 * @returns an object of type FindManyOptions, that can be passed to the
 * 'find' function
 */
export function getFindOptions<Model>(queryInfo: QueryInfo) : FindManyOptions<Model>
{
    const findOptions: FindManyOptions = {
        where: {},
        take: 10
    };

    if (queryInfo.search)
    {
        const where = findOptions.where as any;
        where['search_vector'] = Raw(
            (alias) => `${alias} @@ to_tsquery('simple', :search_term || ':*')`,
            {search_term: queryInfo.search}
        );
    }

    if ((queryInfo.filters) && (queryInfo.filters.length > 0))
    {
        const where = findOptions.where as any;
        for (const filter of queryInfo.filters)
        {
            switch (filter.operation)
            {
                case FilterOperation.EQ:
                    where[filter.field] = Equal(filter.value);
                break;

                case FilterOperation.GT:
                    where[filter.field] = MoreThan(filter.value);
                break;

                case FilterOperation.GTE:
                    where[filter.field] = MoreThanOrEqual(filter.value);
                break;

                case FilterOperation.LT:
                    where[filter.field] = LessThan(filter.value);
                break;

                case FilterOperation.LTE:
                    where[filter.field] = LessThanOrEqual(filter.value);
                break;

                case FilterOperation.IS_NULL:
                    if (true === filter.value)
                    {
                        where[filter.field] = IsNull();
                    }
                    else if (false === filter.value)
                    {
                        where[filter.field] = Not(IsNull());
                    }
                    else
                    {
                        console.log("Unknown Filter value");
                    }
                break;

                case FilterOperation.IN:
                    where[filter.field] = In(filter.value);
                break;

                case FilterOperation.NOT_IN:
                    where[filter.field] = Not(In(filter.value));
                break;

                default:
                    console.log("Unknown Filter Operation");
                break;
            }
        }
    }

    if (queryInfo.order)
    {
        findOptions.order = {[queryInfo.order.field]: queryInfo.order.direction};
    }

    if (queryInfo.limit)
    {
        findOptions.take = queryInfo.limit;
    }

    if (queryInfo.offset)
    {
        findOptions.skip = queryInfo.offset;
    }

    return findOptions;
}
