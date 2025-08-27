"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreadController = void 0;
const thread_service_1 = require("../service/thread-service");
class ThreadController {
    static async create(req, res, next) {
        try {
            const body = req.body;
            const response = await thread_service_1.ThreadService.addThread(body, req.user);
            res.status(200).json(response);
        }
        catch (e) {
            next(e);
        }
    }
    static async get(req, res, next) {
        try {
            const id = req.params.threadId;
            const response = await thread_service_1.ThreadService.getThread(id);
            res.status(200).json(response);
        }
        catch (e) {
            next(e);
        }
    }
    static async update(req, res, next) {
        try {
            const id = req.params.threadId;
            const body = req.body;
            const response = await thread_service_1.ThreadService.updateThread(id, body, req.user);
            res.status(200).json(response);
        }
        catch (e) {
            next(e);
        }
    }
    static async delete(req, res, next) {
        try {
            const id = req.params.threadId;
            await thread_service_1.ThreadService.deleteThread(id, req.user);
            res.status(200).json();
        }
        catch (e) {
            next(e);
        }
    }
    static async getPage(req, res, next) {
        try {
            const pageRequest = {
                pageNumber: req.query.pageNumber ? Number(req.query.pageNumber) : 0,
                pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10
            };
            const response = await thread_service_1.ThreadService.getThreads(pageRequest);
            res.status(200).json(response);
        }
        catch (e) {
            next(e);
        }
    }
}
exports.ThreadController = ThreadController;
