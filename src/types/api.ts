// User types
export interface User {
  user_id: number;
  role_id: number;
  u_full_name: string;
  u_email: string;
  u_status: 'active' | 'suspended';
  u_created_at?: string;
}

export interface Role {
  role_id: number;
  r_name: string;
  r_description: string;
}

// Book types
export interface Book {
  book_id: number;
  category_id: number;
  b_isbn: string;
  b_title: string;
  b_author: string;
  b_total_copies: number;
  b_available_copies: number;
  b_status: 'available' | 'unavailable';
  // From join with categories
  c_name?: string;
  c_description?: string;
}

export interface Category {
  category_id: number;
  c_name: string;
  c_description: string;
}

// Borrow record types
export interface BorrowRecord {
  borrow_id: number;
  user_id: number;
  book_id: number;
  br_borrowed_at: string;
  br_due_at: string;
  br_returned_at?: string;
  br_status: 'borrowed' | 'returned' | 'overdue';
  // From joins
  u_full_name?: string;
  u_email?: string;
  b_title?: string;
  b_author?: string;
  b_isbn?: string;
}

// Fine record types
export interface FineRecord {
  fine_id: number;
  borrow_id: number;
  fr_amount: number;
  fr_paid_amount: number;
  fr_status: 'unpaid' | 'partial' | 'paid' | 'waived';
  fr_created_at?: string;
  // From joins
  user_id?: number;
  u_full_name?: string;
  u_email?: string;
  b_title?: string;
  book_id?: number;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
}

// Request body types
export interface RegisterUserRequest {
  full_name: string;
  email: string;
  password: string;
}

export interface AddBookRequest {
  category_id: number;
  isbn: string;
  title: string;
  author: string;
  total_copies: number;
  available_copies: number;
}

export interface UpdateBookRequest extends AddBookRequest {
  status: 'available' | 'unavailable';
}

export interface AddCategoryRequest {
  name: string;
  description: string;
}

export interface UpdateUserRoleStatusRequest {
  role_id?: number;
  status?: 'active' | 'suspended';
}

export interface PayFineRequest {
  amount: number;
}

export interface BorrowBookRequest {
  book_id: number;
}

// API Error type
export interface ApiError {
  message: string;
  status?: number;
}
