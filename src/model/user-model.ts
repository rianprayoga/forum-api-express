import { User } from "@prisma/client";

export type UserResponse = {
    id: string;
    username: string;
    name: string,
    token?: string;
}

export type CreateUserRequest = {
    username: string;
    password: string;
    name: string;
}

export type LoginUserRequest = {
    username: string;
    password: string;
}

export type UpdateUserRequest = {
    username: string;
    name: string;
    password: string;
}

export function toUserResponse(user: User): UserResponse{

    return {
        id: user.id,
        username: user.username,
        name: user.name
    }
}
