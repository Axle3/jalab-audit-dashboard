import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LaundryForm from '@/components/departments/LaundryForm';
import HotelForm from '@/components/departments/HotelForm';
import BarInventory from '@/components/departments/BarInventory';
import { Department } from '@/types/departments';

const departments: Department[] = ['hotel', 'laundry', 'restaurant', 'bar'];

const Dashboard = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  const renderDepartmentContent = () => {
    switch (selectedDepartment) {
      case 'laundry':
        return <LaundryForm />;
      case 'hotel':
        return <HotelForm />;
      case 'restaurant':
        return <HotelForm />;
      case 'bar':
        return <BarInventory />;
      default:
        return (
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