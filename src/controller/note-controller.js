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

export default {
  create,
};
