import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const HotelForm = () => {
  const [cash, setCash] = useState('');
  const [pos, setPos] = useState('');
  const [transfer, setTransfer] = useState('');
  const [debt, setDebt] = useState('');
  const [debtorName, setDebtorName] = useState('');
  const [debtorLocation, setDebtorLocation] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = Number(cash) + Number(pos) + Number(transfer) + Number(debt);
    toast({
      title: "Record Saved",
      description: `Total amount: ₦${total.toLocaleString()}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Hotel Record</CardTitle>
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
          <div className="space-y-2">
            <label htmlFor="debt">Debt Amount</label>
            <Input
              id="debt"
              type="number"
              value={debt}
              onChange={(e) => setDebt(e.target.value)}
              placeholder="Enter debt amount"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="debtorName">Debtor Name</label>
            <Input
              id="debtorName"
              type="text"
              value={debtorName}
              onChange={(e) => setDebtorName(e.target.value)}
              placeholder="Enter debtor name"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="debtorLocation">Debtor Location</label>
            <Textarea
              id="debtorLocation"
              value={debtorLocation}
              onChange={(e) => setDebtorLocation(e.target.value)}
              placeholder="Enter debtor location"
            />
          </div>
          <div className="pt-4">
            <p className="text-lg font-semibold">
              Total: ₦{((Number(cash) || 0) + (Number(pos) || 0) + (Number(transfer) || 0) + (Number(debt) || 0)).toLocaleString()}
            </p>
          </div>
          <Button type="submit" className="w-full">Save Record</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default HotelForm;