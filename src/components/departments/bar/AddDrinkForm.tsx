import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DrinkStock } from '@/types/departments';
import { useToast } from '@/components/ui/use-toast';
import { saveRecord } from '@/utils/indexedDB';

interface AddDrinkFormProps {
  onDrinkAdded: (drinks: DrinkStock[]) => void;
  drinks: DrinkStock[];
}

const AddDrinkForm = ({ onDrinkAdded, drinks }: AddDrinkFormProps) => {
  const [newDrink, setNewDrink] = useState({
    name: '',
    price: '',
    currentStock: '',
  });
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
    onDrinkAdded(updatedDrinks);
    
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

  return (
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
  );
};

export default AddDrinkForm;