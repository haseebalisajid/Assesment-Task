const Joi = require("joi");

exports.taskSchema = Joi.object({
  articleName: Joi.string().required().messages({
    "string.empty": `Article Name cant be empty`,
    "any.required": `Article Name is required field`,
  }),
  description: Joi.string().required().messages({
    "string.empty": `Description cant be empty`,
    "any.required": `Description is required field`,
  }),
  articleBody: Joi.string().required().messages({
    "string.empty": `Article Body cant be empty`,
    "any.required": `Article Body is required field`,
  }),
});
