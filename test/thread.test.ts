import supertest from "supertest";
import { web } from "../src/application/web";
import { ThreadTestUtil, UserTestUtil } from "./test-utils";
import {v4 as uuid} from "uuid";
import { CreateUserRequest, UserResponse } from "../src/model/user-model";

describe("POST /api/v1/threads", ()=> {

    let userJohnToken: UserResponse;
    const userJohn:CreateUserRequest = {
        username: "johndoe",
        password: "secret",
        name: "john doe"        
    }

    beforeAll(async ()=> {
        await UserTestUtil.createUser(userJohn)
        userJohnToken = await UserTestUtil.loginUser({
            username: userJohn.username,
            password: userJohn.password
        })
    })

    afterAll(async ()=> {
        await ThreadTestUtil.deleteThreads(userJohnToken.id);
        await UserTestUtil.deleteUser();
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
        .set({"X-API-TOKEN": userJohnToken.token})
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
        .set({"X-API-TOKEN": userJohnToken.token})
        .send({
            title: "test title",
            content: "this is the content",
        });

        expect(res.status).toBe(200)
        expect(res.body.data).toBeDefined()
        expect(res.body.data.id).toBeDefined()
        expect(res.body.data.title).toBe("test title")
        expect(res.body.data.content).toBe("this is the content")
        expect(res.body.data.createdDate).toBeDefined()
        expect(res.body.data.updatedDate).toBeDefined()
    })

    it("should get thread", async ()=> {
        const res = await supertest(web)
        .post("/api/v1/threads")
        .set({"X-API-TOKEN": userJohnToken.token})
        .send({
            title: "test title",
            content: "this is the content",
        });

        expect(res.status).toBe(200)
        expect(res.body.data).toBeDefined()
        expect(res.body.data.id).toBeDefined()
        expect(res.body.data.title).toBe("test title")
        expect(res.body.data.content).toBe("this is the content")
        expect(res.body.data.createdDate).toBeDefined()
        expect(res.body.data.updatedDate).toBeDefined()
    })

});

describe("GET /api/v1/threads/:threadId", ()=> {

    const thread = {
        title: "test title",
        content: "this is the content",
        id: ""
    }

    let userJohnToken: UserResponse;
    const userJohn:CreateUserRequest = {
        username: "johndoe",
        password: "secret",
        name: "john doe"        
    }

    beforeAll(async ()=> {
        
        await UserTestUtil.createUser(userJohn)
        
        userJohnToken = await UserTestUtil.loginUser({
            username: userJohn.username,
            password: userJohn.password,
        })
    })

    afterAll(async ()=> {
        await ThreadTestUtil.deleteThreads(userJohnToken.id);
        await UserTestUtil.deleteUser();
    })

    it("should create new thread", async ()=> {
        const res = await supertest(web)
        .post("/api/v1/threads")
        .set({"X-API-TOKEN": userJohnToken.token})
        .send(thread);

        expect(res.status).toBe(200)
        expect(res.body.data).toBeDefined()
        expect(res.body.data.id).toBeDefined()
        expect(res.body.data.title).toBe(thread.title)
        expect(res.body.data.content).toBe(thread.content)
        expect(res.body.data.createdDate).toBeDefined()
        expect(res.body.data.updatedDate).toBeDefined()

        thread.id = res.body.data.id
    })

    it("should get thread-by-id with no api token", async ()=> {
        const res = await supertest(web)
        .get(`/api/v1/threads/${thread.id}`)
        .send();

        expect(res.status).toBe(200)
        expect(res.body.data).toBeDefined()
        expect(res.body.data.id).toBe(thread.id)
        expect(res.body.data.title).toBe(thread.title)
        expect(res.body.data.content).toBe(thread.content)
        expect(res.body.data.createdDate).toBeDefined()
        expect(res.body.data.updatedDate).toBeDefined()
    })

    it("should error when get thread by invalid id", async ()=> {
        const res = await supertest(web)
        .get(`/api/v1/threads/${uuid()}`)
        .send();

        expect(res.status).toBe(404)
        expect(res.body.errors).toBeDefined()
    })

})

