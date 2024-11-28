import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { DrinkStock } from '@/types/departments';

const BarInventory = () => {
  const [drinks, setDrinks] = useState<DrinkStock[]>([]);
  const [newDrink, setNewDrink] = useState({
    name: '',
    price: '',
    currentStock: '',
  });
  const [stockToAdd, setStockToAdd] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const handleAddDrink = (e: React.FormEvent) => {
    e.preventDefault();
    const initialStock = Number(newDrink.currentStock);
    const drink: DrinkStock = {
      id: Date.now().toString(),
      name: newDrink.name,
      price: Number(newDrink.price),
      previousStock: initialStock, // This is the initial stock that will remain static
      currentStock: initialStock,
      unitsSold: 0,
    };
    setDrinks([...drinks, drink]);
    setNewDrink({ name: '', price: '', currentStock: '' });
    toast({
      title: "Drink Added",
      description: `${drink.name} has been added to inventory with initial stock of ${drink.currentStock} units`,
    });
  };

  const handleUpdateStock = (id: string, newStock: number) => {
    setDrinks(drinks.map(drink => {
      if (drink.id === id) {
        // Calculate units sold based on the difference between initial stock and current stock
        const unitsSold = drink.previousStock - newStock;
        return {
          ...drink,
          currentStock: newStock,
          unitsSold: unitsSold >= 0 ? unitsSold : 0,
        };
      }
      return drink;
    }));
  };

  const handleAddStock = (id: string) => {
    const additionalStock = Number(stockToAdd[id] || 0);
    if (additionalStock <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Stock Amount",
        description: "Please enter a valid number of units to add",
      });
      return;
    }

    setDrinks(drinks.map(drink => {
      if (drink.id === id) {
        const newStock = drink.currentStock + additionalStock;
        return {
          ...drink,
          currentStock: newStock,
          // Previous stock remains unchanged as it represents the initial stock
        };
      }
      return drink;
    }));

    setStockToAdd({ ...stockToAdd, [id]: '' });
    toast({
      title: "Stock Added",
      description: `Added ${additionalStock} units to inventory`,
    });
  };

  const totalSales = drinks.reduce((total, drink) => {
    return total + (drink.unitsSold * drink.price);
  }, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Drink</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddDrink} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="name">Drink Name</label>
                <Input
                  id="name"
                  value={newDrink.name}
                  onChange={(e) => setNewDrink({ ...newDrink, name: e.target.value })}
                  placeholder="Enter drink name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="price">Price</label>
                <Input
                  id="price"
                  type="number"
                  value={newDrink.price}
                  onChange={(e) => setNewDrink({ ...newDrink, price: e.target.value })}
                  placeholder="Enter price"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="stock">Initial Stock</label>
                <Input
                  id="stock"
                  type="number"
                  value={newDrink.currentStock}
                  onChange={(e) => setNewDrink({ ...newDrink, currentStock: e.target.value })}
                  placeholder="Enter initial stock"
                  required
                />
              </div>
            </div>
            <Button type="submit">Add Drink</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Management</CardTitle>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4">
            <p className="text-lg font-semibold">Total Sales: ₦{totalSales.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BarInventory;
