import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DrinkStock } from '@/types/departments';
import { useToast } from '@/components/ui/use-toast';
import { saveRecord } from '@/utils/indexedDB';
import { Trash2, Save } from 'lucide-react';

interface InventoryTableProps {
  drinks: DrinkStock[];
  onDrinksUpdate: (drinks: DrinkStock[]) => void;
}

const InventoryTable = ({ drinks, onDrinksUpdate }: InventoryTableProps) => {
  const [stockToAdd, setStockToAdd] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const handleUpdateStock = async (id: string, newStock: number) => {
    const updatedDrinks = drinks.map(drink => {
      if (drink.id === id) {
        const unitsSold = drink.previousStock - newStock;
        return {
          ...drink,
          currentStock: newStock,
          unitsSold: unitsSold >= 0 ? unitsSold : 0,
        };
      }
      return drink;
    });
    
    onDrinksUpdate(updatedDrinks);
  };

  const handleAddStock = async (id: string) => {
    const additionalStock = Number(stockToAdd[id] || 0);
    if (additionalStock <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Stock Amount",
        description: "Please enter a valid number of units to add",
      });
      return;
    }

    const updatedDrinks = drinks.map(drink => {
      if (drink.id === id) {
        const newStock = drink.currentStock + additionalStock;
        return {
          ...drink,
          currentStock: newStock,
        };
      }
      return drink;
    });

    onDrinksUpdate(updatedDrinks);
    setStockToAdd({ ...stockToAdd, [id]: '' });
  };

  const handleDeleteDrink = async (id: string) => {
    const updatedDrinks = drinks.filter(drink => drink.id !== id);
    onDrinksUpdate(updatedDrinks);
  };

  const handleSaveDailyRecord = async () => {
    // Save current record
    await saveRecord('barInventory', {
      date: new Date().toISOString(),
      drinks: drinks
    });

    // Prepare drinks for the next day
    const nextDayDrinks = drinks.map(drink => ({
      ...drink,
      previousStock: drink.currentStock, // Current stock becomes previous stock
      unitsSold: 0 // Reset units sold for the new day
    }));

    onDrinksUpdate(nextDayDrinks);
    
    toast({
      title: "Daily Record Saved",
      description: "Sales have been recorded and inventory prepared for the next day",
    });
  };

  const totalSales = drinks.reduce((total, drink) => {
    return total + (drink.unitsSold * drink.price);
  }, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Inventory Management</CardTitle>
        <Button 
          onClick={handleSaveDailyRecord}
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
              <TableHead>Drink Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Initial Stock</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Add Stock</TableHead>
              <TableHead>Units Sold</TableHead>
              <TableHead>Sales Amount</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drinks.map((drink) => (
              <TableRow key={drink.id}>
                <TableCell>{drink.name}</TableCell>
                <TableCell>₦{drink.price.toLocaleString()}</TableCell>
                <TableCell>{drink.previousStock}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={drink.currentStock}
                    onChange={(e) => handleUpdateStock(drink.id, Number(e.target.value))}
                    className="w-20"
                  />
                </TableCell>
                <TableCell className="space-x-2">
                  <Input
                    type="number"
                    value={stockToAdd[drink.id] || ''}
                    onChange={(e) => setStockToAdd({ ...stockToAdd, [drink.id]: e.target.value })}
                    className="w-20 inline-block"
                    placeholder="Units"
                  />
                  <Button 
                    onClick={() => handleAddStock(drink.id)}
                    size="sm"
                  >
                    Add
                  </Button>
                </TableCell>
                <TableCell>{drink.unitsSold}</TableCell>
                <TableCell>₦{(drink.unitsSold * drink.price).toLocaleString()}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteDrink(drink.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4">
          <p className="text-lg font-semibold">Total Sales: ₦{totalSales.toLocaleString()}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryTable;