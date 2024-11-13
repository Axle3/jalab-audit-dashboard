import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Department } from '@/types/departments';

const departments: Department[] = ['hotel', 'laundry', 'restaurant', 'bar'];

const Dashboard = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  return (
    <div className="space-y-6 animate-in">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      
      {!selectedDepartment ? (
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
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold capitalize">{selectedDepartment}</h3>
            <Button
              variant="outline"
              onClick={() => setSelectedDepartment(null)}
            >
              Back to Departments
            </Button>
          </div>
          {/* Department specific components will be added here */}
        </div>
      )}
    </div>
  );
};

export default Dashboard;