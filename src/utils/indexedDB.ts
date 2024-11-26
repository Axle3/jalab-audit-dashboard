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
}

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create stores for different types of data
      if (!db.objectStoreNames.contains('records')) {
        const recordsStore = db.createObjectStore('records', { keyPath: 'id', autoIncrement: true });
        recordsStore.createIndex('by-date', 'date');
      }

      if (!db.objectStoreNames.contains('expenses')) {
        const expensesStore = db.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });
        expensesStore.createIndex('by-department', 'department');
      }
    };
  });
};

export const saveRecord = async (storeName: keyof DBSchema, data: any): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.add(data);

    request.onsuccess = () => resolve();
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