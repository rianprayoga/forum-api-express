import { NextFunction, Response } from "express";
import { prismaClient } from "../application/database";
import { UserRequest } from "../type/user-request";

export const authMiddleware = async(
    req: UserRequest, 
    res: Response, 
    next: NextFunction) => {
        
    const token = req.get("X-API-TOKEN")

    if(token){
        const authenticatedUser = await prismaClient.user.findFirst({
            where: {
                token : token
            }
        });

        if(authenticatedUser){
            req.user = authenticatedUser;
            next();
            return;
        }
    }

    res
        .status(401)
        .json({
            errors: "Unathorized"
        })
        .end()
        
}