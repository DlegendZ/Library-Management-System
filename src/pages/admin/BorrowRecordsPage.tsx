import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const BorrowRecordsPage: React.FC = () => {
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchRecords = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getBorrowRecords(statusFilter === 'all' ? undefined : statusFilter);
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
  }, [statusFilter]);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Borrow Records</h1>
          <p className="text-muted-foreground">View all borrow transactions</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="borrowed">Borrowed</SelectItem>
            <SelectItem value="returned">Returned</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
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
              <TableHead>Member</TableHead>
              <TableHead>Book</TableHead>
              <TableHead>Borrowed At</TableHead>
              <TableHead>Due At</TableHead>
              <TableHead>Returned At</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No borrow records found
                </TableCell>
              </TableRow>
            ) : (
              records.map((record, index) => (
                <TableRow key={record.borrow_id || index}>
                  <TableCell>{record.borrow_id || 'N/A'}</TableCell>
                  <TableCell className="font-medium">{record.u_full_name || 'N/A'}</TableCell>
                  <TableCell>{record.b_title || 'N/A'}</TableCell>
                  <TableCell>{formatDate(record.br_borrowed_at)}</TableCell>
                  <TableCell>{formatDate(record.br_due_at)}</TableCell>
                  <TableCell>{formatDate(record.br_returned_at)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(record.br_status)}>
                      {record.br_status || 'N/A'}
                    </Badge>
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

export default BorrowRecordsPage;
