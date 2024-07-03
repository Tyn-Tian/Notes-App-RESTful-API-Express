import Joi from "joi";

const createNotesValidation = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  body: Joi.string().min(10).required(),
});

const noteIdValidation = Joi.string().required();

export { createNotesValidation, noteIdValidation };
