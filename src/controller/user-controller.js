import userService from "../service/user-service.js";

const register = async (req, res, next) => {
  try {
    const result = await userService.register(req.body);
    res.status(201).json({
      status: "success",
      message: "User registered",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body);
    res.status(200).json({
      status: "success",
      message: "Login success",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const username = req.user.username;
    const result = await userService.get(username);
    res.status(200).json({
      status: "success",
      message: "Get current user",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const username = req.user.username;
    const request = req.body;
    request.username = username;

    const result = await userService.update(request);
    res.status(200).json({
      status: "success",
      message: "User updated",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export default {
  register,
  login,
  get,
  update,
};
