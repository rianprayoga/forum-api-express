import supertest from "supertest"
import {web} from "../src/application/web"
import { UserTestUtil } from "./test-utils";
import {v4 as uuid} from "uuid"

describe("POST /v1/users", ()=> {

    afterEach(async ()=> {
        await UserTestUtil.deleteUser()
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
            .send({
                username: "johndoe",
                password: "secret",
                name: "john doe"
            });

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.data.username).toBe("johndoe")
        expect(res.body.data.name).toBe("john doe")
        expect(res.body.data.id).toBeDefined()
    })
})

describe("POST /v1/users/login", ()=> {

    afterAll(async ()=> {
        await UserTestUtil.deleteUser()
    })

    it("should register new user", async () => {

        const res = await supertest(web)
            .post("/api/v1/users")
            .send({
                username: "johndoe",
                password: "secret",
                name: "john doe"
            });

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.data.username).toBe("johndoe")
        expect(res.body.data.name).toBe("john doe")
        expect(res.body.data.id).toBeDefined()
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
                username: "johndoe",
                password: "secret"
            });

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.data.username).toBe("johndoe")
        expect(res.body.data.name).toBe("john doe")
        expect(res.body.data.id).toBeDefined()
        expect(res.body.data.token).toBeDefined()
    })
})

describe("GET /v1/users/current", ()=> {

    afterAll(async ()=> {
        await UserTestUtil.deleteUser()
    })

    let token: string;

    it("should register new user", async () => {

        const res = await supertest(web)
            .post("/api/v1/users")
            .send({
                username: "johndoe",
                password: "secret",
                name: "john doe"
            });

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.data.username).toBe("johndoe")
        expect(res.body.data.name).toBe("john doe")
        expect(res.body.data.id).toBeDefined()
    })

    it("should login user", async () => {

        const res = await supertest(web)
            .post("/api/v1/users/login")
            .send({
                username: "johndoe",
                password: "secret"
            });

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.data.username).toBe("johndoe")
        expect(res.body.data.name).toBe("john doe")
        expect(res.body.data.id).toBeDefined()
        expect(res.body.data.token).toBeDefined()

        token = res.body.data.token;
    })

    it("should get current user", async () => {

        const res = await supertest(web)
            .get("/api/v1/users/current")
            .set({"X-API-TOKEN": token})
            .send();

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.data.username).toBe("johndoe")
        expect(res.body.data.name).toBe("john doe")
        expect(res.body.data.id).toBeDefined()
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

    let username: string
    let token: string;

    afterAll(async ()=> {
        await UserTestUtil.deleteUser(username)
    })


    it("should register new user", async () => {

        const res = await supertest(web)
            .post("/api/v1/users")
            .send({
                username: "johndoe",
                password: "secret",
                name: "john doe"
            });

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.data.username).toBe("johndoe")
        expect(res.body.data.name).toBe("john doe")
        expect(res.body.data.id).toBeDefined()
    })

    it("should login user", async () => {

        const res = await supertest(web)
            .post("/api/v1/users/login")
            .send({
                username: "johndoe",
                password: "secret"
            });

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.data.username).toBe("johndoe")
        expect(res.body.data.name).toBe("john doe")
        expect(res.body.data.id).toBeDefined()
        expect(res.body.data.token).toBeDefined()

        token = res.body.data.token;
    })

    it("should get current user", async () => {

        const res = await supertest(web)
            .get("/api/v1/users/current")
            .set({"X-API-TOKEN": token})
            .send();

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.data.username).toBe("johndoe")
        expect(res.body.data.name).toBe("john doe")
        expect(res.body.data.id).toBeDefined()
    })

    it("should change name", async () => {

        const res = await supertest(web)
            .put("/api/v1/users/current")
            .set({"X-API-TOKEN": token})
            .send({        
                username: "johndoe",
                password: "secret",
                name: "john chena"
            });

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.data.username).toBe("johndoe")
        expect(res.body.data.name).toBe("john chena")
        expect(res.body.data.id).toBeDefined()
    })

    it("should change username", async () => {

        const res = await supertest(web)
            .put("/api/v1/users/current")
            .set({"X-API-TOKEN": token})
            .send({        
                username: "johnchena",
                password: "secret",
                name: "john chena"
            });
            
        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.data.username).toBe("johnchena")
        expect(res.body.data.name).toBe("john chena")
        expect(res.body.data.id).toBeDefined()

        username = res.body.data.username
    })

    it("should change password", async () => {

        const res = await supertest(web)
            .put("/api/v1/users/current")
            .set({"X-API-TOKEN": token})
            .send({        
                username: "johnchena",
                password: "secret123",
                name: "john chena"
            });
            
        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.data.username).toBe("johnchena")
        expect(res.body.data.name).toBe("john chena")
        expect(res.body.data.id).toBeDefined()
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
                username: "johnchena",
                password: "secret123"
            });

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.data.username).toBe("johnchena")
        expect(res.body.data.name).toBe("john chena")
        expect(res.body.data.id).toBeDefined()
        expect(res.body.data.token).toBeDefined()
    })
})

describe("POST /v1/users/logout", ()=> {

    let token: string;

    afterAll(async ()=> {
        await UserTestUtil.deleteUser()
    })


    it("should register new user", async () => {

        const res = await supertest(web)
            .post("/api/v1/users")
            .send({
                username: "johndoe",
                password: "secret",
                name: "john doe"
            });

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.data.username).toBe("johndoe")
        expect(res.body.data.name).toBe("john doe")
        expect(res.body.data.id).toBeDefined()
    })

    it("should login user", async () => {

        const res = await supertest(web)
            .post("/api/v1/users/login")
            .send({
                username: "johndoe",
                password: "secret"
            });

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.data.username).toBe("johndoe")
        expect(res.body.data.name).toBe("john doe")
        expect(res.body.data.id).toBeDefined()
        expect(res.body.data.token).toBeDefined()

        token = res.body.data.token;
    })

    it("should get current user", async () => {

        const res = await supertest(web)
            .get("/api/v1/users/current")
            .set({"X-API-TOKEN": token})
            .send();

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.data.username).toBe("johndoe")
        expect(res.body.data.name).toBe("john doe")
        expect(res.body.data.id).toBeDefined()
    })

    it("should logut user", async () => {

        const res = await supertest(web)
            .post("/api/v1/users/logout")
            .set({"X-API-TOKEN": token})
            .send();

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.data.username).toBe("johndoe")
        expect(res.body.data.name).toBe("john doe")
        expect(res.body.data.id).toBeDefined()
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