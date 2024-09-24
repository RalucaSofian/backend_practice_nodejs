
/**
 * @file src/controllers/root_controller.ts
 */


import { Request, Response } from "express";


/**
 * @description Handler used for root endpoint checking
 * @param req express HTTP Request object
 * @param resp express HTTP Response object
 */
export function rootHandler(req: Request, resp: Response)
{
    console.log("[controller] Root endpoint request: ", req.method, req.path);

    resp.send("Response: OK");
}
