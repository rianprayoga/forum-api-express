import supertest from "supertest"
import {web} from "../src/application/web"
import { StringUtil, UserTestUtil } from "./test-utils";
import {v4 as uuid} from "uuid"
import { CreateUserRequest } from "../src/model/user-model";

describe("POST /v1/users", ()=> {

    const request:CreateUserRequest = {
        username: StringUtil.makeString(7),
        name: "John doe",
        password: "secret"
    }

    afterEach(async ()=> {
        await UserTestUtil.deleteUser(request.username)
    })

    it("should reject when request is invalid", async () => {

        const res = await supertest(web)
            .post("/api/v1/users")
            .send({
                username: "",
                password: "",
                name: ""
            });
        
        expect(res.status).toBe(400)
        expect(res.body).toBeDefined()
    })

    it("should register new user", async () => {
        
        const res = await supertest(web)
            .post("/api/v1/users")
            .send(request);

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.username).toBe(request.username)
        expect(res.body.name).toBe(request.name)
        expect(res.body.id).toBeDefined()
    })
})

describe("POST /v1/users/login", ()=> {

    const request:CreateUserRequest = {
        username: StringUtil.makeString(7),
        name: "John doe",
        password: "secret"
    }

    afterAll(async ()=> {
        await UserTestUtil.deleteUser(request.username)
    })

    it("should register new user", async () => {

        const res = await supertest(web)
            .post("/api/v1/users")
            .send(request);

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.username).toBe(request.username)
        expect(res.body.name).toBe(request.name)
        expect(res.body.id).toBeDefined()
    })

    it("should reject when username is wrong", async () => {

        const res = await supertest(web)
            .post("/api/v1/users/login")
            .send({
                username: "johndoee",
                password: "secret",
            });

        expect(res.status).toBe(401)
        expect(res.body.errors).toBeDefined()
    })

    it("should reject when password is wrong", async () => {

        const res = await supertest(web)
            .post("/api/v1/users/login")
            .send({
                username: "johndoe",
                password: "secrettt",
            });

        expect(res.status).toBe(401)
        expect(res.body.errors).toBeDefined()
    })

    it("should login user", async () => {

        const res = await supertest(web)
            .post("/api/v1/users/login")
            .send({
                username: request.username,
                password: request.password
            });

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.username).toBe(request.username)
        expect(res.body.name).toBe(request.name)
        expect(res.body.id).toBeDefined()
        expect(res.body.token).toBeDefined()
    })
})

describe("GET /v1/users/current", ()=> {

    const request:CreateUserRequest = {
        username: StringUtil.makeString(7),
        name: "John doe",
        password: "secret"
    }

    afterAll(async ()=> {
        await UserTestUtil.deleteUser(request.username)
    })

    let token: string;

    it("should register new user", async () => {

        const res = await supertest(web)
            .post("/api/v1/users")
            .send(request);

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
    })

    it("should login user", async () => {

        const res = await supertest(web)
            .post("/api/v1/users/login")
            .send({
                username: request.username,
                password: request.password
            });

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.username).toBe(request.username)
        expect(res.body.name).toBe(request.name)
        expect(res.body.id).toBeDefined()
        expect(res.body.token).toBeDefined()

        token = res.body.token;
    })

    it("should get current user", async () => {

        const res = await supertest(web)
            .get("/api/v1/users/current")
            .set({"X-API-TOKEN": token})
            .send();

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.username).toBe(request.username)
        expect(res.body.name).toBe(request.name)
        expect(res.body.id).toBeDefined()
    })

    it("should reject when token empty", async () => {

        const res = await supertest(web)
            .get("/api/v1/users/current")
            .send();

        expect(res.status).toBe(401)
        expect(res.body).toBeDefined()
    })

    it("should reject when token not valid", async () => {

        const res = await supertest(web)
            .get("/api/v1/users/current")
            .set({"X-API-TOKEN": uuid()})
            .send();

        expect(res.status).toBe(401)
        expect(res.body).toBeDefined()
    })

})

