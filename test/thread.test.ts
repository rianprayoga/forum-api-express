import supertest from "supertest";
import { web } from "../src/application/web";
import { StringUtil, ThreadTestUtil, UserTestUtil } from "./test-utils";
import {v4 as uuid} from "uuid";
import { CreateUserRequest, UserResponse } from "../src/model/user-model";

describe("POST /api/v1/threads", ()=> {

    let firstUserToken: UserResponse;
    const firstUser:CreateUserRequest = {
        username: StringUtil.makeString(7),
        password: "secret",
        name: "john doe"        
    }

    beforeAll(async ()=> {
        await UserTestUtil.createUser(firstUser)
        firstUserToken = await UserTestUtil.loginUser({
            username: firstUser.username,
            password: firstUser.password
        })
    })

    afterAll(async ()=> {
        await ThreadTestUtil.deleteThreads(firstUserToken.id);
        await UserTestUtil.deleteUser(firstUser.username);
    })

    it("should reject when token is invalid", async ()=> {
        const res = await supertest(web)
        .post("/api/v1/threads")
        .set({"X-API-TOKEN": ""})
        .send({
            title: "",
            content: "",
        });

        expect(res.status).toBe(401)
        expect(res.body.errors).toBeDefined()
    })

    it("should reject when body invalid", async ()=> {
        const res = await supertest(web)
        .post("/api/v1/threads")
        .set({"X-API-TOKEN": firstUserToken.token})
        .send({
            title: "",
            content: "",
        });

        expect(res.status).toBe(400)
        expect(res.body.errors).toBeDefined()
    })

    it("should create new thread", async ()=> {
        const res = await supertest(web)
        .post("/api/v1/threads")
        .set({"X-API-TOKEN": firstUserToken.token})
        .send({
            title: "test title",
            content: "this is the content",
        });

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.id).toBeDefined()
        expect(res.body.title).toBe("test title")
        expect(res.body.content).toBe("this is the content")
        expect(res.body.createdDate).toBeDefined()
        expect(res.body.updatedDate).toBeDefined()
    })

    it("should get thread", async ()=> {
        const res = await supertest(web)
        .post("/api/v1/threads")
        .set({"X-API-TOKEN": firstUserToken.token})
        .send({
            title: "test title",
            content: "this is the content",
        });

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.id).toBeDefined()
        expect(res.body.title).toBe("test title")
        expect(res.body.content).toBe("this is the content")
        expect(res.body.createdDate).toBeDefined()
        expect(res.body.updatedDate).toBeDefined()
    })

});

describe("GET /api/v1/threads/:threadId", ()=> {

    const thread = {
        title: "test title",
        content: "this is the content",
        id: ""
    }

    let firstUserToken: UserResponse;
    const firstUser:CreateUserRequest = {
        username: StringUtil.makeString(7),
        password: "secret",
        name: "john doe"        
    }

    beforeAll(async ()=> {
        
        await UserTestUtil.createUser(firstUser)
        
        firstUserToken = await UserTestUtil.loginUser({
            username: firstUser.username,
            password: firstUser.password,
        })
    })

    afterAll(async ()=> {
        await ThreadTestUtil.deleteThreads(firstUserToken.id);
        await UserTestUtil.deleteUser(firstUserToken.username);
    })

    it("should create new thread", async ()=> {
        const res = await supertest(web)
        .post("/api/v1/threads")
        .set({"X-API-TOKEN": firstUserToken.token})
        .send(thread);

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.id).toBeDefined()
        expect(res.body.title).toBe(thread.title)
        expect(res.body.content).toBe(thread.content)
        expect(res.body.createdDate).toBeDefined()
        expect(res.body.updatedDate).toBeDefined()

        thread.id = res.body.id
    })

    it("should get thread-by-id with no api token", async ()=> {
        const res = await supertest(web)
        .get(`/api/v1/threads/${thread.id}`)
        .send();

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.id).toBe(thread.id)
        expect(res.body.title).toBe(thread.title)
        expect(res.body.content).toBe(thread.content)
        expect(res.body.createdDate).toBeDefined()
        expect(res.body.updatedDate).toBeDefined()
    })

    it("should error when get thread by invalid id", async ()=> {
        const res = await supertest(web)
        .get(`/api/v1/threads/${uuid()}`)
        .send();

        expect(res.status).toBe(404)
        expect(res.body.errors).toBeDefined()
    })

})

