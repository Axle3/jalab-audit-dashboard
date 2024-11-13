import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Department } from '@/types/departments';

// Mock data - in a real app, this would come from your backend
const mockMonthlySummary = {
  hotel: { sales: 2500000, expenses: 1200000 },
  laundry: { sales: 800000, expenses: 300000 },
  restaurant: { sales: 1500000, expenses: 900000 },
  bar: { sales: 1200000, expenses: 600000 },
};

const MonthlySummary = () => {
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const departments: Department[] = ['hotel', 'laundry', 'restaurant', 'bar'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Summary - {currentMonth}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department</TableHead>
              <TableHead className="text-right">Total Sales</TableHead>
              <TableHead className="text-right">Total Expenses</TableHead>
              <TableHead className="text-right">Profit/Loss</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((dept) => {
              const summary = mockMonthlySummary[dept];
              const profit = summary.sales - summary.expenses;
              const isProfitable = profit > 0;

              return (
                <TableRow key={dept}>
                  <TableCell className="font-medium capitalize">{dept}</TableCell>
                  <TableCell className="text-right">
                    ₦{summary.sales.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    ₦{summary.expenses.toLocaleString()}
                  </TableCell>
                  <TableCell className={`text-right ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
                    ₦{Math.abs(profit).toLocaleString()} {isProfitable ? '(Profit)' : '(Loss)'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MonthlySummary;