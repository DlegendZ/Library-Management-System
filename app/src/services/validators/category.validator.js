export const categoryValidatorSimple = async (name, description) => {
    if (!name || name.trim() === "") {
        throw new Error("Category name is required.");
    }

    if (!(typeof name === "string" && (name.length >= 2 && name.length <= 100))) {
        throw new Error("Category name length is invalid.");
    }

    if (!/^[A-Za-z0-9 ]+$/.test(name)) {
        throw new Error("Category name contains invalid characters.");
    }

    if (!(typeof description === "string" && (description.length >= 0 && description.length <= 255))) {
        throw new Error("Category description length is invalid.");
    }
}

export const categoryValidatorAll = async (category_id, name, description) => {
    if (!category_id) {
        throw new Error("Category ID is required.");
    }

    if (!(Number.isInteger(category_id) && category_id > 0)) {
        throw new Error("Category ID must be a positive integer.");
    }

    categoryValidatorSimple(name, description);
}