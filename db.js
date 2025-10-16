const db = {
    _db: null,
    init(dbName, version) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, version);

            request.onupgradeneeded = (event) => {
                this._db = event.target.result;
                // Store for general user profile (level, total points, etc.)
                if (!this._db.objectStoreNames.contains('userData')) {
                    this._db.createObjectStore('userData', { keyPath: 'id' });
                }
                // NEW: Store for subject-specific scores
                if (!this._db.objectStoreNames.contains('subjectScores')) {
                    this._db.createObjectStore('subjectScores', { keyPath: 'id' });
                }
            };

            request.onsuccess = (event) => {
                this._db = event.target.result;
                resolve();
            };

            request.onerror = (event) => {
                console.error('Database error:', event.target.error);
                reject(event.target.error);
            };
        });
    },

    save(storeName, data) {
        return new Promise((resolve, reject) => {
            if (!this._db) return reject('DB not initialized');
            const transaction = this._db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    get(storeName, id) {
        return new Promise((resolve, reject) => {
            if (!this._db) return reject('DB not initialized');
            const transaction = this._db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },
    
    // NEW: Function to get all records from a store
    getAll(storeName) {
        return new Promise((resolve, reject) => {
            if (!this._db) return reject('DB not initialized');
            const transaction = this._db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
};

