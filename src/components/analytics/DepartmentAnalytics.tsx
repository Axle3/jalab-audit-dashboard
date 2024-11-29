import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ExportControls from '@/components/ExportControls';

interface AnalyticsProps {
  department: string;
}

const DepartmentAnalytics: React.FC<AnalyticsProps> = ({ department }) => {
  const data = []; // This will be populated with actual records from IndexedDB

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
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No records available
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepartmentAnalytics;