    // A simple helper library for IndexedDB
    const db = {
      instance: null,

      init(dbName, version) {
        return new Promise((resolve, reject) => {
          const request = indexedDB.open(dbName, version);

          request.onupgradeneeded = (event) => {
            const dbInstance = event.target.result;
            // Create an object store for user data if it doesn't exist.
            // We'll use 'id' as the key path.
            if (!dbInstance.objectStoreNames.contains('userData')) {
              dbInstance.createObjectStore('userData', { keyPath: 'id' });
            }
          };

          request.onsuccess = (event) => {
            this.instance = event.target.result;
            console.log('Database initialized successfully.');
            resolve(this.instance);
          };

          request.onerror = (event) => {
            console.error('Database error:', event.target.errorCode);
            reject(event.target.errorCode);
          };
        });
      },

      save(storeName, data) {
        return new Promise((resolve, reject) => {
          if (!this.instance) {
            reject('Database not initialized.');
            return;
          }
          const transaction = this.instance.transaction([storeName], 'readwrite');
          const store = transaction.objectStore(storeName);
          const request = store.put(data); // 'put' will add or update the record

          request.onsuccess = () => resolve(request.result);
          request.onerror = (event) => reject(event.target.error);
        });
      },

      get(storeName, key) {
        return new Promise((resolve, reject) => {
          if (!this.instance) {
            reject('Database not initialized.');
            return;
          }
          const transaction = this.instance.transaction([storeName], 'readonly');
          const store = transaction.objectStore(storeName);
          const request = store.get(key);

          request.onsuccess = () => resolve(request.result);
          request.onerror = (event) => reject(event.target.error);
        });
      }
    };
    
