import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { memberService } from "@/services/member.service";
import { BookOpen, FileText, DollarSign, Loader2 } from "lucide-react";

const MemberDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    availableBooks: 0,
    myBorrows: 0,
    myFines: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [books, borrows, unpaidFines, partialFines] = await Promise.all([
          memberService.getBooks(),
          memberService.getMyBorrowHistory(),
          memberService.getMyFineRecords("unpaid"),
          memberService.getMyFineRecords("partial"),
        ]);

        // Filter currently borrowed
        const currentBorrows =
          borrows?.filter((b) => b.br_status === "borrowed") || [];

        // Calculate outstanding fines for unpaid
        const unpaidTotal =
          unpaidFines?.reduce((sum, record) => {
            const amount = Number(record.fr_amount) || 0;
            const paidAmount = Number(record.fr_paid_amount) || 0;
            return sum + (amount - paidAmount);
          }, 0) || 0;

        // Calculate outstanding fines for partial
        const partialTotal =
          partialFines?.reduce((sum, record) => {
            const amount = Number(record.fr_amount) || 0;
            const paidAmount = Number(record.fr_paid_amount) || 0;
            return sum + (amount - paidAmount);
          }, 0) || 0;

        // Total outstanding fines
        const totalOutstandingFines = unpaidTotal + partialTotal;

        setStats({
          availableBooks:
            books?.filter((b) => b.b_status === "available")?.length || 0,
          myBorrows: currentBorrows.length,
          myFines: totalOutstandingFines,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

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
        <h1 className="text-3xl font-bold">Member Dashboard</h1>
        <p className="text-muted-foreground">
          Browse and borrow books from the library
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Books
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.availableBooks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Currently Borrowed
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.myBorrows}</div>
            <p className="text-xs text-muted-foreground">Max: 3 books</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Outstanding Fines
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.myFines}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberDashboard;
