import supertest from "supertest";
import { prismaClient } from "../src/application/database";
import { CreateUserRequest, LoginUserRequest, UserResponse } from "../src/model/user-model";
import { web } from "../src/application/web";

export class UserTestUtil {
    static async deleteUser(username: string){
        await prismaClient.user.deleteMany({
            where: {
                username: username
            }
        })
    }

    static async createUser(req:CreateUserRequest) {
        const res = await supertest(web)
                .post("/api/v1/users")
                .send(req);

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.username).toBe(req.username)
        expect(res.body.name).toBe(req.name)
        expect(res.body.id).toBeDefined()
    }

    static async loginUser(req: LoginUserRequest): Promise<UserResponse>{
        const res = await supertest(web)
                .post("/api/v1/users/login")
                .send(req);

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.username).toBe(req.username)
        expect(res.body.name).toBeDefined()
        expect(res.body.id).toBeDefined()
        expect(res.body.token).toBeDefined()

        return res.body as UserResponse
    }
}

export class ThreadTestUtil {
    static async deleteThreads(userId:string){
        await prismaClient.thread.deleteMany({
            where: {
                userId: userId
            }
        })
    }
}

export class StringUtil {
    
    static makeString(length: number): string {
        let result = "";
        const characters = "abcdefghijklmnopqrstuvwxyz";
        const charactersLength = 26;

        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}