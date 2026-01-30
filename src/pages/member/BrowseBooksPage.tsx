import React, { useEffect, useState } from 'react';
import { memberService } from '@/services/member.service';
import type { Book } from '@/types/api';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Search, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

const BrowseBooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [borrowingId, setBorrowingId] = useState<number | null>(null);
  
  // Filter state
  const [filterType, setFilterType] = useState<string>('none');
  const [filterValue, setFilterValue] = useState('');

  const fetchBooks = async (filters?: { category_name?: string; title?: string; author?: string }) => {
    try {
      setIsLoading(true);
      const data = await memberService.getBooks(filters);
      setBooks(data);
      setError('');
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearch = () => {
    if (filterType === 'none' || !filterValue.trim()) {
      fetchBooks();
      return;
    }

    const filters: { category_name?: string; title?: string; author?: string } = {};
    if (filterType === 'category') filters.category_name = filterValue;
    if (filterType === 'title') filters.title = filterValue;
    if (filterType === 'author') filters.author = filterValue;
    
    fetchBooks(filters);
  };

  const handleBorrow = async (bookId: number) => {
    setBorrowingId(bookId);
    try {
      await memberService.borrowBook({ book_id: bookId });
      toast.success('Book borrowed successfully! Due in 14 days.');
      fetchBooks();
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setBorrowingId(null);
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
      <div>
        <h1 className="text-3xl font-bold">Browse Books</h1>
        <p className="text-muted-foreground">Find and borrow books from the library</p>
      </div>

      {/* Search/Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Filter</SelectItem>
            <SelectItem value="category">Category</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="author">Author</SelectItem>
          </SelectContent>
        </Select>
        
        {filterType !== 'none' && (
          <Input
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder={`Enter ${filterType}...`}
            className="flex-1 max-w-xs"
          />
        )}
        
        <Button onClick={handleSearch}>
          <Search className="mr-2 h-4 w-4" />
          Search
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
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No books found
                </TableCell>
              </TableRow>
            ) : (
              books.map((book) => (
                <TableRow key={book.book_id}>
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
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={book.b_status !== 'available' || book.b_available_copies <= 0 || borrowingId === book.book_id}
                      onClick={() => handleBorrow(book.book_id)}
                    >
                      {borrowingId === book.book_id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <BookOpen className="mr-1 h-4 w-4" />
                          Borrow
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BrowseBooksPage;
