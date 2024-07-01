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

export default {
  register,
};
