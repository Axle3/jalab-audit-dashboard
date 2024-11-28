import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { DrinkStock } from '@/types/departments';
import { saveRecord } from '@/utils/indexedDB';
import { Trash2 } from 'lucide-react';

const BarInventory = () => {
  const [drinks, setDrinks] = useState<DrinkStock[]>([]);
  const [newDrink, setNewDrink] = useState({
    name: '',
    price: '',
    currentStock: '',
  });
  const [stockToAdd, setStockToAdd] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const handleAddDrink = async (e: React.FormEvent) => {
    e.preventDefault();
    const initialStock = Number(newDrink.currentStock);
    const drink: DrinkStock = {
      id: Date.now().toString(),
      name: newDrink.name,
      price: Number(newDrink.price),
      previousStock: initialStock,
      currentStock: initialStock,
      unitsSold: 0,
    };
    
    const updatedDrinks = [...drinks, drink];
    setDrinks(updatedDrinks);
    
    // Save daily record
    await saveRecord('barInventory', {
      date: new Date().toISOString(),
      drinks: updatedDrinks
    });

    setNewDrink({ name: '', price: '', currentStock: '' });
    toast({
      title: "Drink Added",
      description: `${drink.name} has been added to inventory with initial stock of ${drink.currentStock} units`,
    });
  };

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
    
    setDrinks(updatedDrinks);
    
    // Save daily record
    await saveRecord('barInventory', {
      date: new Date().toISOString(),
      drinks: updatedDrinks
    });
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

    setDrinks(updatedDrinks);
    setStockToAdd({ ...stockToAdd, [id]: '' });
    
    // Save daily record
    await saveRecord('barInventory', {
      date: new Date().toISOString(),
      drinks: updatedDrinks
    });

    toast({
      title: "Stock Added",
      description: `Added ${additionalStock} units to inventory`,
    });
  };

  const handleDeleteDrink = async (id: string) => {
    const updatedDrinks = drinks.filter(drink => drink.id !== id);
    setDrinks(updatedDrinks);
    
    // Save daily record
    await saveRecord('barInventory', {
      date: new Date().toISOString(),
      drinks: updatedDrinks
    });

    toast({
      title: "Drink Deleted",
      description: "The drink has been removed from inventory",
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
    </div>
  );
};

export default BarInventory;