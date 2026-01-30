import React, { useEffect, useState } from 'react';
import { librarianService } from '@/services/librarian.service';
import { adminService } from '@/services/admin.service';
import type { Category } from '@/types/api';
import { handleApiError } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

const AddBookPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    category_id: '',
    isbn: '',
    title: '',
    author: '',
    total_copies: '',
    available_copies: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Use admin service to get categories (librarians can view)
        const data = await adminService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await librarianService.addBook({
        category_id: parseInt(formData.category_id),
        isbn: formData.isbn,
        title: formData.title,
        author: formData.author,
        total_copies: parseInt(formData.total_copies),
        available_copies: parseInt(formData.available_copies),
      });
      toast.success('Book added successfully');
      setFormData({
        category_id: '',
        isbn: '',
        title: '',
        author: '',
        total_copies: '',
        available_copies: '',
      });
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Add Book</CardTitle>
              <CardDescription>Add a new book to the library</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label>Category</Label>
              <Select 
                value={formData.category_id} 
                onValueChange={(v) => setFormData({...formData, category_id: v})}
              >
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
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                value={formData.isbn}
                onChange={(e) => setFormData({...formData, isbn: e.target.value})}
                placeholder="978-0-123456-78-9"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Book title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
                placeholder="Author name (First Last)"
                required
              />
              <p className="text-xs text-muted-foreground">Must contain at least two words</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total_copies">Total Copies</Label>
                <Input
                  id="total_copies"
                  type="number"
                  value={formData.total_copies}
                  onChange={(e) => setFormData({...formData, total_copies: e.target.value})}
                  min="1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="available_copies">Available</Label>
                <Input
                  id="available_copies"
                  type="number"
                  value={formData.available_copies}
                  onChange={(e) => setFormData({...formData, available_copies: e.target.value})}
                  min="0"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Book
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBookPage;