describe("GET /api/v1/threads", ()=> {

    let firstUserToken: UserResponse;
    const firstUser:CreateUserRequest = {
        username: StringUtil.makeString(7),
        password: "secret",
        name: "john doe"        
    }

    beforeAll(async ()=> {
        
        await UserTestUtil.createUser(firstUser)
        
        firstUserToken = await UserTestUtil.loginUser({
            username: firstUser.username,
            password: firstUser.password,
        })
    })

    afterAll(async ()=> {
        await ThreadTestUtil.deleteThreads(firstUserToken.id);
        await UserTestUtil.deleteUser(firstUserToken.username);
    })

    it("should create 1st thread", async ()=> {
        const res = await supertest(web)
        .post("/api/v1/threads")
        .set({"X-API-TOKEN": firstUserToken.token})
        .send({
            title: StringUtil.makeString(10),
            content: StringUtil.makeString(20),
        });

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
    })

    it("should create 2nd thread", async ()=> {
        const res = await supertest(web)
        .post("/api/v1/threads")
        .set({"X-API-TOKEN": firstUserToken.token})
        .send({
            title: StringUtil.makeString(10),
            content: StringUtil.makeString(20),
        });

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
    })

    it("should create 3rd thread", async ()=> {
        const res = await supertest(web)
        .post("/api/v1/threads")
        .set({"X-API-TOKEN": firstUserToken.token})
        .send({
            title: StringUtil.makeString(10),
            content: StringUtil.makeString(20),
        });

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
    })

    it("should create 4th thread", async ()=> {
        const res = await supertest(web)
        .post("/api/v1/threads")
        .set({"X-API-TOKEN": firstUserToken.token})
        .send({
            title: StringUtil.makeString(10),
            content: StringUtil.makeString(20),
        });

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
    })

    it("should create 5th thread", async ()=> {
        const res = await supertest(web)
        .post("/api/v1/threads")
        .set({"X-API-TOKEN": firstUserToken.token})
        .send({
            title: StringUtil.makeString(10),
            content: StringUtil.makeString(20),
        });

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
    })

    it("should get pageable thread with default param", async ()=> {
        const res = await supertest(web)
        .get("/api/v1/threads");

        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
        expect(res.body.data).toHaveLength(5);
        expect(res.body.pageInfo.pageNumber).toBe(0);
        expect(res.body.pageInfo.pageSize).toBe(10);
        expect(res.body.pageInfo.totalPage).toBe(1);
    })

    it("should get pageable thread with param", async ()=> {
        const res = await supertest(web)
        .get("/api/v1/threads")
        .query({
            pageNumber: 1,
            pageSize: 3
        });

        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
        expect(res.body.data).toHaveLength(2);
        expect(res.body.pageInfo.pageNumber).toBe(1);
        expect(res.body.pageInfo.pageSize).toBe(3);
        expect(res.body.pageInfo.totalPage).toBe(2);
    })


})

