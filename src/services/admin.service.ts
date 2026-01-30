import { api } from '@/lib/api';
import type {
  User,
  Role,
  Book,
  Category,
  BorrowRecord,
  FineRecord,
  RegisterUserRequest,
  AddBookRequest,
  UpdateBookRequest,
  AddCategoryRequest,
  UpdateUserRoleStatusRequest,
  PayFineRequest,
} from '@/types/api';

export const adminService = {
  // Users
  getUsers: async (status?: string): Promise<User[]> => {
    const response = await api.get<User[]>('/admin/users', {
      params: status ? { status } : undefined,
    });
    return response.data || [];
  },

  updateUserRoleOrStatus: async (userId: number, data: UpdateUserRoleStatusRequest): Promise<User[]> => {
    const response = await api.put<User[]>(`/admin/users/${userId}`, data);
    return response.data;
  },

  // Roles
  getRoles: async (): Promise<Role[]> => {
    const response = await api.get<Role[]>('/admin/roles');
    return response.data || [];
  },

  // Register admin/librarian
  registerAdmin: async (data: RegisterUserRequest): Promise<User[]> => {
    const response = await api.post<User[]>('/admin/admins', data);
    return response.data;
  },

  registerLibrarian: async (data: RegisterUserRequest): Promise<User[]> => {
    const response = await api.post<User[]>('/admin/librarians', data);
    return response.data;
  },

  // Books
  getBooks: async (): Promise<Book[]> => {
    const response = await api.get<Book[]>('/admin/books');
    return response.data || [];
  },

  addBook: async (data: AddBookRequest): Promise<Book[]> => {
    const response = await api.post<Book[]>('/admin/books', data);
    return response.data;
  },

  updateBook: async (bookId: number, data: UpdateBookRequest): Promise<Book[]> => {
    const response = await api.put<Book[]>(`/admin/books/${bookId}`, data);
    return response.data;
  },

  deleteBook: async (bookId: number): Promise<Book[]> => {
    const response = await api.delete<Book[]>(`/admin/books/${bookId}`);
    return response.data;
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/admin/categories');
    return response.data || [];
  },

  addCategory: async (data: AddCategoryRequest): Promise<Category[]> => {
    const response = await api.post<Category[]>('/admin/categories', data);
    return response.data;
  },

  // Borrow Records
  getBorrowRecords: async (status?: string): Promise<BorrowRecord[]> => {
    const response = await api.get<BorrowRecord[]>('/admin/borrow-records', {
      params: status ? { status } : undefined,
    });
    return response.data || [];
  },

  getMemberBorrowHistory: async (userId: number): Promise<BorrowRecord[]> => {
    const response = await api.get<BorrowRecord[]>(`/admin/members/${userId}/borrow-records`);
    return response.data || [];
  },

  // Fine Records
  getFineRecords: async (status?: string): Promise<FineRecord[]> => {
    const response = await api.get<FineRecord[]>('/admin/fine-records', {
      params: status ? { status } : undefined,
    });
    return response.data || [];
  },

  payFine: async (borrowId: number, data: PayFineRequest): Promise<FineRecord[]> => {
    const response = await api.put<FineRecord[]>(`/admin/fine-records/${borrowId}`, data);
    return response.data;
  },
};
