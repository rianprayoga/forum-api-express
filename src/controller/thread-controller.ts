import { NextFunction, Request, Response } from "express";
import { UserRequest } from "../type/user-request";
import { ThreadRequest } from "../model/thread-model";
import { ThreadService } from "../service/thread-service";
import { PageRequest } from "../model/pageable";

export class ThreadController {

    static async create( req: UserRequest, res: Response, next:NextFunction ){

        try{

            const body:ThreadRequest = req.body as ThreadRequest;
            const response = await ThreadService.addThread(body, req.user!)
            res.status(200).json(response)
        }catch(e){
            next(e)
        }

    }

    static async get(req: Request, res: Response, next:NextFunction) {
        try{
            const id = req.params.threadId!;

            const response = await ThreadService.getThread(id);
            res.status(200).json(response)

        }catch(e){
            next(e)
        }
    }

    static async update(req: UserRequest, res: Response, next:NextFunction){
        try{
            const id = req.params.threadId!;
            const body = req.body;

            const response = await ThreadService.updateThread(id, body, req.user!);
            res.status(200).json(response)

        }catch(e){
            next(e)
        }
    }

    static async delete(req: UserRequest, res: Response, next:NextFunction){
        try{
            const id = req.params.threadId!;
            await ThreadService.deleteThread(id, req.user!);
            res.status(200).json()
        }catch(e){
            next(e)
        }
    }

    static async getPage(req: Request, res: Response, next: NextFunction){
        try{
            
            const pageRequest: PageRequest = {
                pageNumber: req.query.pageNumber ? Number(req.query.pageNumber): 0,
                pageSize: req.query.pageSize ? Number(req.query.pageSize): 10
            }

            const response = await ThreadService.getThreads(pageRequest)
            res.status(200).json(response)
        }catch(e){
            next(e)
        }
    }

}
