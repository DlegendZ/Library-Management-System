import { api } from "@/lib/api";
import type {
  User,
  Book,
  Category,
  BorrowRecord,
  FineRecord,
  RegisterUserRequest,
  AddBookRequest,
  UpdateBookRequest,
  PayFineRequest,
} from "@/types/api";

export const librarianService = {
  // Members
  getMembers: async (): Promise<User[]> => {
    const response = await api.get<User[]>("/librarian/members");
    return response.data || [];
  },

  registerMember: async (data: RegisterUserRequest): Promise<User[]> => {
    const response = await api.post<User[]>("/librarian/members", data);
    return response.data;
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>("/librarian/categories");
    return response.data || [];
  },

  // Books
  addBook: async (data: AddBookRequest): Promise<Book[]> => {
    const response = await api.post<Book[]>("/librarian/books", data);
    return response.data;
  },

  updateBook: async (
    bookId: number,
    data: UpdateBookRequest,
  ): Promise<Book[]> => {
    const response = await api.put<Book[]>(`/librarian/books/${bookId}`, data);
    return response.data;
  },

  // Borrow Records
  getBorrowRecords: async (): Promise<BorrowRecord[]> => {
    const response = await api.get<BorrowRecord[]>("/librarian/borrow-records");
    return response.data || [];
  },

  // Fine Records
  getFineRecords: async (): Promise<FineRecord[]> => {
    const response = await api.get<FineRecord[]>("/librarian/fine-records");
    return response.data || [];
  },

  payFine: async (
    borrowId: number,
    data: PayFineRequest,
  ): Promise<FineRecord[]> => {
    const response = await api.put<FineRecord[]>(
      `/librarian/fine-records/${borrowId}`,
      data,
    );
    return response.data;
  },
};
