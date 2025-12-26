const emailValidator = (email) => {
  if (!email || email.trim() === "") {
    throw new Error("Email is required.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Email format is invalid.");
  }

  if (!(email.length <= 254)) {
    throw new Error("Email length exceeds the limit.");
  }
};

export default emailValidator;
