"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../service/user-service");
class UserController {
    static async register(req, res, next) {
        try {
            const body = req.body;
            const response = await user_service_1.UserService.reqister(body);
            res.status(200).json(response);
        }
        catch (e) {
            next(e);
        }
    }
    static async login(req, res, next) {
        try {
            const body = req.body;
            const response = await user_service_1.UserService.login(body);
            res.status(200).json(response);
        }
        catch (e) {
            next(e);
        }
    }
    static async currentUser(req, res, next) {
        try {
            const response = await user_service_1.UserService.currentUser(req.user);
            res.status(200).json(response);
        }
        catch (e) {
            next(e);
        }
    }
    static async update(req, res, next) {
        try {
            const body = req.body;
            const response = await user_service_1.UserService.update(body, req.user);
            res.status(200).json(response);
        }
        catch (e) {
            next(e);
        }
    }
    static async logout(req, res, next) {
        try {
            const response = await user_service_1.UserService.logout(req.user);
            res.status(200).json(response);
        }
        catch (e) {
            next(e);
        }
    }
}
exports.UserController = UserController;
