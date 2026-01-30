import React, { useEffect, useState } from 'react';
import { memberService } from '@/services/member.service';
import type { FineRecord } from '@/types/api';
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

const MyFinesPage: React.FC = () => {
  const [records, setRecords] = useState<FineRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('unpaid');

  const fetchRecords = async () => {
    try {
      setIsLoading(true);
      const data = await memberService.getMyFineRecords(statusFilter);
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
      case 'paid':
        return 'default';
      case 'partial':
        return 'secondary';
      case 'unpaid':
        return 'destructive';
      case 'waived':
        return 'outline';
      default:
        return 'outline';
    }
  };

  // Calculate total outstanding
  const totalOutstanding = records.reduce((sum, record) => {
    if (record.fr_status === 'unpaid' || record.fr_status === 'partial') {
      return sum + ((record.fr_amount || 0) - (record.fr_paid_amount || 0));
    }
    return sum;
  }, 0);

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
          <h1 className="text-3xl font-bold">My Fines</h1>
          <p className="text-muted-foreground">View your fine status</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unpaid">Unpaid</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="waived">Waived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {totalOutstanding > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You have <strong>${totalOutstanding.toFixed(2)}</strong> in outstanding fines. 
            Please visit the library to make a payment.
          </AlertDescription>
        </Alert>
      )}

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
              <TableHead>Fine Amount</TableHead>
              <TableHead>Paid Amount</TableHead>
              <TableHead>Remaining</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No fine records found
                </TableCell>
              </TableRow>
            ) : (
              records.map((record, index) => (
                <TableRow key={record.fine_id || index}>
                  <TableCell className="font-medium">{record.b_title || 'N/A'}</TableCell>
                  <TableCell>${record.fr_amount?.toFixed(2) || '0.00'}</TableCell>
                  <TableCell>${record.fr_paid_amount?.toFixed(2) || '0.00'}</TableCell>
                  <TableCell className="font-medium">
                    ${((record.fr_amount || 0) - (record.fr_paid_amount || 0)).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(record.fr_status)}>
                      {record.fr_status || 'N/A'}
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

export default MyFinesPage;
