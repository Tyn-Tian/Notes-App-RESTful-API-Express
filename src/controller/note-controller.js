import noteService from "../service/note-service.js";

const create = async (req, res, next) => {
  try {
    const username = req.user.username;
    const request = req.body;
    const result = await noteService.create(request, username);
    res.status(201).json({
      status: "success",
      message: "Note created",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getUnarchived = async (req, res, next) => {
  try {
    const username = req.user.username;
    const result = await noteService.get(false, username);
    res.status(200).json({
      status: "success",
      message: "Note retrieved",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getArchived = async (req, res, next) => {
  try {
    const username = req.user.username;
    const result = await noteService.get(true, username);
    res.status(200).json({
      status: "success",
      message: "Note retrieved",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getSingle = async (req, res, next) => {
  try {
    const username = req.user.username;
    const noteId = req.params.note_id;
    const result = await noteService.getSingleNote(username, noteId);
    res.status(200).json({
      status: "success",
      message: "Note retrieved",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export default {
  create,
  getUnarchived,
  getArchived,
  getSingle
};
