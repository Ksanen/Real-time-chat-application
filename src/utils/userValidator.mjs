const userValidator = {
  username: {
    isString: true,
    notEmpty: {
      errorMessage: "Username cannot be empty",
    },
    isLength: {
      options: {
        min: 4,
        max: 15,
      },
      errorMessage: "Name of the user must have 4-15 characters",
    },
  },
  password: {
    isString: true,
    notEmpty: {
      errorMessage: "Password cannot be empty",
    },
  },
};
export default userValidator;
