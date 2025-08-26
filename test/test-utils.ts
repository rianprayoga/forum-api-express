import { prismaClient } from "../src/application/database";

export class UserTestUtil {
    static async deleteUser(username: string = "johndoe"){
        await prismaClient.user.deleteMany({
            where: {
                username: username
            }
        })
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