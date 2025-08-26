import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ResponseError } from "../error/error-response";
import { logger } from "../application/logging";

export const errorMiddleware = async(
    error: Error,
    req: Request, 
    res: Response, 
    next: NextFunction) => {

        if(error instanceof ZodError){
            res
            .status(400)
            .json({
                errors: `Validation error : ${JSON.stringify(error)}`    
            })
        }else if (error instanceof ResponseError){
            res.status(error.status).json({
                errors : error.message
            })
        }else{
            logger.error(error)
            
            res.status(500).json({
                errors : error.message
            })
        }

}