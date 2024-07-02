import supertest from "supertest";
import { web } from "../src/application/web";
import { createUserTest, deleteUserTest, getUserTest } from "./test-utils";
import bcrypt from "bcrypt";

describe("POST /api/users", () => {
  afterEach(async () => {
    await deleteUserTest();
  });

  it("should can register new user", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "Tyn",
      name: "Christian",
      password: "rahasia",
    });

    expect(result.status).toBe(201);
    expect(result.body.status).toBeDefined();
    expect(result.body.message).toBeDefined();
    expect(result.body.data.username).toBe("Tyn");
    expect(result.body.data.name).toBe("Christian");
    expect(result.body.data.password).toBeUndefined();
  });

  it("should reject if request is invalid", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "",
      name: "",
      password: "",
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if username is already registered", async () => {
    await createUserTest();

    const result = await supertest(web).post("/api/users").send({
      username: "Tyn",
      name: "Christian",
      password: "rahasia",
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("POST /api/users/login", () => {
  beforeEach(async () => {
    await createUserTest();
  });

  afterEach(async () => {
    await deleteUserTest();
  });

  it("should can login user", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "Tyn",
      password: "rahasia",
    });

    expect(result.status).toBe(200);
    expect(result.body.status).toBeDefined();
    expect(result.body.message).toBeDefined();
    expect(result.body.data.token).toBeDefined();
  });

  it("should reject if request is invalid", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "",
      password: "",
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if username is not registered", async () => {
    await deleteUserTest();
    const result = await supertest(web).post("/api/users/login").send({
      username: "Tyn",
      password: "rahasia",
    });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBe("Username or password wrong");
  });

  it("should reject if password is wrong", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "Tyn",
      password: "wrong",
    });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBe("Username or password wrong");
  });
});

describe("GET /api/users/current", () => {
  beforeEach(async () => {
    await createUserTest();
  });

  afterEach(async () => {
    await deleteUserTest();
  });

  it("should can get current user", async () => {
    const result = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", "token");

    expect(result.status).toBe(200);
    expect(result.body.status).toBeDefined();
    expect(result.body.message).toBeDefined();
    expect(result.body.data.username).toBeDefined();
    expect(result.body.data.name).toBeDefined();
  });

  it("should reject if not set token", async () => {
    const result = await supertest(web).get("/api/users/current");
    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if token is invalid", async () => {
    const result = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", "wrong");
    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("PATCH /api/users/current", () => {
  beforeEach(async () => {
    await createUserTest();
  });

  afterEach(async () => {
    await deleteUserTest();
  });

  it("should can update user", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .send({
        name: "Updated",
        password: "Updated",
      })
      .set("Authorization", "token");

    const user = await getUserTest();

    expect(result.status).toBe(200);
    expect(result.body.status).toBeDefined();
    expect(result.body.message).toBeDefined();
    expect(result.body.data.name).toBe("Updated");
    expect(await bcrypt.compare("Updated", user.password)).toBeTruthy();
  });

  it("should can update name user", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .send({
        name: "Updated",
      })
      .set("Authorization", "token");

    expect(result.status).toBe(200);
    expect(result.body.status).toBeDefined();
    expect(result.body.message).toBeDefined();
    expect(result.body.data.name).toBe("Updated");
  });

  it("should can update password user", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .send({
        password: "Updated",
      })
      .set("Authorization", "token");

    const user = await getUserTest();

    expect(result.status).toBe(200);
    expect(result.body.status).toBeDefined();
    expect(result.body.message).toBeDefined();
    expect(await bcrypt.compare("Updated", user.password)).toBeTruthy();
  });

  it("should reject if not set token", async () => {
    const result = await supertest(web).patch("/api/users/current").send({
      name: "Updated",
      password: "Updated",
    });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if token is invalid", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .send({
        name: "Updated",
        password: "Updated",
      })
      .set("Authorization", "wrong");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});
