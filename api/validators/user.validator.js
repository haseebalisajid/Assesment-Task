const Joi = require("joi");

exports.userSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": `Name cant be empty`,
    "any.required": `Name is required field`,
  }),
  userName: Joi.string().required().messages({
    "string.empty": `User Name cant be empty`,
    "any.required": `User Name is required field`,
  }),
  email: Joi.string()
    .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
    .required()
    .error((errors) => {
      errors.map((error) => {
        switch (error.code) {
          case "any.required":
            error.message = "email is requiered";
            break;
          case "string.pattern.base":
            error.message =
              "email must be in proper email format. e.g user1@gmail.com";
            break;
          case "string.empty":
            error.message = "email cant be empty";
            break;
        }
      });
      return errors;
    }),
  password: Joi.string()
    .required()
    .error((errors) => {
      errors.map((error) => {
        switch (error.code) {
          case "string.min":
            error.message = "password min length must be 8";
            break;
          case "string.max":
            error.message = "password length must be 20";
            break;
          case "string.empty":
            error.message = "password cant be empty";
            break;
        }
      });
      return errors;
    }),
  address: Joi.string().required().messages({
    "string.empty": `Address Name cant be empty`,
    "any.required": `Address Name is required field`,
  }),
  phoneNumber: Joi.number().integer().messages({
    "string.empty": `Phone Number cant be empty`,
    "any.required": `Phone Number is required field`,
  }),
});
