"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreadValidation = void 0;
const zod_1 = require("zod");
class ThreadValidation {
    static CREATE = zod_1.z.object({
        title: zod_1.z.string().min(10).max(100),
        content: zod_1.z.string()
    });
}
exports.ThreadValidation = ThreadValidation;
