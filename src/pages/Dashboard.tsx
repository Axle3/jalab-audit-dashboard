import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import LaundryForm from '@/components/departments/LaundryForm';
import HotelForm from '@/components/departments/HotelForm';
import BarInventory from '@/components/departments/BarInventory';
import ExpensesForm from '@/components/departments/ExpensesForm';
import DepartmentAnalytics from '@/components/analytics/DepartmentAnalytics';
import { Department } from '@/types/departments';

const departments: Department[] = ['hotel', 'laundry', 'restaurant', 'bar'];

// Mock data for previous records
const mockPreviousRecords = [
  { id: 1, department: 'hotel', date: '2024-03-15', revenue: 250000 },
  { id: 2, department: 'laundry', date: '2024-03-15', revenue: 45000 },
  { id: 3, department: 'restaurant', date: '2024-03-15', revenue: 180000 },
  { id: 4, department: 'bar', date: '2024-03-15', revenue: 95000 },
  { id: 5, department: 'hotel', date: '2024-03-14', revenue: 280000 },
  { id: 6, department: 'laundry', date: '2024-03-14', revenue: 52000 },
];

const Dashboard = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  const renderDepartmentContent = () => {
    switch (selectedDepartment) {
      case 'laundry':
        return (
          <div className="space-y-6">
            <LaundryForm />
            <DepartmentAnalytics department="laundry" />
          </div>
        );
      case 'hotel':
        return (
          <div className="space-y-6">
            <HotelForm />
            <DepartmentAnalytics department="hotel" />
          </div>
        );
      case 'restaurant':
        return (
          <div className="space-y-6">
            <HotelForm />
            <DepartmentAnalytics department="restaurant" />
          </div>
        );
      case 'bar':
        return (
          <div className="space-y-6">
            <BarInventory />
            <DepartmentAnalytics department="bar" />
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {departments.map((dept) => (
                <Card
                  key={dept}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedDepartment(dept)}
                >
                  <CardHeader>
                    <CardTitle className="capitalize">{dept}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      View and manage {dept} records
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ExpensesForm />
              <Card>
                <CardHeader>
                  <CardTitle>Previous Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockPreviousRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                          <TableCell className="capitalize">{record.department}</TableCell>
                          <TableCell className="text-right">₦{record.revenue.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        {selectedDepartment && (
          <button
            onClick={() => setSelectedDepartment(null)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Departments
          </button>
        )}
      </div>
      {renderDepartmentContent()}
    </div>
  );
};

export default Dashboard;