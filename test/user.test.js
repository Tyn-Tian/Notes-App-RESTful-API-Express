import supertest from "supertest";
import { web } from "../src/application/web";
import { prismaClient } from "../src/application/database";

describe("POST /api/users", () => {
  afterEach(async () => {
    await prismaClient.user.deleteMany({
      where: {
        username: "Tyn",
      },
    });
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
    await prismaClient.user.create({
      data: {
        username: "Tyn",
        name: "Christian",
        password: "rahasia",
      },
    });

    const result = await supertest(web).post("/api/users").send({
      username: "Tyn",
      name: "Christian",
      password: "rahasia",
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});
