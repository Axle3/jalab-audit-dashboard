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
  const { toast } = useToast();

  const handleAddDrink = (e: React.FormEvent) => {
    e.preventDefault();
    const drink: DrinkStock = {
      id: Date.now().toString(),
      name: newDrink.name,
      price: Number(newDrink.price),
      previousStock: Number(newDrink.currentStock),
      currentStock: Number(newDrink.currentStock),
      unitsSold: 0,
    };
    setDrinks([...drinks, drink]);
    setNewDrink({ name: '', price: '', currentStock: '' });
    toast({
      title: "Drink Added",
      description: `${drink.name} has been added to inventory`,
    });
  };

  const handleUpdateStock = (id: string, newStock: number) => {
    setDrinks(drinks.map(drink => {
      if (drink.id === id) {
        const unitsSold = drink.previousStock - newStock;
        return {
          ...drink,
          previousStock: drink.currentStock,
          currentStock: newStock,
          unitsSold,
        };
      }
      return drink;
    }));
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
                <TableHead>Previous Stock</TableHead>
                <TableHead>Current Stock</TableHead>
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