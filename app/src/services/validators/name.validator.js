const nameValidator = (full_name) => {
  if (!full_name || full_name.trim() === "") {
    throw new Error("Full name is required.");
  }

  if ((full_name.trim().match(/ /g) || []).length === 0) {
    throw new Error("Full name must contain at least two words.");
  }

  if (!/^[A-Za-z ]+$/.test(full_name)) {
    throw new Error("Full name contains invalid characters.");
  }

  if (!(full_name.length >= 2 && full_name.length <= 100)) {
    throw new Error("Full name must be between 2 and 100 characters.");
  }
};

export default nameValidator;
