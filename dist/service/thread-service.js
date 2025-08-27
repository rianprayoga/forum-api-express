"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreadService = void 0;
const thread_model_1 = require("../model/thread-model");
const thread_validation_1 = require("../validation/thread-validation");
const validation_1 = require("../validation/validation");
const database_1 = require("../application/database");
const error_response_1 = require("../error/error-response");
class ThreadService {
    static async addThread(req, user) {
        const createRequest = validation_1.Validation.validate(thread_validation_1.ThreadValidation.CREATE, req);
        const record = {
            ...createRequest,
            userId: user.id
        };
        const newThread = await database_1.prismaClient.thread.create({
            data: record
        });
        return (0, thread_model_1.toThreadResponse)(newThread);
    }
    static async validateThreadExist(id) {
        const thread = await database_1.prismaClient.thread.findUnique({
            where: {
                id: id
            }
        });
        if (!thread) {
            throw new error_response_1.ResponseError(404, `Thread ${id} not found.`);
        }
        return thread;
    }
    static async getThread(id) {
        const thread = await this.validateThreadExist(id);
        return (0, thread_model_1.toThreadResponse)(thread);
    }
    static async updateThread(id, req, user) {
        const updateRequest = validation_1.Validation.validate(thread_validation_1.ThreadValidation.CREATE, req);
        const thread = await this.validateThreadExist(id);
        if (thread.userId !== user.id) {
            throw new error_response_1.ResponseError(403, `User forbiden to update Thread ${id}.`);
        }
        thread.content = updateRequest.content;
        thread.title = updateRequest.title;
        thread.updatedDate = new Date();
        const updated = await database_1.prismaClient.thread.update({
            where: { id: id },
            data: thread
        });
        return (0, thread_model_1.toThreadResponse)(updated);
    }
    static async deleteThread(id, user) {
        const thread = await this.validateThreadExist(id);
        if (thread.userId !== user.id) {
            throw new error_response_1.ResponseError(403, `User forbiden to delete Thread ${id}.`);
        }
        await database_1.prismaClient.thread.delete({
            where: { id: id }
        });
    }
    static async getThreads(req) {
        const threads = await database_1.prismaClient.thread.findMany({
            take: req.pageSize,
            skip: req.pageSize * req.pageNumber,
            orderBy: {
                "createdDate": "asc"
            }
        });
        const totalData = await database_1.prismaClient.thread.count();
        const data = threads.map(t => {
            const res = (0, thread_model_1.toThreadResponse)(t);
            res.like = t.likeCount === null ? 0 : t.likeCount;
            return res;
        });
        return {
            data: data,
            pageInfo: {
                pageNumber: req.pageNumber,
                pageSize: req.pageSize,
                totalPage: Math.ceil(totalData / req.pageSize)
            }
        };
    }
}
exports.ThreadService = ThreadService;
