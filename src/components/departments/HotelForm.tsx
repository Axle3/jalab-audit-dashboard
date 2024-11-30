import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { saveRecord } from '@/utils/indexedDB';
import { X } from 'lucide-react';

interface Debtor {
  name: string;
  location: string;
  amount: string;
}

const HotelForm = () => {
  const [cash, setCash] = useState('');
  const [pos, setPos] = useState('');
  const [transfer, setTransfer] = useState('');
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const { toast } = useToast();

  const addDebtor = () => {
    setDebtors([...debtors, { name: '', location: '', amount: '' }]);
  };

  const removeDebtor = (index: number) => {
    setDebtors(debtors.filter((_, i) => i !== index));
  };

  const updateDebtor = (index: number, field: keyof Debtor, value: string) => {
    const newDebtors = [...debtors];
    newDebtors[index] = { ...newDebtors[index], [field]: value };
    setDebtors(newDebtors);
  };

  const getTotalDebt = () => {
    return debtors.reduce((sum, debtor) => sum + (Number(debtor.amount) || 0), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalDebt = getTotalDebt();
    const total = Number(cash) + Number(pos) + Number(transfer) + totalDebt;
    
    try {
      const record = {
        date: new Date().toISOString(),
        department: 'hotel',
        cash: Number(cash),
        pos: Number(pos),
        transfer: Number(transfer),
        debtors: debtors.map(d => ({
          name: d.name,
          location: d.location,
          amount: Number(d.amount)
        })),
        debt: totalDebt,
        total
      };

      await saveRecord('records', record);

      toast({
        title: "Record Saved",
        description: `Total amount: ₦${total.toLocaleString()}`,
      });

      // Reset form
      setCash('');
      setPos('');
      setTransfer('');
      setDebtors([]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save record. Please try again.",
      });
    }
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

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-lg font-semibold">Debtors</label>
              <Button type="button" onClick={addDebtor} variant="outline">
                Add Debtor
              </Button>
            </div>
            
            {debtors.map((debtor, index) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => removeDebtor(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="space-y-2">
                  <label>Debtor Name</label>
                  <Input
                    value={debtor.name}
                    onChange={(e) => updateDebtor(index, 'name', e.target.value)}
                    placeholder="Enter debtor name"
                  />
                </div>
                <div className="space-y-2">
                  <label>Amount</label>
                  <Input
                    type="number"
                    value={debtor.amount}
                    onChange={(e) => updateDebtor(index, 'amount', e.target.value)}
                    placeholder="Enter debt amount"
                  />
                </div>
                <div className="space-y-2">
                  <label>Location</label>
                  <Textarea
                    value={debtor.location}
                    onChange={(e) => updateDebtor(index, 'location', e.target.value)}
                    placeholder="Enter debtor location"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 space-y-2">
            <p className="text-lg font-semibold">
              Total Debt: ₦{getTotalDebt().toLocaleString()}
            </p>
            <p className="text-lg font-semibold">
              Total: ₦{((Number(cash) || 0) + (Number(pos) || 0) + (Number(transfer) || 0) + getTotalDebt()).toLocaleString()}
            </p>
          </div>
          <Button type="submit" className="w-full">Save Record</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default HotelForm;