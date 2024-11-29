const DB_NAME = 'jalabDB';
const DB_VERSION = 1;

interface DBSchema {
  records: {
    key: string;
    value: any;
    indexes: { "by-date": string };
  };
  expenses: {
    key: string;
    value: any;
    indexes: { "by-department": string };
  };
  barInventory: {
    key: string;
    value: {
      date: string;
      drinks: Array<{
        name: string;
        quantity: number;
        price: number;
      }>;
    };
    indexes: { "by-date": string };
  };
}

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains('records')) {
        const recordsStore = db.createObjectStore('records', { keyPath: 'id', autoIncrement: true });
        recordsStore.createIndex('by-date', 'date');
      }

      if (!db.objectStoreNames.contains('expenses')) {
        const expensesStore = db.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });
        expensesStore.createIndex('by-department', 'department');
      }

      if (!db.objectStoreNames.contains('barInventory')) {
        const barInventoryStore = db.createObjectStore('barInventory', { keyPath: 'date' });
        barInventoryStore.createIndex('by-date', 'date');
      }
    };
  });
};

export const clearAllRecords = async (): Promise<void> => {
  const db = await initDB();
  const stores = ['records', 'expenses', 'barInventory'];
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(stores, 'readwrite');
    let completed = 0;

    stores.forEach(storeName => {
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => {
        completed++;
        if (completed === stores.length) {
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });

    transaction.onerror = () => reject(transaction.error);
  });
};

export const saveRecord = async (storeName: keyof DBSchema, data: any): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.add(data);

    request.onsuccess = () => {
      // Create a backup file
      const backupData = JSON.stringify(data);
      const blob = new Blob([backupData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      a.href = url;
      a.download = `${storeName}-backup-${timestamp}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      resolve();
    };
    request.onerror = () => reject(request.error);
  });
};

export const getRecords = async (storeName: keyof DBSchema): Promise<any[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const updateRecord = async (storeName: keyof DBSchema, id: string, data: any): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put({ ...data, id });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const deleteRecord = async (storeName: keyof DBSchema, id: string): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};