export const idValidator = (id) => {
  if (!id) {
    throw new Error("ID is required.");
  }

  if (!(Number.isInteger(id) && id > 0)) {
    throw new Error("ID must be a positive integer.");
  }
};

export const humanNameValidator = (name) => {
  if (!name || name.trim() === "") {
    throw new Error("name is required.");
  }

  if ((name.trim().match(/ /g) || []).length === 0) {
    throw new Error("name must contain at least two words.");
  }

  if (!/^[A-Za-z ]+$/.test(name)) {
    throw new Error("name contains invalid characters.");
  }

  if (!(name.length >= 2 && name.length <= 100)) {
    throw new Error("name must be between 2 and 100 characters.");
  }
};

export const emailValidator = (email) => {
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

export const statusValidator = (status) => {
  //'active', 'suspended'
  //'available', 'unavailable'
  //'borrowed', 'returned', 'overdue'
  //'unpaid', 'partial', 'paid', 'waived'

  if (
    !(
      status === "active" ||
      status === "suspended" ||
      status === "available" ||
      status === "unavailable" ||
      status === "borrowed" ||
      status === "returned" ||
      status === "overdue" ||
      status === "unpaid" ||
      status === "partial" ||
      (status === "paid") | (status === "waived")
    )
  ) {
    throw new Error("Invalid Status");
  }
};

export const deadlineTimeStampValidator = (due_at) => {
  if (!due_at) {
    throw new Error("date is required.");
  }

  if (
    !(
      due_at instanceof Date &&
      /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/.test(
        due_at
      )
    )
  ) {
    throw new Error("date format is invalid.");
  }

  if (!(due_at > new Date().toISOString())) {
    throw new Error("date must be in the future.");
  }
};

export const titleValidator = (title) => {
  if (!title || title.trim() === "") {
    throw new Error("title is required.");
  }

  if (
    !(title.length >= 1 && title.length <= 255) ||
    !(typeof title === "string")
  ) {
    throw new Error("Title length is invalid.");
  }
};

export const isbnValidator = (isbn) => {
  if (!isbn || isbn.trim() === "") {
    throw new Error("ISBN is required.");
  }

  if (
    !/^(?:\d{9}[\dX]|\d{13})$/.test(isbn.replace(/-/g, "")) ||
    !(typeof isbn === "string")
  ) {
    throw new Error("ISBN format is invalid.");
  }
};

export const totalCopiesValidator = (total_copies) => {
  if (!total_copies) {
    throw new Error("Total copies is required.");
  }

  if (!Number.isInteger(total_copies) || !(total_copies >= 1)) {
    throw new Error("Total copies must be at least 1.");
  }
};

export const availableCopiesValidator = (total_copies, available_copies) => {
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

export const roleCatNameValidator = (name) => {
  if (!name || name.trim() === "") {
    throw new Error("name is required.");
  }

  if (!(typeof name === "string" && name.length >= 2 && name.length <= 100)) {
    throw new Error("name length is invalid.");
  }

  if (!/^[A-Za-z0-9 ]+$/.test(name)) {
    throw new Error("name contains invalid characters.");
  }
};

export const roleCatDescValidator = (description) => {
  if (
    !(
      typeof description === "string" &&
      description.length >= 0 &&
      description.length <= 255
    )
  ) {
    throw new Error("description length is invalid.");
  }
};
