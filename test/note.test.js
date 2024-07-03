import supertest from "supertest";
import { web } from "../src/application/web.js";
import {
  createMultipleNotesTest,
  createNoteTest,
  createUserTest,
  deleteNoteTest,
  deleteUserTest,
  getNoteTest,
} from "./test-utils";

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

describe("GET /api/notes", () => {
  beforeEach(async () => {
    await createUserTest();
  });

  afterEach(async () => {
    await deleteNoteTest();
    await deleteUserTest();
  });

  it("should can get all unarchived notes", async () => {
    await createMultipleNotesTest(false);
    const result = await supertest(web)
      .get("/api/notes")
      .set("Authorization", "token");

    expect(result.status).toBe(200);
    expect(result.body.status).toBeDefined();
    expect(result.body.message).toBeDefined();
    expect(result.body.data[0].id).toBe("1");
    expect(result.body.data[0].title).toBeDefined();
    expect(result.body.data[0].body).toBeDefined();
    expect(result.body.data[0].archived).toBeFalsy();
    expect(result.body.data[0].createdAt).toBeDefined();
    expect(result.body.data[0].username).toBeUndefined();
  });

  it("should can get empty unarchived notes", async () => {
    const result = await supertest(web)
      .get("/api/notes")
      .set("Authorization", "token");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(0);
  });

  it("should reject if not set token", async () => {
    const result = await supertest(web).get("/api/notes");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if token is invalid", async () => {
    const result = await supertest(web)
      .get("/api/notes")
      .set("Authorization", "wrong");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/notes/archived", () => {
  beforeEach(async () => {
    await createUserTest();
  });

  afterEach(async () => {
    await deleteNoteTest();
    await deleteUserTest();
  });

  it("should can get all archived notes", async () => {
    await createMultipleNotesTest(true);
    const result = await supertest(web)
      .get("/api/notes/archived")
      .set("Authorization", "token");

    expect(result.status).toBe(200);
    expect(result.body.status).toBeDefined();
    expect(result.body.message).toBeDefined();
    expect(result.body.data[0].id).toBe("1");
    expect(result.body.data[0].title).toBeDefined();
    expect(result.body.data[0].body).toBeDefined();
    expect(result.body.data[0].archived).toBeTruthy();
    expect(result.body.data[0].createdAt).toBeDefined();
    expect(result.body.data[0].username).toBeUndefined();
  });

  it("should can get empty archived notes", async () => {
    const result = await supertest(web)
      .get("/api/notes/archived")
      .set("Authorization", "token");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(0);
  });

  it("should reject if not set token", async () => {
    const result = await supertest(web).get("/api/notes/archived");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if token is invalid", async () => {
    const result = await supertest(web)
      .get("/api/notes/archived")
      .set("Authorization", "wrong");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/notes/:note_id", () => {
  beforeEach(async () => {
    await createUserTest();
  });

  afterEach(async () => {
    await deleteNoteTest();
    await deleteUserTest();
  });

  it("should can get a single note", async () => {
    await createNoteTest();
    const result = await supertest(web)
      .get("/api/notes/1")
      .set("Authorization", "token");

    expect(result.status).toBe(200);
    expect(result.body.status).toBeDefined();
    expect(result.body.message).toBeDefined();
    expect(result.body.data).toBeDefined();
    expect(result.body.data.username).toBeUndefined();
  });

  it("should reject if not is not found", async () => {
    const result = await supertest(web)
      .get("/api/notes/1")
      .set("Authorization", "token");

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if not set token", async () => {
    await createNoteTest();
    const result = await supertest(web).get("/api/notes/1");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if token is invalid", async () => {
    await createNoteTest();
    const result = await supertest(web)
      .get("/api/notes/1")
      .set("Authorization", "wrong");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("DELETE /api/notes/:note_id", () => {
  beforeEach(async () => {
    await createUserTest();
  });

  afterEach(async () => {
    await deleteNoteTest();
    await deleteUserTest();
  });

  it("should can delete note", async () => {
    await createNoteTest();
    const result = await supertest(web)
      .delete("/api/notes/1")
      .set("Authorization", "token");

    const note = await getNoteTest();

    expect(result.status).toBe(200);
    expect(result.body.status).toBeDefined();
    expect(result.body.message).toBeDefined();
    expect(note).toBeNull();
  });

  it("should reject if note is not found", async () => {
    const result = await supertest(web)
      .delete("/api/notes/1")
      .set("Authorization", "token");

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if not set token", async () => {
    const result = await supertest(web).delete("/api/notes/1");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if token is invalid", async () => {
    const result = await supertest(web)
      .delete("/api/notes/1")
      .set("Authorization", "wrong");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});
