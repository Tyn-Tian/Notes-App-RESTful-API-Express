import { prismaClient } from "../src/application/database";
import bcrypt from "bcrypt";

// User test utils
const createUserTest = async () => {
  await prismaClient.user.create({
    data: {
      username: "Tyn",
      password: await bcrypt.hash("rahasia", 10),
      name: "Christian",
      token: "token",
    },
  });
};

const deleteUserTest = async () => {
  await prismaClient.user.deleteMany({
    where: {
      username: "Tyn",
    },
  });
};

const getUserTest = async () => {
  return prismaClient.user.findUnique({
    where: {
      username: "Tyn",
    },
  });
};

// Note test utils
const deleteNoteTest = async () => {
  await prismaClient.note.deleteMany({
    where: {
      title: "test",
    },
  });
};

const createMultipleNotes = async (isArchived) => {
  await prismaClient.note.createMany({
    data: [
      {
        id: "1",
        title: "test",
        body: "ini adalah test body",
        archived: isArchived,
        createdAt: new Date().toISOString(),
        username: "Tyn",
      },
      {
        id: "2",
        title: "test",
        body: "ini adalah test body",
        archived: isArchived,
        createdAt: new Date().toISOString(),
        username: "Tyn",
      },
    ],
  });
};

export {
  createUserTest,
  deleteUserTest,
  getUserTest,
  deleteNoteTest,
  createMultipleNotes,
};
