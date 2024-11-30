import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Department } from '@/types/departments';
import { saveRecord } from '@/utils/indexedDB';
import { useQueryClient } from '@tanstack/react-query';

const ExpensesForm = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState<Department>('hotel');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !department) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    try {
      const expenseRecord = {
        id: Date.now().toString(),
        amount: Number(amount),
        description,
        department,
        date: new Date().toISOString()
      };

      await saveRecord('expenses', expenseRecord);

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expenses', 'monthly'] });

      toast({
        title: "Expense Recorded",
        description: `₦${Number(amount).toLocaleString()} expense recorded for ${department} department.`,
      });
      
      setAmount('');
      setDescription('');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save expense. Please try again.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="department" className="text-sm font-medium">Department</label>
            <Select value={department} onValueChange={(value: Department) => setDepartment(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hotel">Hotel</SelectItem>
                <SelectItem value="laundry">Laundry</SelectItem>
                <SelectItem value="restaurant">Restaurant</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">Amount</label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter expense amount"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter expense description"
              required
            />
          </div>
          <Button type="submit" className="w-full">Record Expense</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpensesForm;