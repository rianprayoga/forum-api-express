import {z, ZodType } from "zod";

export class UserValidation {

    static readonly REGISTER: ZodType = z.object({
        username: z.string("Value of useranme must be string.")
            .min(5,"Value of useranme must be between 5 to 100 characters.")
            .max(100,"Value of useranme must be between 5 to 100 characters."),
        password: z.string("Value of password must be string.").min(5,"Value of password must be between 5 to 100 characters.")
        .max(100, "Value of password must be between 5 to 100 characters."),
        name: z.string("Value of name must be string.")
            .min(1, "Value of name must be between 1 to 100 characters.")
            .max(100,"Value of name must be between 1 to 100 characters.")
    })

    static readonly LOGIN: ZodType = z.object({
        username: z.string().min(5).max(100),
        password: z.string().min(5).max(100),
    })

    static readonly UPDATE: ZodType = z.object({
        username: z.string().min(5).max(100),
        password: z.string().min(5).max(100),
        name: z.string().min(1).max(100)
    })


}