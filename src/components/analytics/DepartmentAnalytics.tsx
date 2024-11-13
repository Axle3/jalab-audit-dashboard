import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface AnalyticsProps {
  department: string;
}

const mockData = [
  { name: 'Mon', amount: 2400 },
  { name: 'Tue', amount: 1398 },
  { name: 'Wed', amount: 9800 },
  { name: 'Thu', amount: 3908 },
  { name: 'Fri', amount: 4800 },
  { name: 'Sat', amount: 3800 },
  { name: 'Sun', amount: 4300 },
];

const DepartmentAnalytics: React.FC<AnalyticsProps> = ({ department }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="capitalize">{department} Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer
              config={{
                amount: {
                  theme: {
                    light: "hsl(var(--primary))",
                    dark: "hsl(var(--primary))",
                  },
                },
              }}
            >
              <BarChart data={mockData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Bar
                  dataKey="amount"
                  fill="currentColor"
                  className="fill-primary"
                  radius={[4, 4, 0, 0]}
                />
                <ChartTooltip>
                  <ChartTooltipContent />
                </ChartTooltip>
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepartmentAnalytics;