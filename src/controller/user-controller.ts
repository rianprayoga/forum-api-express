import { NextFunction, Request, Response } from "express";
import { CreateUserRequest, LoginUserRequest, UpdateUserRequest } from "../model/user-model";
import { UserService } from "../service/user-service";
import { UserRequest } from "../type/user-request";

export class UserController {

    static async register(req: Request, res: Response, next: NextFunction){
        try{
            const body: CreateUserRequest = req.body;
            const response = await UserService.reqister(body);
            res.status(200).json(response)
        }catch(e){
            next(e)
        }
    }

    static async login(req: Request, res: Response, next: NextFunction){
        try{
            const body: LoginUserRequest = req.body;
            const response = await UserService.login(body);
            res.status(200).json(response)
        }catch(e){
            next(e)
        }
    }

    static async currentUser(req: UserRequest, res: Response, next: NextFunction){
        try{
            const response = await UserService.currentUser(req.user!);
            res.status(200).json(response)
        }catch(e){
            next(e)
        }
    }

    static async update(req: UserRequest, res: Response, next: NextFunction){
        try{
            const body: UpdateUserRequest  = req.body
            const response = await UserService.update(body, req.user!);
            res.status(200).json(response)
        }catch(e){
            next(e)
        }
    }

    static async logout(req: UserRequest, res: Response, next: NextFunction){
        try{
            const response = await UserService.logout(req.user!);
            res.status(200).json(response)
        }catch(e){
            next(e)
        }
    }
}