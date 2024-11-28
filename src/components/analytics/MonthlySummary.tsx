import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Department } from '@/types/departments';

const MonthlySummary = () => {
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const departments: Department[] = ['hotel', 'laundry', 'restaurant', 'bar'];

  // Initialize empty summary data
  const emptySummary = {
    sales: 0,
    expenses: 0
  };

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
              const summary = emptySummary;
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