import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const LaundryForm = () => {
  const [cash, setCash] = useState('');
  const [pos, setPos] = useState('');
  const [transfer, setTransfer] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = Number(cash) + Number(pos) + Number(transfer);
    toast({
      title: "Record Saved",
      description: `Total amount: ₦${total.toLocaleString()}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Laundry Record</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="cash">Cash</label>
            <Input
              id="cash"
              type="number"
              value={cash}
              onChange={(e) => setCash(e.target.value)}
              placeholder="Enter cash amount"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="pos">POS</label>
            <Input
              id="pos"
              type="number"
              value={pos}
              onChange={(e) => setPos(e.target.value)}
              placeholder="Enter POS amount"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="transfer">Transfer</label>
            <Input
              id="transfer"
              type="number"
              value={transfer}
              onChange={(e) => setTransfer(e.target.value)}
              placeholder="Enter transfer amount"
            />
          </div>
          <div className="pt-4">
            <p className="text-lg font-semibold">
              Total: ₦{((Number(cash) || 0) + (Number(pos) || 0) + (Number(transfer) || 0)).toLocaleString()}
            </p>
          </div>
          <Button type="submit" className="w-full">Save Record</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LaundryForm;