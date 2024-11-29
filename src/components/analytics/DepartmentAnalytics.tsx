import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { saveRecord } from '@/utils/indexedDB';
import { Save } from 'lucide-react';

interface AnalyticsProps {
  department: string;
}

const DepartmentAnalytics: React.FC<AnalyticsProps> = ({ department }) => {
  const { toast } = useToast();

  const handleSaveRecord = async () => {
    try {
      await saveRecord('records', {
        date: new Date().toISOString(),
        department,
        // Add any additional data you want to save
      });

      toast({
        title: "Record Saved",
        description: `Daily record for ${department} has been saved successfully.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save record. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="capitalize">{department} Records</CardTitle>
          <Button 
            onClick={handleSaveRecord}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Daily Record
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Cash</TableHead>
                <TableHead>POS</TableHead>
                <TableHead>Transfer</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No records available
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepartmentAnalytics;