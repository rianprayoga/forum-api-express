"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
class UserValidation {
    static REGISTER = zod_1.z.object({
        username: zod_1.z.string("Value of useranme must be string.")
            .min(5, "Value of useranme must be between 5 to 100 characters.")
            .max(100, "Value of useranme must be between 5 to 100 characters."),
        password: zod_1.z.string("Value of password must be string.").min(5, "Value of password must be between 5 to 100 characters.")
            .max(100, "Value of password must be between 5 to 100 characters."),
        name: zod_1.z.string("Value of name must be string.")
            .min(1, "Value of name must be between 1 to 100 characters.")
            .max(100, "Value of name must be between 1 to 100 characters.")
    });
    static LOGIN = zod_1.z.object({
        username: zod_1.z.string().min(5).max(100),
        password: zod_1.z.string().min(5).max(100),
    });
    static UPDATE = zod_1.z.object({
        username: zod_1.z.string().min(5).max(100),
        password: zod_1.z.string().min(5).max(100),
        name: zod_1.z.string().min(1).max(100)
    });
}
exports.UserValidation = UserValidation;
