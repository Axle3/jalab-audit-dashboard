import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Department } from '@/types/departments';
import { useQuery } from '@tanstack/react-query';
import { getRecords } from '@/utils/indexedDB';

const MonthlySummary = () => {
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const departments: Department[] = ['hotel', 'laundry', 'restaurant', 'bar'];

  const { data: records = [] } = useQuery({
    queryKey: ['records', 'monthly'],
    queryFn: async () => {
      const allRecords = await getRecords('records');
      const currentMonthRecords = allRecords.filter((record: any) => {
        const recordDate = new Date(record.date);
        const now = new Date();
        return recordDate.getMonth() === now.getMonth() && recordDate.getFullYear() === now.getFullYear();
      });
      return currentMonthRecords;
    }
  });

  const { data: expenses = [] } = useQuery({
    queryKey: ['expenses', 'monthly'],
    queryFn: async () => {
      const allExpenses = await getRecords('expenses');
      const currentMonthExpenses = allExpenses.filter((expense: any) => {
        const expenseDate = new Date(expense.date);
        const now = new Date();
        return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
      });
      return currentMonthExpenses;
    }
  });

  const calculateDepartmentSummary = (department: Department) => {
    const departmentRecords = records.filter((record: any) => record.department === department);
    const departmentExpenses = expenses.filter((expense: any) => expense.department === department);

    const totalSales = departmentRecords.reduce((sum: number, record: any) => sum + record.total, 0);
    const totalExpenses = departmentExpenses.reduce((sum: number, expense: any) => sum + expense.amount, 0);

    return {
      sales: totalSales,
      expenses: totalExpenses
    };
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
              const summary = calculateDepartmentSummary(dept);
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