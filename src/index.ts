
/**
 * @file src/index.ts
 * @description Contains calls to controllers
 */


import express, { Express } from "express";
import "reflect-metadata";

import { SERV_PORT } from "./utils/constants";

import { populateModelFields } from "./models/model_utils";
import { rootHandler } from "./controllers/root_controller";
import {
   deleteUserHandler, getAllUsersHandler, getUserByIdHandler,
   loginHandler, registerHandler, updateUserHandler } from "./controllers/auth_controller";

import {
   createPetHandler, deletePetHandler, getAllPetsHandler,
   getPetByIdHandler, updatePetHandler } from "./controllers/pets_controller";

import {
   createClientHandler, deleteClientHandler, getAllClientsHandler,
   getClientByIdHandler, updateClientHandler } from "./controllers/clients_controller";

import {
   createFosterHandler, deleteFosterHandler, getAllFosterHandler,
   getFosterByIdHandler, updateFosterHandler } from "./controllers/foster_controller";

import { AppDataSource } from "./data-source";
import { JWTError, validAccessToken } from "./utils/jwt";



// Init Filter Fields for all models
populateModelFields();


// Init connection to DB
AppDataSource.initialize()
             .then(() => {
                console.log("[server] Data Source initialized");
             })
             .catch((err) => {
                console.error("[server] Error during Data Source initialization: ", err);
             });


// Use Express app
const app: Express = express();
const port         = SERV_PORT;
app.use(express.json());


// Middleware for Req details logging
app.use((req, resp, next) => {
   console.log("\n -- HTTP Request Details --");
   console.log("METHOD = ", req.method, req.originalUrl);
   console.log("HEADERS = ", req.headers);

   next();
});


// Authentication Middleware
app.use(async (req, resp, next) => {
   console.log("\n -- Token Verification --");
   const path = req.path;
   const authHeader = req.header("authorization");
   console.log("PATH = ", path, "; AUTH HEADER = ", authHeader);

   // No auth for register, login and root
   if (["/auth/register", "/auth/login", "/"].includes(path))
   {
      console.log("No auth for ", path);
      next();
      return;
   }
   else
   {
      try
      {
         const authParts = (authHeader ?? "Invalid Token").split(" ");
         const authType  = authParts[0];
         const authToken = authParts[1];
         if (("Bearer" !== authType) || ("" === authToken))
         {
            throw new JWTError({errorCode: "InvalidTokenError", errorMessage: "invalid token or auth type"});
         }

         const isTokenValid = await validAccessToken(authToken);
         if (true === isTokenValid)
         {
            console.log("Valid Token");
            next();
            return;
         }
         else
         {
            throw new JWTError({errorCode: "InvalidTokenError", errorMessage: "invalid token"});
         }
      } catch (error) {
         console.log(error);
         resp.statusCode = 401;
         resp.send("Unauthorized");
         return;
      }
   }
});


// Health Check
app.get('/', rootHandler);


// -- USERS --
// Register an User
app.post('/auth/register', registerHandler);

// Login as an User
app.post('/auth/login', loginHandler);

// Get an User
app.get('/users/:user_id', getUserByIdHandler);

// Get all Users (+ Query)
app.get('/users', getAllUsersHandler);

// Patch an User
app.patch('/users/:user_id', updateUserHandler);

// Delete an User
app.delete('/users/:user_id', deleteUserHandler);


// -- PETS --
// Create a Pet
app.post('/pets', createPetHandler);

// Get a Pet
app.get('/pets/:pet_id', getPetByIdHandler);

// Get all Pets (+ Query)
app.get('/pets', getAllPetsHandler);

// Patch a Pet
app.patch('/pets/:pet_id', updatePetHandler);

// Delete a Pet
app.delete('/pets/:pet_id', deletePetHandler);


// -- CLIENTS --
// Create a Client
app.post('/clients', createClientHandler);

// Get a Client
app.get('/clients/:client_id', getClientByIdHandler);

// Get all Clients (+ Query)
app.get('/clients', getAllClientsHandler);

// Patch a Client
app.patch('/clients/:client_id', updateClientHandler);

// Delete a Client
app.delete('/clients/:client_id', deleteClientHandler);


// -- FOSTER --
// Create a Foster
app.post('/foster', createFosterHandler);

// Get a Foster
app.get('/foster/:foster_id', getFosterByIdHandler);

// Get all Fosters (+ Query)
app.get('/foster', getAllFosterHandler);

// Patch a Foster
app.patch('/foster/:foster_id', updateFosterHandler);

// Delete a Foster
app.delete('/foster/:foster_id', deleteFosterHandler);


// Listen for connections
app.listen(port, () =>
    {
        console.log(`[server] Server running at: http://localhost:${port}`);
    });
