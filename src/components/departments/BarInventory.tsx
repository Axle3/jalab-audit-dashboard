import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AddDrinkForm from './bar/AddDrinkForm';
import InventoryTable from './bar/InventoryTable';
import { DrinkStock } from '@/types/departments';

const BarInventory = () => {
  const [drinks, setDrinks] = useState<DrinkStock[]>([]);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      {isAdmin && <AddDrinkForm drinks={drinks} onDrinkAdded={setDrinks} />}
      <InventoryTable drinks={drinks} onDrinksUpdate={setDrinks} isAdmin={isAdmin} />
    </div>
  );
};

export default BarInventory;