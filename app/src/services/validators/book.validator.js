import nameValidator from "./name.validator";

export const bookValidatorSimple = async (
  category_id,
  isbn,
  title,
  author,
  total_copies,
  available_copies
) => {
  if (!category_id) {
    throw new Error("Category is required.");
  }

  if (!Number.isInteger(category_id) || !(category_id > 0)) {
    throw new Error("Category ID must be a positive integer.");
  }

  if (!isbn || isbn.trim() === "") {
    throw new Error("ISBN is required.");
  }

  if (
    !/^(?:\d{9}[\dX]|\d{13})$/.test(isbn.replace(/-/g, "")) ||
    !(typeof isbn === "string")
  ) {
    throw new Error("ISBN format is invalid.");
  }

  if (!title || title.trim() === "") {
    throw new Error("title is required.");
  }

  if (
    !(title.length >= 1 && title.length <= 255) ||
    !(typeof title === "string")
  ) {
    throw new Error("Title length is invalid.");
  }

  nameValidator(author);

  if (!total_copies) {
    throw new Error("Total copies is required.");
  }

  if (!Number.isInteger(total_copies) || !(total_copies >= 1)) {
    throw new Error("Total copies must be at least 1.");
  }

  if (!available_copies) {
    throw new Error("Available copies is required.");
  }

  if (!Number.isInteger(available_copies) || !(available_copies >= 0)) {
    throw new Error("Available copies cannot be negative.");
  }

  if (!(available_copies <= total_copies)) {
    throw new Error("Available copies cannot exceed total copies.");
  }
};

export const bookValidatorAll = async (
  book_id,
  category_id,
  isbn,
  title,
  author,
  total_copies,
  available_copies,
  status
) => {
  const book_info = {
    category_id,
    isbn,
    title,
    author,
    total_copies,
    available_copies,
  };

  if (!(book_id && Number.isInteger(book_id) && book_id > 0)) {
    throw new Error("Book ID is invalid");
  }

  bookValidatorSimple(book_info);

  if (!(status === "available" || status === "unavailable")) {
    throw new Error("Invalid status");
  }
};
