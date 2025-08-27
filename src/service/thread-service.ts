import { Thread, User } from "@prisma/client";
import { ThreadRequest, ThreadResponse, toThreadResponse } from "../model/thread-model";
import { ThreadValidation } from "../validation/thread-validation";
import { Validation } from "../validation/validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/error-response";
import { PageData, PageRequest } from "../model/pageable";
import { da } from "zod/v4/locales/index.cjs";

export class ThreadService {

    static async addThread(req: ThreadRequest, user: User): Promise<ThreadResponse> {
        const createRequest:ThreadRequest = Validation.validate(ThreadValidation.CREATE, req);

        const record = {
            ...createRequest,
            userId: user.id
        }

        const newThread = await prismaClient.thread.create({
            data: record
        })

        return toThreadResponse(newThread);        
    }

    static async validateThreadExist(id:string): Promise<Thread> {
        const thread = await prismaClient.thread.findUnique({
            where: {
                id: id
            }
        });

        if(!thread){
            throw new ResponseError(404, `Thread ${id} not found.`);            
        }        

        return thread;
    }

    static async getThread(id:string): Promise<ThreadResponse>{

        const thread = await this.validateThreadExist(id);

        return toThreadResponse(thread);
    }
    
    static async updateThread(id:string, req: ThreadRequest, user: User): Promise<ThreadResponse>{
        const updateRequest:ThreadRequest = Validation.validate(ThreadValidation.CREATE, req);

        const thread = await this.validateThreadExist(id);

        if(thread.userId !== user.id){
            throw new ResponseError(403, `User forbiden to update Thread ${id}.`);            
        }

        thread.content = updateRequest.content;
        thread.title = updateRequest.title;
        thread.updatedDate = new Date();

        const updated = await prismaClient.thread.update({
            where: {id:id},
            data: thread
        })

        return toThreadResponse(updated);
    }

    static async deleteThread(id:string, user: User) {

        const thread = await this.validateThreadExist(id);

        if(thread.userId !== user.id){
            throw new ResponseError(403, `User forbiden to delete Thread ${id}.`);
        }

        await prismaClient.thread.delete({
            where: {id: id}
        })
    }

    static async getThreads(req: PageRequest): Promise<PageData<ThreadResponse>> {

        const threads = await prismaClient.thread.findMany({
            take: req.pageSize,
            skip: req.pageSize * req.pageNumber,
            orderBy: {
                "createdDate": "asc"
            }
        })

        const totalData = await prismaClient.thread.count()

        const data = threads.map( t => {
            const res = toThreadResponse(t)
            res.like = t.likeCount === null? 0: t.likeCount
            return res;
        });

        return {
            data: data,
            pageInfo: {
                pageNumber: req.pageNumber,
                pageSize : req.pageSize,
                totalPage : Math.ceil(totalData/req.pageSize)
            }
        }
    }

}