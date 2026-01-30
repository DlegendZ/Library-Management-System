import React, { useEffect, useState } from "react";
import { librarianService } from "@/services/librarian.service";
import type { FineRecord } from "@/types/api";
import { handleApiError } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, DollarSign } from "lucide-react";
import { toast } from "sonner";

const LibrarianFineRecordsPage: React.FC = () => {
  const [records, setRecords] = useState<FineRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Pay fine dialog
  const [selectedRecord, setSelectedRecord] = useState<FineRecord | null>(null);
  const [payAmount, setPayAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRecords = async () => {
    try {
      setIsLoading(true);
      const data = await librarianService.getFineRecords();
      setRecords(data);
      setError("");
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handlePayFine = async () => {
    if (!selectedRecord) return;

    setIsSubmitting(true);
    try {
      await librarianService.payFine(selectedRecord.borrow_id, {
        amount: parseFloat(payAmount),
      });
      toast.success("Fine payment recorded");
      setSelectedRecord(null);
      setPayAmount("");
      fetchRecords();
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "default";
      case "partial":
        return "secondary";
      case "unpaid":
        return "destructive";
      case "waived":
        return "outline";
      default:
        return "outline";
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
        <h1 className="text-3xl font-bold">Fine Records</h1>
        <p className="text-muted-foreground">Manage overdue fines</p>
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
              <TableHead>Fine ID</TableHead>
              <TableHead>Member</TableHead>
              <TableHead>Book</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  No fine records found
                </TableCell>
              </TableRow>
            ) : (
              records.map((record, index) => {
                const amount = Number(record.fr_amount) || 0;
                const paidAmount = Number(record.fr_paid_amount) || 0;

                return (
                  <TableRow key={record.fine_id || index}>
                    <TableCell>{record.fine_id || "N/A"}</TableCell>
                    <TableCell className="font-medium">
                      {record.u_full_name || "N/A"}
                    </TableCell>
                    <TableCell>{record.b_title || "N/A"}</TableCell>
                    <TableCell>Rp{amount.toFixed(2)}</TableCell>
                    <TableCell>Rp{paidAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(record.fr_status)}>
                        {record.fr_status || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {record.fr_status !== "paid" &&
                        record.fr_status !== "waived" &&
                        record.borrow_id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRecord(record);
                              setPayAmount("");
                            }}
                          >
                            <DollarSign className="mr-1 h-4 w-4" />
                            Pay
                          </Button>
                        )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pay Fine Dialog */}
      <Dialog
        open={!!selectedRecord}
        onOpenChange={() => setSelectedRecord(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Fine Payment</DialogTitle>
            <DialogDescription>
              Record a payment for {selectedRecord?.u_full_name}'s fine
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-sm text-muted-foreground">
              <p>
                Total Fine: Rp
                {(Number(selectedRecord?.fr_amount) || 0).toFixed(2)}
              </p>
              <p>
                Already Paid: Rp
                {(Number(selectedRecord?.fr_paid_amount) || 0).toFixed(2)}
              </p>
              <p className="font-medium text-foreground">
                Remaining: Rp
                {(
                  (Number(selectedRecord?.fr_amount) || 0) -
                  (Number(selectedRecord?.fr_paid_amount) || 0)
                ).toFixed(2)}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Payment Amount</Label>
              <Input
                type="number"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRecord(null)}>
              Cancel
            </Button>
            <Button
              onClick={handlePayFine}
              disabled={isSubmitting || !payAmount}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Record Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LibrarianFineRecordsPage;
