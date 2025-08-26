import { User } from "@prisma/client";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/error-response";
import { CreateUserRequest, LoginUserRequest, toUserResponse, UpdateUserRequest, UserResponse } from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import bcrypt from  "bcrypt"
import {v4 as uuid, v4} from "uuid"

export class UserService {
 
    static async reqister(request: CreateUserRequest): Promise<UserResponse> {
        const reqisterRequest = Validation.validate(UserValidation.REGISTER, request);

        const duplicatedUsername = await prismaClient.user.count({
            where: {
                username: reqisterRequest.username
            }
        });

        if(duplicatedUsername != 0){
            throw new ResponseError(404, "Username taken.");
        }

        reqisterRequest.password = await bcrypt.hash(reqisterRequest.password, 10);

        const registeredUser = await prismaClient.user.create({
            data: reqisterRequest
        });
        
        return toUserResponse(registeredUser)
    }

    static async login(request: LoginUserRequest): Promise<UserResponse> {
        const loginRequest = Validation.validate(UserValidation.LOGIN, request);

        const user = await prismaClient.user.findUnique({
            where:{
                username: loginRequest.username
            }
        });

        if(!user){
            throw new ResponseError(401, "Username or password is wrong.");
        }

        const isValid:boolean = await bcrypt.compare(loginRequest.password, user.password)
        if(!isValid){
            throw new ResponseError(401, "Username or password is wrong.");
        }
        
        const updatedUser = await prismaClient.user.update({
            where: {username: loginRequest.username},
            data: {
                token: uuid()
            }
        })

        const response = toUserResponse(updatedUser)
        response.token = updatedUser.token!; 

        return response
    }

    static async currentUser(user: User): Promise<UserResponse> {
        return toUserResponse(user);
    }

    static async update(request: UpdateUserRequest, user: User): Promise<UserResponse> {
        const updateRequest = Validation.validate(UserValidation.UPDATE, request);   

        user.name = updateRequest.name;
        user.username = updateRequest.username;

        const isEqual:boolean = await bcrypt.compare(updateRequest.password, user.password)
        if(!isEqual){
            user.password = await bcrypt.hash(updateRequest.password, 10)
            user.token = null
        }

        const updatedUser = await prismaClient.user.update({
            where: {id: user.id},
            data: user
        });

        return toUserResponse(updatedUser);
    }

    static async logout(user: User): Promise<UserResponse> {

        const updatedUser = await prismaClient.user.update({
            where: {id: user.id},
            data: {
                token: null
            }
        });

        return toUserResponse(updatedUser);
    }
}