import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ExportControls from '@/components/ExportControls';
import { useQuery } from '@tanstack/react-query';
import { getRecords } from '@/utils/indexedDB';
import { DailyRecord } from '@/types/departments';

interface AnalyticsProps {
  department: string;
}

const DepartmentAnalytics: React.FC<AnalyticsProps> = ({ department }) => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['records', department],
    queryFn: async () => {
      const allRecords = await getRecords('records');
      return allRecords
        .filter((record: DailyRecord) => record.department === department)
        .sort((a: DailyRecord, b: DailyRecord) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="capitalize">{department} Records</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ExportControls data={data} />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Cash</TableHead>
                <TableHead>POS</TableHead>
                <TableHead>Transfer</TableHead>
                <TableHead>Debt</TableHead>
                <TableHead>Debtors</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No records available
                  </TableCell>
                </TableRow>
              ) : (
                data.map((record: DailyRecord) => (
                  <TableRow key={record.id}>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell>₦{record.cash?.toLocaleString() || '0'}</TableCell>
                    <TableCell>₦{record.pos?.toLocaleString() || '0'}</TableCell>
                    <TableCell>₦{record.transfer?.toLocaleString() || '0'}</TableCell>
                    <TableCell>₦{record.debt?.toLocaleString() || '0'}</TableCell>
                    <TableCell>
                      {record.debtors?.map((debtor: any, index: number) => (
                        <div key={index} className="text-sm">
                          <p><strong>{debtor.name}</strong> - ₦{debtor.amount.toLocaleString()}</p>
                          <p className="text-muted-foreground">{debtor.location}</p>
                        </div>
                      ))}
                    </TableCell>
                    <TableCell className="text-right">₦{record.total?.toLocaleString() || '0'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepartmentAnalytics;