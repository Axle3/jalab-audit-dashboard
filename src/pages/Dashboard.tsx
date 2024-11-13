import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import LaundryForm from '@/components/departments/LaundryForm';
import HotelForm from '@/components/departments/HotelForm';
import BarInventory from '@/components/departments/BarInventory';
import ExpensesForm from '@/components/departments/ExpensesForm';
import DepartmentAnalytics from '@/components/analytics/DepartmentAnalytics';
import MonthlySummary from '@/components/analytics/MonthlySummary';
import { Department } from '@/types/departments';
import { ArrowLeft, BarChart3, Building2, Receipt, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  const getDepartmentIcon = (dept: Department) => {
    switch (dept) {
      case 'hotel':
        return <Building2 className="w-6 h-6" />;
      case 'bar':
        return <Receipt className="w-6 h-6" />;
      case 'restaurant':
        return <Wallet className="w-6 h-6" />;
      case 'laundry':
        return <BarChart3 className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const renderDepartmentContent = () => {
    switch (selectedDepartment) {
      case 'laundry':
        return (
          <div className="space-y-6 animate-fadeIn">
            <LaundryForm />
            <DepartmentAnalytics department="laundry" />
          </div>
        );
      case 'hotel':
        return (
          <div className="space-y-6 animate-fadeIn">
            <HotelForm />
            <DepartmentAnalytics department="hotel" />
          </div>
        );
      case 'restaurant':
        return (
          <div className="space-y-6 animate-fadeIn">
            <HotelForm />
            <DepartmentAnalytics department="restaurant" />
          </div>
        );
      case 'bar':
        return (
          <div className="space-y-6 animate-fadeIn">
            <BarInventory />
            <DepartmentAnalytics department="bar" />
          </div>
        );
      default:
        return (
          <div className="space-y-8 animate-fadeIn">
            <MonthlySummary />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {departments.map((dept) => (
                <Card
                  key={dept}
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer group animate-slideIn"
                  onClick={() => setSelectedDepartment(dept)}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium capitalize">{dept}</CardTitle>
                    {getDepartmentIcon(dept)}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                      View and manage {dept} records
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ExpensesForm />
              <Card>
                <CardHeader>
                  <CardTitle>Recent Records</CardTitle>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          {selectedDepartment ? (
            <span className="capitalize">{selectedDepartment} Department</span>
          ) : (
            'Dashboard Overview'
          )}
        </h2>
        {selectedDepartment && (
          <Button
            variant="ghost"
            onClick={() => setSelectedDepartment(null)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Overview
          </Button>
        )}
      </div>
      {renderDepartmentContent()}
    </div>
  );
};

export default Dashboard;