import { Thread } from "@prisma/client";

export type ThreadRequest = {
    title: string;
    content: string;
}

export type ThreadResponse = {
    id: string;
    title: string;
    content: string;
    createdDate: Date;
    updatedDate: Date;
    like?: number
}

export function toThreadResponse(thread: Thread) : ThreadResponse{
    
    return {
        id: thread.id,
        title: thread.title,
        content: thread.content,
        createdDate: thread.createdDate,
        updatedDate: thread.updatedDate === null? thread.createdDate: thread.updatedDate,
    }

}