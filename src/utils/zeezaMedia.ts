const DB_NAME = 'zeezaPostMedia';
const STORE_NAME = 'media';
const DB_VERSION = 1;

const isBrowser = typeof window !== 'undefined' && 'indexedDB' in window;

const openDatabase = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    if (!isBrowser) {
      reject(new Error('IndexedDB is not available.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Unable to open media database.'));
  });

export const saveMediaBlob = async (key: string, blob: Blob) => {
  if (!isBrowser) return;
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(blob, key);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('Unable to store media blob.'));
    request.onerror = () => reject(request.error ?? new Error('Unable to store media blob.'));
  });
};

export const loadMediaBlob = async (key: string): Promise<Blob | null> => {
  if (!isBrowser) return null;
  const db = await openDatabase();
  return new Promise<Blob | null>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(key);
    request.onsuccess = () => {
      resolve(request.result ?? null);
    };
    request.onerror = () => reject(request.error ?? new Error('Unable to load media blob.'));
  });
};

export const deleteMediaBlob = async (key: string) => {
  if (!isBrowser) return;
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(key);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('Unable to delete media blob.'));
  });
};

