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

  const calculateDepartmentSummary = (department: Department) => {
    const departmentRecords = records.filter((record: any) => record.department === department);
    const totalSales = departmentRecords.reduce((sum: number, record: any) => sum + (record.total || 0), 0);
    return totalSales;
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((dept) => {
              const totalSales = calculateDepartmentSummary(dept);

              return (
                <TableRow key={dept}>
                  <TableCell className="font-medium capitalize">{dept}</TableCell>
                  <TableCell className="text-right">
                    ₦{totalSales.toLocaleString()}
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