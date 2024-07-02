import supertest from "supertest";
import { web } from "../src/application/web.js";
import { createUserTest, deleteNoteTest, deleteUserTest } from "./test-utils";

describe("POST /api/notes", () => {
  beforeEach(async () => {
    await createUserTest();
  });

  afterEach(async () => {
    await deleteNoteTest();
    await deleteUserTest();
  });

  it("should can create notes", async () => {
    const result = await supertest(web)
      .post("/api/notes")
      .send({
        title: "test",
        body: "Body for notes test",
      })
      .set("Authorization", "token");

    expect(result.status).toBe(201);
    expect(result.body.status).toBeDefined();
    expect(result.body.message).toBeDefined();
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.title).toBeDefined();
    expect(result.body.data.body).toBeDefined();
    expect(result.body.data.archived).toBeFalsy();
    expect(result.body.data.createdAt).toBeDefined();
  });

  it("should reject if request is invalid", async () => {
    const result = await supertest(web)
      .post("/api/notes")
      .send({
        title: "",
        body: "",
      })
      .set("Authorization", "token");

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if not set token", async () => {
    const result = await supertest(web).post("/api/notes").send({
      title: "test",
      body: "Body for notes test",
    });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if token is invalid", async () => {
    const result = await supertest(web)
      .post("/api/notes")
      .send({
        title: "test",
        body: "Body for notes test",
      })
      .set("Authorization", "wrong");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});
