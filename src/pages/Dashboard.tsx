import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import LaundryForm from '@/components/departments/LaundryForm';
import HotelForm from '@/components/departments/HotelForm';
import BarInventory from '@/components/departments/BarInventory';
import DepartmentAnalytics from '@/components/analytics/DepartmentAnalytics';
import MonthlySummary from '@/components/analytics/MonthlySummary';
import ExportControls from '@/components/ExportControls';
import { Department } from '@/types/departments';
import { ArrowLeft, BarChart3, Building2, Receipt, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RecordData } from '@/utils/csvExport';
import { useQuery } from '@tanstack/react-query';
import { getRecords } from '@/utils/indexedDB';

const departments: Department[] = ['hotel', 'laundry', 'restaurant', 'bar'];

const Dashboard = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const exportData: RecordData[] = [];

  const { data: recentRecords = [] } = useQuery({
    queryKey: ['records'],
    queryFn: async () => {
      const records = await getRecords('records');
      return records.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
    }
  });

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
        return null;
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
      {!selectedDepartment && (
        <div className="space-y-8 animate-fadeIn">
          <ExportControls data={exportData} />
          
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
                  {recentRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        No records available
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentRecords.map((record: any) => (
                      <TableRow key={record.id}>
                        <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                        <TableCell className="capitalize">{record.department}</TableCell>
                        <TableCell className="text-right">₦{record.total.toLocaleString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <MonthlySummary />
        </div>
      )}
      {selectedDepartment && renderDepartmentContent()}
    </div>
  );
};

export default Dashboard;