describe("PUT /api/v1/threads/:threadId", ()=> {

    const thread = {
        title: "test title",
        content: "this is the content",
        id: ""
    }

    let userJohnToken: UserResponse;
    const userJohn:CreateUserRequest = {
        username: "johndoe",
        password: "secret",
        name: "john doe"        
    }

    beforeAll(async ()=> {
        
        await UserTestUtil.createUser(userJohn)
        
        userJohnToken = await UserTestUtil.loginUser({
            username: userJohn.username,
            password: userJohn.password,
        })
    })

    afterAll(async ()=> {
        await ThreadTestUtil.deleteThreads(userJohnToken.id);
        await UserTestUtil.deleteUser();
    })

    it("should create new thread", async ()=> {
        const res = await supertest(web)
        .post("/api/v1/threads")
        .set({"X-API-TOKEN": userJohnToken.token})
        .send(thread);

        expect(res.status).toBe(200)
        expect(res.body.data).toBeDefined()
        expect(res.body.data.id).toBeDefined()
        expect(res.body.data.title).toBe(thread.title)
        expect(res.body.data.content).toBe(thread.content)
        expect(res.body.data.createdDate).toBeDefined()
        expect(res.body.data.updatedDate).toBeDefined()

        thread.id = res.body.data.id
    })

    it("should get thread-by-id with no api token", async ()=> {
        const res = await supertest(web)
        .get(`/api/v1/threads/${thread.id}`)
        .send();

        expect(res.status).toBe(200)
        expect(res.body.data).toBeDefined()
        expect(res.body.data.id).toBe(thread.id)
        expect(res.body.data.title).toBe(thread.title)
        expect(res.body.data.content).toBe(thread.content)
        expect(res.body.data.createdDate).toBeDefined()
        expect(res.body.data.updatedDate).toBeDefined()
    })

    it("should update thread", async ()=> {
        thread.title = "change title"
        thread.content = "change content"

        const res = await supertest(web)
        .put(`/api/v1/threads/${thread.id}`)
        .set({"X-API-TOKEN": userJohnToken.token})
        .send(thread);

        expect(res.status).toBe(200)
        expect(res.body.data).toBeDefined()
        expect(res.body.data.id).toBe(thread.id)
        expect(res.body.data.title).toBe(thread.title)
        expect(res.body.data.content).toBe(thread.content)
        expect(res.body.data.createdDate).toBeDefined()
        expect(res.body.data.updatedDate).toBeDefined()
    })

    it("should reject update thread", async ()=> {

        const res = await supertest(web)
        .put(`/api/v1/threads/${thread.id}`)
        .set({"X-API-TOKEN": userJohnToken.token})
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

    let userJohnToken: UserResponse;
    const userJohn:CreateUserRequest = {
        username: "johndoe",
        password: "secret",
        name: "john doe"        
    }

    beforeAll(async ()=> {
        
        await UserTestUtil.createUser(userJohn)
        
        userJohnToken = await UserTestUtil.loginUser({
            username: userJohn.username,
            password: userJohn.password,
        })
    })

    afterAll(async ()=> {
        await ThreadTestUtil.deleteThreads(userJohnToken.id);
        await UserTestUtil.deleteUser();
    })

    it("should create new thread", async ()=> {
        const res = await supertest(web)
        .post("/api/v1/threads")
        .set({"X-API-TOKEN": userJohnToken.token})
        .send(thread);

        expect(res.status).toBe(200)
        expect(res.body.data).toBeDefined()
        expect(res.body.data.id).toBeDefined()
        expect(res.body.data.title).toBe(thread.title)
        expect(res.body.data.content).toBe(thread.content)
        expect(res.body.data.createdDate).toBeDefined()
        expect(res.body.data.updatedDate).toBeDefined()

        thread.id = res.body.data.id
    })

    it("should get thread-by-id with no api token", async ()=> {
        const res = await supertest(web)
        .get(`/api/v1/threads/${thread.id}`)
        .send();

        expect(res.status).toBe(200)
        expect(res.body.data).toBeDefined()
        expect(res.body.data.id).toBe(thread.id)
        expect(res.body.data.title).toBe(thread.title)
        expect(res.body.data.content).toBe(thread.content)
        expect(res.body.data.createdDate).toBeDefined()
        expect(res.body.data.updatedDate).toBeDefined()
    })

    it("should delete thread", async ()=> {
        const res = await supertest(web)
        .delete(`/api/v1/threads/${thread.id}`)
        .set({"X-API-TOKEN": userJohnToken.token});

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
