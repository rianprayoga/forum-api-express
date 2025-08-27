"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const database_1 = require("../application/database");
const error_response_1 = require("../error/error-response");
const user_model_1 = require("../model/user-model");
const user_validation_1 = require("../validation/user-validation");
const validation_1 = require("../validation/validation");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
class UserService {
    static async reqister(request) {
        const reqisterRequest = validation_1.Validation.validate(user_validation_1.UserValidation.REGISTER, request);
        const duplicatedUsername = await database_1.prismaClient.user.count({
            where: {
                username: reqisterRequest.username
            }
        });
        if (duplicatedUsername != 0) {
            throw new error_response_1.ResponseError(400, "Username taken.");
        }
        reqisterRequest.password = await bcrypt_1.default.hash(reqisterRequest.password, 10);
        const registeredUser = await database_1.prismaClient.user.create({
            data: reqisterRequest
        });
        return (0, user_model_1.toUserResponse)(registeredUser);
    }
    static async login(request) {
        const loginRequest = validation_1.Validation.validate(user_validation_1.UserValidation.LOGIN, request);
        const user = await database_1.prismaClient.user.findUnique({
            where: {
                username: loginRequest.username
            }
        });
        if (!user) {
            throw new error_response_1.ResponseError(401, "Username or password is wrong.");
        }
        const isValid = await bcrypt_1.default.compare(loginRequest.password, user.password);
        if (!isValid) {
            throw new error_response_1.ResponseError(401, "Username or password is wrong.");
        }
        const updatedUser = await database_1.prismaClient.user.update({
            where: { username: loginRequest.username },
            data: {
                token: (0, uuid_1.v4)()
            }
        });
        const response = (0, user_model_1.toUserResponse)(updatedUser);
        response.token = updatedUser.token;
        return response;
    }
    static async currentUser(user) {
        return (0, user_model_1.toUserResponse)(user);
    }
    static async update(request, user) {
        const updateRequest = validation_1.Validation.validate(user_validation_1.UserValidation.UPDATE, request);
        user.name = updateRequest.name;
        user.username = updateRequest.username;
        const isEqual = await bcrypt_1.default.compare(updateRequest.password, user.password);
        if (!isEqual) {
            user.password = await bcrypt_1.default.hash(updateRequest.password, 10);
            user.token = null;
        }
        const updatedUser = await database_1.prismaClient.user.update({
            where: { id: user.id },
            data: user
        });
        return (0, user_model_1.toUserResponse)(updatedUser);
    }
    static async logout(user) {
        const updatedUser = await database_1.prismaClient.user.update({
            where: { id: user.id },
            data: {
                token: null
            }
        });
        return (0, user_model_1.toUserResponse)(updatedUser);
    }
}
exports.UserService = UserService;
