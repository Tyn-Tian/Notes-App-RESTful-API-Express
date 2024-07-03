import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { createNotesValidation } from "../validation/note-validation";
import { validate } from "../validation/validate.js";
import { v4 as uuid } from "uuid";

const create = async (request, username) => {
  request = validate(createNotesValidation, request);
  request.id = `notes-${uuid()}`;
  request.archived = false;
  request.createdAt = new Date().toISOString();
  request.username = username;

  return prismaClient.note.create({
    data: request,
    select: {
      id: true,
      title: true,
      body: true,
      archived: true,
      createdAt: true,
    },
  });
};

const getUnarchived = async (username) => {
  return prismaClient.note.findMany({
    where: {
      archived: false,
      username: username,
    },
    select: {
      id: true,
      title: true,
      body: true,
      archived: true,
      createdAt: true,
    },
  });
};

export default {
  create,
  getUnarchived,
};
