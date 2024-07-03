import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  createNotesValidation,
  noteIdValidation,
} from "../validation/note-validation.js";
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

const get = async (isArchived, username) => {
  return prismaClient.note.findMany({
    where: {
      archived: isArchived,
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

const getSingleNote = async (username, noteId) => {
  noteId = validate(noteIdValidation, noteId);

  const note = await prismaClient.note.findUnique({
    where: {
      username: username,
      id: noteId,
    },
    select: {
      id: true,
      title: true,
      body: true,
      archived: true,
      createdAt: true,
    },
  });

  if (!note) {
    throw new ResponseError(404, "Note is not found");
  }

  return note;
};

const remove = async (username, noteId) => {
  noteId = validate(noteIdValidation, noteId);

  const note = await prismaClient.note.findUnique({
    where: {
      username: username,
      id: noteId,
    },
  });

  if (!note) {
    throw new ResponseError(404, "Note is not found");
  }

  await prismaClient.note.delete({
    where: {
      username: username,
      id: noteId,
    },
  });
};

const archive = async (username, noteId) => {
  noteId = validate(noteIdValidation, noteId);

  const note = await prismaClient.note.findUnique({
    where: {
      username: username,
      id: noteId,
    },
  });

  if (!note) {
    throw new ResponseError(404, "Note is not found");
  }

  await prismaClient.note.update({
    where: {
      username: note.username,
      id: note.id,
    },
    data: {
      archived: true,
    },
  });
};

const unarchive = async (username, noteId) => {
  noteId = validate(noteIdValidation, noteId);

  const note = await prismaClient.note.findUnique({
    where: {
      username: username,
      id: noteId,
    },
  });

  if (!note) {
    throw new ResponseError(404, "Note is not found");
  }

  await prismaClient.note.update({
    where: {
      username: note.username,
      id: note.id,
    },
    data: {
      archived: false
    }
  });
};

export default {
  create,
  get,
  getSingleNote,
  remove,
  archive,
  unarchive,
};
