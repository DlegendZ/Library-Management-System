import React, { useEffect, useState } from 'react';
import { memberService } from '@/services/member.service';
import type { BorrowRecord } from '@/types/api';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const MyBorrowsPage: React.FC = () => {
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [returningId, setReturningId] = useState<number | null>(null);

  const fetchRecords = async () => {
    try {
      setIsLoading(true);
      const data = await memberService.getMyBorrowHistory();
      setRecords(data);
      setError('');
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleReturn = async (borrowId: number) => {
    setReturningId(borrowId);
    try {
      await memberService.returnBook(borrowId);
      toast.success('Book returned successfully');
      fetchRecords();
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setReturningId(null);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'borrowed':
        return 'default';
      case 'returned':
        return 'secondary';
      case 'overdue':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
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
        <h1 className="text-3xl font-bold">My Borrows</h1>
        <p className="text-muted-foreground">View and manage your borrowed books</p>
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
              <TableHead>Book</TableHead>
              <TableHead>Borrowed At</TableHead>
              <TableHead>Due At</TableHead>
              <TableHead>Returned At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No borrow records found
                </TableCell>
              </TableRow>
            ) : (
              records.map((record, index) => (
                <TableRow key={record.borrow_id || index}>
                  <TableCell className="font-medium">{record.b_title || 'N/A'}</TableCell>
                  <TableCell>{formatDate(record.br_borrowed_at)}</TableCell>
                  <TableCell>{formatDate(record.br_due_at)}</TableCell>
                  <TableCell>{formatDate(record.br_returned_at)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(record.br_status)}>
                      {record.br_status || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {record.br_status === 'borrowed' && record.borrow_id && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={returningId === record.borrow_id}
                        onClick={() => handleReturn(record.borrow_id)}
                      >
                        {returningId === record.borrow_id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <RotateCcw className="mr-1 h-4 w-4" />
                            Return
                          </>
                        )}
                      </Button>
                    )}
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

export default MyBorrowsPage;
