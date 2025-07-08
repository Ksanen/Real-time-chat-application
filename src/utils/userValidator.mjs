const userValidator = {
  username: {
    isString: true,
    notEmpty: {
      errorMessage: "nazwa użytkownika nie może być pusta",
    },
    isLength: {
      options: {
        min: 4,
        max: 15,
      },
      errorMessage: "nazwa użytownika musi mieć długość 4-15 znaków",
    },
  },
  password: {
    isString: true,
    notEmpty: {
      errorMessage: "hasło nie może być puste",
    },
  },
};
export default userValidator;
