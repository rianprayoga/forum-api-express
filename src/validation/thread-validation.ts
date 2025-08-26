import {z, ZodType } from "zod";

export class ThreadValidation {

    static readonly CREATE = z.object({
        title: z.string().min(10).max(100),
        content: z.string()
    })

}