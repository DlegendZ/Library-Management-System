import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import type { Book, Category } from '@/types/api';
import { handleApiError } from '@/lib/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Add/Edit dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    category_id: '',
    isbn: '',
    title: '',
    author: '',
    total_copies: '',
    available_copies: '',
    status: 'available' as 'available' | 'unavailable',
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [booksData, categoriesData] = await Promise.all([
        adminService.getBooks(),
        adminService.getCategories(),
      ]);
      setBooks(booksData);
      setCategories(categoriesData);
      setError('');
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({
      category_id: '',
      isbn: '',
      title: '',
      author: '',
      total_copies: '',
      available_copies: '',
      status: 'available',
    });
    setEditingBook(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleOpenEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      category_id: book.category_id.toString(),
      isbn: book.b_isbn,
      title: book.b_title,
      author: book.b_author,
      total_copies: book.b_total_copies.toString(),
      available_copies: book.b_available_copies.toString(),
      status: book.b_status,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        category_id: parseInt(formData.category_id),
        isbn: formData.isbn,
        title: formData.title,
        author: formData.author,
        total_copies: parseInt(formData.total_copies),
        available_copies: parseInt(formData.available_copies),
      };

      if (editingBook) {
        await adminService.updateBook(editingBook.book_id, {
          ...payload,
          status: formData.status,
        });
        toast.success('Book updated successfully');
      } else {
        await adminService.addBook(payload);
        toast.success('Book added successfully');
      }
      
      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (bookId: number) => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    
    try {
      await adminService.deleteBook(bookId);
      toast.success('Book deleted successfully');
      fetchData();
    } catch (err) {
      toast.error(handleApiError(err));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Books</h1>
          <p className="text-muted-foreground">Manage library books</p>
        </div>
        <Button onClick={handleOpenAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Book
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Copies</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No books found
                </TableCell>
              </TableRow>
            ) : (
              books.map((book) => (
                <TableRow key={book.book_id}>
                  <TableCell>{book.book_id}</TableCell>
                  <TableCell className="font-medium">{book.b_title}</TableCell>
                  <TableCell>{book.b_author}</TableCell>
                  <TableCell className="font-mono text-sm">{book.b_isbn}</TableCell>
                  <TableCell>{book.c_name || 'N/A'}</TableCell>
                  <TableCell>{book.b_available_copies}/{book.b_total_copies}</TableCell>
                  <TableCell>
                    <Badge variant={book.b_status === 'available' ? 'default' : 'secondary'}>
                      {book.b_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleOpenEdit(book)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(book.book_id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Book Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingBook ? 'Edit Book' : 'Add New Book'}</DialogTitle>
            <DialogDescription>
              {editingBook ? 'Update book information' : 'Add a new book to the library'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formData.category_id} onValueChange={(v) => setFormData({...formData, category_id: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.category_id} value={cat.category_id.toString()}>
                      {cat.c_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>ISBN</Label>
              <Input
                value={formData.isbn}
                onChange={(e) => setFormData({...formData, isbn: e.target.value})}
                placeholder="978-0-123456-78-9"
              />
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Book title"
              />
            </div>
            <div className="space-y-2">
              <Label>Author</Label>
              <Input
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
                placeholder="Author name (First Last)"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Total Copies</Label>
                <Input
                  type="number"
                  value={formData.total_copies}
                  onChange={(e) => setFormData({...formData, total_copies: e.target.value})}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Available Copies</Label>
                <Input
                  type="number"
                  value={formData.available_copies}
                  onChange={(e) => setFormData({...formData, available_copies: e.target.value})}
                  min="0"
                />
              </div>
            </div>
            {editingBook && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v as 'available' | 'unavailable'})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingBook ? 'Update' : 'Add'} Book
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BooksPage;
