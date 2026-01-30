import { api } from '@/lib/api';
import type { Book, BorrowRecord, FineRecord, BorrowBookRequest } from '@/types/api';

export const memberService = {
  // Books
  getBooks: async (filters?: { category_name?: string; title?: string; author?: string }): Promise<Book[]> => {
    const response = await api.get<Book[]>('/member/books', { params: filters });
    return response.data || [];
  },

  // Borrow
  borrowBook: async (data: BorrowBookRequest): Promise<BorrowRecord[]> => {
    const response = await api.post<BorrowRecord[]>('/member/borrow-records', data);
    return response.data;
  },

  returnBook: async (borrowId: number): Promise<BorrowRecord[]> => {
    const response = await api.put<BorrowRecord[]>(`/member/borrow-records/${borrowId}`);
    return response.data;
  },

  // My Records
  getMyBorrowHistory: async (): Promise<BorrowRecord[]> => {
    const response = await api.get<BorrowRecord[]>('/member/borrow-records');
    return response.data || [];
  },

  getMyFineRecords: async (status?: string): Promise<FineRecord[]> => {
    const response = await api.get<FineRecord[]>('/member/fine-records', {
      params: status ? { status } : undefined,
    });
    return response.data || [];
  },
};
