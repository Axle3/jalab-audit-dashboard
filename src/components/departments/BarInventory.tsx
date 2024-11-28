import { useState } from 'react';
import AddDrinkForm from './bar/AddDrinkForm';
import InventoryTable from './bar/InventoryTable';
import { DrinkStock } from '@/types/departments';

const BarInventory = () => {
  const [drinks, setDrinks] = useState<DrinkStock[]>([]);

  return (
    <div className="space-y-6">
      <AddDrinkForm drinks={drinks} onDrinkAdded={setDrinks} />
      <InventoryTable drinks={drinks} onDrinksUpdate={setDrinks} />
    </div>
  );
};

export default BarInventory;