describe("PUT /v1/users/current", ()=> {

    const request:CreateUserRequest = {
        username: StringUtil.makeString(7),
        name: "John doe",
        password: "secret"
    }

    let token: string;

    afterAll(async ()=> {
        await UserTestUtil.deleteUser(request.username)
    })

    it("should register new user", async () => {

        const res = await supertest(web)
            .post("/api/v1/users")
            .send(request);

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
    })

    it("should login user", async () => {

        const res = await supertest(web)
            .post("/api/v1/users/login")
            .send({
                username: request.username,
                password: request.password
            });

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        token = res.body.token;
    })

    it("should get current user", async () => {

        const res = await supertest(web)
            .get("/api/v1/users/current")
            .set({"X-API-TOKEN": token})
            .send();

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.username).toBe(request.username)
        expect(res.body.name).toBe(request.name)
        expect(res.body.id).toBeDefined()
    })

    it("should change name", async () => {

        request.name = StringUtil.makeString(7)

        const res = await supertest(web)
            .put("/api/v1/users/current")
            .set({"X-API-TOKEN": token})
            .send(request);

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.username).toBe(request.username)
        expect(res.body.name).toBe(request.name)
        expect(res.body.id).toBeDefined()
    })

    it("should change username", async () => {

        request.username = StringUtil.makeString(7)

        const res = await supertest(web)
            .put("/api/v1/users/current")
            .set({"X-API-TOKEN": token})
            .send(request);
            
        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.username).toBe(request.username)
        expect(res.body.name).toBe(request.name)
        expect(res.body.id).toBeDefined()
    })

    it("should change password", async () => {

        request.password = StringUtil.makeString(7)

        const res = await supertest(web)
            .put("/api/v1/users/current")
            .set({"X-API-TOKEN": token})
            .send(request);
            
        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.username).toBe(request.username)
        expect(res.body.name).toBe(request.name)
        expect(res.body.id).toBeDefined()
    })

    it("should fail get-current-user after changing password", async () => {

        const res = await supertest(web)
            .get("/api/v1/users/current")
            .set({"X-API-TOKEN": token})
            .send();

        expect(res.status).toBe(401)
        expect(res.body.errors).toBeDefined()
    })

    it("should login after changing password user", async () => {

        const res = await supertest(web)
            .post("/api/v1/users/login")
            .send({
                username: request.username,
                password: request.password
            });

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.username).toBe(request.username)
        expect(res.body.name).toBe(request.name)
        expect(res.body.id).toBeDefined()
        expect(res.body.token).toBeDefined()
    })
})

describe("POST /v1/users/logout", ()=> {

    const request:CreateUserRequest = {
        username: StringUtil.makeString(7),
        name: "John doe",
        password: "secret"
    }
    let token: string;

    afterAll(async ()=> {
        await UserTestUtil.deleteUser(request.username)
    })


    it("should register new user", async () => {

        const res = await supertest(web)
            .post("/api/v1/users")
            .send(request);

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
    })

    it("should login user", async () => {

        const res = await supertest(web)
            .post("/api/v1/users/login")
            .send({
                username: request.username,
                password: request.password
            });

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.username).toBe(request.username)
        expect(res.body.name).toBe(request.name)
        expect(res.body.id).toBeDefined()
        expect(res.body.token).toBeDefined()

        token = res.body.token;
    })

    it("should get current user", async () => {

        const res = await supertest(web)
            .get("/api/v1/users/current")
            .set({"X-API-TOKEN": token})
            .send();

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.username).toBe(request.username)
        expect(res.body.name).toBe(request.name)
        expect(res.body.id).toBeDefined()
    })

    it("should logut user", async () => {

        const res = await supertest(web)
            .post("/api/v1/users/logout")
            .set({"X-API-TOKEN": token})
            .send();

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.username).toBe(request.username)
        expect(res.body.name).toBe(request.name)
        expect(res.body.id).toBeDefined()
    })

    it("should fail get-current-user after logout", async () => {

        const res = await supertest(web)
            .get("/api/v1/users/current")
            .set({"X-API-TOKEN": token})
            .send();

        expect(res.status).toBe(401)
        expect(res.body).toBeDefined()
        expect(res.body.errors).toBeDefined()
    })
})