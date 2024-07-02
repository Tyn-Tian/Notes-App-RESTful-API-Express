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

export { createUserTest, deleteUserTest, getUserTest, deleteNoteTest };