describe("PUT /api/v1/threads/:threadId", ()=> {

    const thread = {
        title: "test title",
        content: "this is the content",
        id: ""
    }

    let firstUserToken: UserResponse;
    const firstUser:CreateUserRequest = {
        username: StringUtil.makeString(10),
        password: "secret",
        name: "john doe"        
    }

    beforeAll(async ()=> {
        
        await UserTestUtil.createUser(firstUser)
        
        firstUserToken = await UserTestUtil.loginUser({
            username: firstUser.username,
            password: firstUser.password,
        })
    })

    afterAll(async ()=> {
        await ThreadTestUtil.deleteThreads(firstUserToken.id);
        await UserTestUtil.deleteUser(firstUserToken.username);
    })

    it("should create new thread", async ()=> {
        const res = await supertest(web)
        .post("/api/v1/threads")
        .set({"X-API-TOKEN": firstUserToken.token})
        .send(thread);

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.id).toBeDefined()
        expect(res.body.title).toBe(thread.title)
        expect(res.body.content).toBe(thread.content)
        expect(res.body.createdDate).toBeDefined()
        expect(res.body.updatedDate).toBeDefined()

        thread.id = res.body.id
    })

    it("should get thread-by-id with no api token", async ()=> {
        const res = await supertest(web)
        .get(`/api/v1/threads/${thread.id}`)
        .send();

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.id).toBe(thread.id)
        expect(res.body.title).toBe(thread.title)
        expect(res.body.content).toBe(thread.content)
        expect(res.body.createdDate).toBeDefined()
        expect(res.body.updatedDate).toBeDefined()
    })

    it("should update thread", async ()=> {
        thread.title = "change title"
        thread.content = "change content"

        const res = await supertest(web)
        .put(`/api/v1/threads/${thread.id}`)
        .set({"X-API-TOKEN": firstUserToken.token})
        .send(thread);

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.id).toBe(thread.id)
        expect(res.body.title).toBe(thread.title)
        expect(res.body.content).toBe(thread.content)
        expect(res.body.createdDate).toBeDefined()
        expect(res.body.updatedDate).toBeDefined()
    })

    it("should reject update thread", async ()=> {

        const res = await supertest(web)
        .put(`/api/v1/threads/${thread.id}`)
        .set({"X-API-TOKEN": firstUserToken.token})
        .send({
            title: "",
            content: ""
        });

        expect(res.status).toBe(400)
        expect(res.body.errors).toBeDefined()
    })

})

describe("DELETE /api/v1/threads/:threadId", ()=> {

    const thread = {
        title: "test title",
        content: "this is the content",
        id: ""
    }

    let firstUserToken: UserResponse;
    const firstUser:CreateUserRequest = {
        username: StringUtil.makeString(7),
        password: "secret",
        name: "john doe"        
    }

    beforeAll(async ()=> {
        
        await UserTestUtil.createUser(firstUser)
        
        firstUserToken = await UserTestUtil.loginUser({
            username: firstUser.username,
            password: firstUser.password,
        })
    })

    afterAll(async ()=> {
        await ThreadTestUtil.deleteThreads(firstUserToken.id);
        await UserTestUtil.deleteUser(firstUserToken.username);
    })

    it("should create new thread", async ()=> {
        const res = await supertest(web)
        .post("/api/v1/threads")
        .set({"X-API-TOKEN": firstUserToken.token})
        .send(thread);

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.id).toBeDefined()
        expect(res.body.title).toBe(thread.title)
        expect(res.body.content).toBe(thread.content)
        expect(res.body.createdDate).toBeDefined()
        expect(res.body.updatedDate).toBeDefined()

        thread.id = res.body.id
    })

    it("should get thread-by-id with no api token", async ()=> {
        const res = await supertest(web)
        .get(`/api/v1/threads/${thread.id}`)
        .send();

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.id).toBe(thread.id)
        expect(res.body.title).toBe(thread.title)
        expect(res.body.content).toBe(thread.content)
        expect(res.body.createdDate).toBeDefined()
        expect(res.body.updatedDate).toBeDefined()
    })

    it("should delete thread", async ()=> {
        const res = await supertest(web)
        .delete(`/api/v1/threads/${thread.id}`)
        .set({"X-API-TOKEN": firstUserToken.token});

        expect(res.status).toBe(200)
    })

    it("should error when get deleted thread", async ()=> {
        const res = await supertest(web)
        .get(`/api/v1/threads/${thread.id}`)
        .send();

        expect(res.status).toBe(404)
        expect(res.body.errors).toBeDefined()
    })

})
